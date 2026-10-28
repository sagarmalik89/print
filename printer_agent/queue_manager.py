"""
printer_agent/queue_manager.py
-------------------------------
Thread-safe priority print queue with retry logic.

Priority: 1 = highest, 10 = lowest  (like most job schedulers)
"""

import dataclasses
import queue
import shutil
import threading
import time
from pathlib import Path
from typing import Optional

from .config import (
    FAILED_FOLDER,
    MAX_RETRIES,
    PROCESSED_FOLDER,
    QUEUE_POLL_SEC,
    RETRY_DELAY_SEC,
)
from .logger import get_logger
from .print_engine import print_file

logger = get_logger("queue_manager")


# ──────────────────────────────────────────────────────────────────
# Job dataclass
# ──────────────────────────────────────────────────────────────────

@dataclasses.dataclass(order=True)
class PrintJob:
    priority:     int          # 1 = highest
    file_path:    Path         = dataclasses.field(compare=False)
    printer_name: str          = dataclasses.field(compare=False, default="")
    copies:       int          = dataclasses.field(compare=False, default=1)
    retries:      int          = dataclasses.field(compare=False, default=0)
    job_id:       str          = dataclasses.field(compare=False, default="")

    def __post_init__(self):
        if not self.job_id:
            import uuid
            self.job_id = str(uuid.uuid4())[:8]

    def __str__(self):
        return (
            f"PrintJob(id={self.job_id}, file={self.file_path.name!r}, "
            f"priority={self.priority}, retries={self.retries})"
        )


# ──────────────────────────────────────────────────────────────────
# Queue Manager
# ──────────────────────────────────────────────────────────────────

class PrintQueueManager:
    """
    Manages a priority queue of print jobs and processes them in a
    dedicated background thread.
    """

    def __init__(self):
        self._queue: queue.PriorityQueue[PrintJob] = queue.PriorityQueue()
        self._retry_heap: list[tuple[float, PrintJob]] = []   # (run_after_ts, job)
        self._lock = threading.Lock()
        self._stop_event = threading.Event()
        self._worker_thread: Optional[threading.Thread] = None
        self._completed: list[str] = []     # job_ids of finished jobs
        self._failed:    list[str] = []     # job_ids of permanently failed jobs

    # ── Public API ────────────────────────────────────────────────

    def enqueue(
        self,
        file_path: Path,
        priority: int = 5,
        printer_name: str = "",
        copies: int = 1,
    ) -> str:
        """Add a new print job. Returns the job ID."""
        job = PrintJob(
            priority=priority,
            file_path=Path(file_path),
            printer_name=printer_name,
            copies=copies,
        )
        self._queue.put(job)
        logger.info("➕ Enqueued %s (priority=%d)", job, priority)
        return job.job_id

    def start(self) -> None:
        """Start the background worker thread."""
        if self._worker_thread and self._worker_thread.is_alive():
            logger.warning("Worker already running.")
            return
        self._stop_event.clear()
        self._worker_thread = threading.Thread(
            target=self._worker_loop, daemon=True, name="PrintQueueWorker"
        )
        self._worker_thread.start()
        logger.info("🚀 Print queue worker started.")

    def stop(self, timeout: float = 10.0) -> None:
        """Signal the worker to stop and wait for it to finish."""
        self._stop_event.set()
        if self._worker_thread:
            self._worker_thread.join(timeout=timeout)
        logger.info("🛑 Print queue worker stopped.")

    def status(self) -> dict:
        """Return current queue statistics."""
        return {
            "queued":    self._queue.qsize(),
            "retrying":  len(self._retry_heap),
            "completed": len(self._completed),
            "failed":    len(self._failed),
        }

    # ── Internal worker ───────────────────────────────────────────

    def _worker_loop(self) -> None:
        while not self._stop_event.is_set():
            # 1. Re-queue any retry jobs whose delay has elapsed
            self._flush_retries()

            # 2. Try to grab the next job
            try:
                job = self._queue.get(timeout=QUEUE_POLL_SEC)
            except queue.Empty:
                continue

            self._process_job(job)

    def _flush_retries(self) -> None:
        now = time.monotonic()
        with self._lock:
            ready = [item for item in self._retry_heap if item[0] <= now]
            for item in ready:
                self._retry_heap.remove(item)
                logger.debug("♻️  Re-queuing retry job %s", item[1].job_id)
                self._queue.put(item[1])

    def _process_job(self, job: PrintJob) -> None:
        logger.info("▶️  Processing %s", job)
        try:
            print_file(job.file_path, job.printer_name, job.copies)
            self._on_success(job)
        except Exception as exc:
            logger.error("❌ Print failed for %s: %s", job, exc)
            self._on_failure(job, exc)

    def _on_success(self, job: PrintJob) -> None:
        self._completed.append(job.job_id)
        dest = PROCESSED_FOLDER / job.file_path.name
        try:
            shutil.move(str(job.file_path), str(dest))
            logger.info("📂 Moved '%s' → processed/", job.file_path.name)
        except Exception as e:
            logger.warning("Could not move file to processed/: %s", e)

    def _on_failure(self, job: PrintJob, exc: Exception) -> None:
        job.retries += 1
        if job.retries < MAX_RETRIES:
            run_after = time.monotonic() + RETRY_DELAY_SEC
            logger.warning(
                "⏳ Will retry %s in %ds (attempt %d/%d)",
                job.job_id, RETRY_DELAY_SEC, job.retries, MAX_RETRIES,
            )
            with self._lock:
                self._retry_heap.append((run_after, job))
        else:
            logger.error(
                "💀 Job %s permanently failed after %d attempts.", job.job_id, MAX_RETRIES
            )
            self._failed.append(job.job_id)
            dest = FAILED_FOLDER / job.file_path.name
            try:
                shutil.move(str(job.file_path), str(dest))
            except Exception:
                pass


# ── Module-level singleton ─────────────────────────────────────────
queue_manager = PrintQueueManager()
