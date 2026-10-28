"""
printer_agent/config.py
-----------------------
Central configuration for the Printer Agent.
Edit the values here or override via environment variables.
"""

import os
from pathlib import Path

# ──────────────────────────────────────────────
# PATHS
# ──────────────────────────────────────────────
BASE_DIR        = Path(__file__).parent.parent
WATCH_FOLDER    = BASE_DIR / "watch_folder"      # Drop files here to auto-print
PROCESSED_FOLDER= BASE_DIR / "processed"         # Successfully printed files land here
FAILED_FOLDER   = BASE_DIR / "failed"            # Files that failed all retries
LOGS_DIR        = BASE_DIR / "logs"

# Auto-create folders
for _dir in (WATCH_FOLDER, PROCESSED_FOLDER, FAILED_FOLDER, LOGS_DIR):
    _dir.mkdir(parents=True, exist_ok=True)

# ──────────────────────────────────────────────
# PRINTER SETTINGS
# ──────────────────────────────────────────────
DEFAULT_PRINTER = os.environ.get("PRINTER_NAME", "")   # "" = system default printer
COPIES          = int(os.environ.get("PRINTER_COPIES", 1))

# ──────────────────────────────────────────────
# QUEUE / RETRY SETTINGS
# ──────────────────────────────────────────────
MAX_RETRIES      = 3          # How many times to retry a failed job
RETRY_DELAY_SEC  = 30         # Seconds between retries
QUEUE_POLL_SEC   = 2          # How often the queue worker checks for new jobs (seconds)

# ──────────────────────────────────────────────
# SUPPORTED FILE TYPES
# ──────────────────────────────────────────────
SUPPORTED_EXTENSIONS = {".pdf", ".docx", ".doc", ".txt"}

# ──────────────────────────────────────────────
# SCHEDULED JOBS  (add as many as you like)
# ──────────────────────────────────────────────
# Format: {"file": <path or glob>, "time": "HH:MM", "priority": 1-10}
SCHEDULED_JOBS = [
    # Example: print a daily report every morning
    # {"file": str(BASE_DIR / "reports" / "daily_report.pdf"), "time": "08:00", "priority": 5},
]
