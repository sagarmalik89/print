"""
printer_agent/folder_watcher.py
--------------------------------
Watches the configured WATCH_FOLDER for new files and auto-queues them.
Uses the watchdog library for cross-platform filesystem events.
"""

import time
from pathlib import Path

from watchdog.events import FileCreatedEvent, FileSystemEventHandler
from watchdog.observers import Observer

from .config import SUPPORTED_EXTENSIONS, WATCH_FOLDER
from .logger import get_logger
from .queue_manager import queue_manager

logger = get_logger("folder_watcher")


class _PrintFileHandler(FileSystemEventHandler):
    """Watchdog handler that enqueues newly created files."""

    def on_created(self, event: FileCreatedEvent) -> None:
        if event.is_directory:
            return

        file_path = Path(event.src_path)
        if file_path.suffix.lower() not in SUPPORTED_EXTENSIONS:
            logger.debug("Ignored (unsupported type): %s", file_path.name)
            return

        # Brief wait to ensure the file write is complete
        time.sleep(1.0)
        if not file_path.exists():
            return

        logger.info("📥 New file detected: '%s'", file_path.name)
        queue_manager.enqueue(file_path, priority=5)


class FolderWatcher:
    """Wraps watchdog Observer for easy start/stop."""

    def __init__(self, watch_path: Path = WATCH_FOLDER):
        self.watch_path = watch_path
        self._observer = Observer()
        self._handler  = _PrintFileHandler()

    def start(self) -> None:
        self.watch_path.mkdir(parents=True, exist_ok=True)
        self._observer.schedule(self._handler, str(self.watch_path), recursive=False)
        self._observer.start()
        logger.info("👁  Watching folder: %s", self.watch_path)

    def stop(self) -> None:
        self._observer.stop()
        self._observer.join()
        logger.info("👁  Folder watcher stopped.")


# Module-level singleton
folder_watcher = FolderWatcher()
