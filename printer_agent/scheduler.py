"""
printer_agent/scheduler.py
---------------------------
Schedules print jobs at specific times using the 'schedule' library.
Jobs are defined in config.SCHEDULED_JOBS.
"""

import threading
import time
from pathlib import Path

import schedule as _schedule

from .config import SCHEDULED_JOBS
from .logger import get_logger
from .queue_manager import queue_manager

logger = get_logger("scheduler")


def _build_print_callback(file_path: str, priority: int):
    def _callback():
        path = Path(file_path)
        if not path.exists():
            logger.warning("⚠️  Scheduled file not found: %s", file_path)
            return
        logger.info("🗓  Scheduled print triggered for '%s'", path.name)
        queue_manager.enqueue(path, priority=priority)
    return _callback


class PrintScheduler:
    """Loads scheduled jobs from config and runs them in a background thread."""

    def __init__(self):
        self._stop_event = threading.Event()
        self._thread: threading.Thread | None = None

    def load_jobs(self) -> None:
        """Register all jobs defined in config.SCHEDULED_JOBS."""
        for job_def in SCHEDULED_JOBS:
            file_path = job_def.get("file", "")
            run_time  = job_def.get("time", "08:00")     # "HH:MM"
            priority  = int(job_def.get("priority", 5))

            if not file_path:
                logger.warning("Skipping scheduled job with no file path.")
                continue

            callback = _build_print_callback(file_path, priority)
            _schedule.every().day.at(run_time).do(callback)
            logger.info(
                "🗓  Scheduled: '%s' at %s (priority=%d)",
                Path(file_path).name, run_time, priority,
            )

    def add_job(self, file_path: str, run_time: str, priority: int = 5) -> None:
        """Dynamically add a one-off daily scheduled job."""
        callback = _build_print_callback(file_path, priority)
        _schedule.every().day.at(run_time).do(callback)
        logger.info(
            "➕ Dynamic schedule added: '%s' at %s", Path(file_path).name, run_time
        )

    def start(self) -> None:
        """Start the scheduler loop in a background daemon thread."""
        self.load_jobs()
        self._stop_event.clear()
        self._thread = threading.Thread(
            target=self._run_loop, daemon=True, name="PrintScheduler"
        )
        self._thread.start()
        logger.info("🗓  Print scheduler started (%d job(s) loaded).", len(_schedule.jobs))

    def stop(self) -> None:
        self._stop_event.set()
        if self._thread:
            self._thread.join(timeout=5)
        _schedule.clear()
        logger.info("🗓  Print scheduler stopped.")

    def _run_loop(self) -> None:
        while not self._stop_event.is_set():
            _schedule.run_pending()
            time.sleep(1)


# Module-level singleton
print_scheduler = PrintScheduler()
