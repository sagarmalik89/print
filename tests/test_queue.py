"""
tests/test_queue.py
-------------------
Unit tests for PrintQueueManager (no real printer needed – mocked).
Run with:  python -m pytest tests/ -v
"""

import sys
import time
import unittest
from pathlib import Path
from unittest.mock import MagicMock, patch

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from printer_agent.queue_manager import PrintJob, PrintQueueManager


class TestPrintJob(unittest.TestCase):
    def test_job_created_with_auto_id(self):
        job = PrintJob(priority=3, file_path=Path("test.pdf"))
        self.assertTrue(len(job.job_id) > 0)

    def test_job_ordering_by_priority(self):
        high = PrintJob(priority=1, file_path=Path("high.pdf"))
        low  = PrintJob(priority=9, file_path=Path("low.pdf"))
        self.assertLess(high, low)   # lower number = higher priority

    def test_job_str(self):
        job = PrintJob(priority=5, file_path=Path("doc.pdf"))
        self.assertIn("doc.pdf", str(job))


class TestPrintQueueManager(unittest.TestCase):
    def setUp(self):
        self.mgr = PrintQueueManager()

    def tearDown(self):
        self.mgr.stop(timeout=2)

    @patch("printer_agent.queue_manager.print_file")
    @patch("printer_agent.queue_manager.shutil.move")
    def test_enqueue_and_process(self, mock_move, mock_print):
        """Job should be processed and marked completed."""
        # Create a temporary fake file so file_path.exists() passes
        import tempfile, os
        with tempfile.NamedTemporaryFile(suffix=".txt", delete=False) as f:
            tmp = Path(f.name)

        try:
            self.mgr.start()
            jid = self.mgr.enqueue(tmp, priority=1)

            # Wait up to 5 s for the job to complete
            deadline = time.monotonic() + 5
            while time.monotonic() < deadline:
                if jid in self.mgr._completed or jid in self.mgr._failed:
                    break
                time.sleep(0.1)

            self.assertIn(jid, self.mgr._completed, "Job should be in completed list")
            mock_print.assert_called_once()
        finally:
            os.unlink(tmp) if tmp.exists() else None

    def test_status_returns_dict(self):
        s = self.mgr.status()
        self.assertIn("queued", s)
        self.assertIn("retrying", s)
        self.assertIn("completed", s)
        self.assertIn("failed", s)

    @patch("printer_agent.queue_manager.print_file", side_effect=RuntimeError("Printer offline"))
    @patch("printer_agent.queue_manager.shutil.move")
    @patch("printer_agent.queue_manager.RETRY_DELAY_SEC", 0)
    def test_retry_on_failure(self, mock_move, mock_print):
        """A failing job should retry MAX_RETRIES times then land in _failed."""
        import tempfile, os
        from printer_agent import config as cfg

        with tempfile.NamedTemporaryFile(suffix=".txt", delete=False) as f:
            tmp = Path(f.name)

        try:
            self.mgr.start()
            jid = self.mgr.enqueue(tmp, priority=1)

            # With RETRY_DELAY_SEC=0 all retries fire immediately;
            # give it 15 s to complete MAX_RETRIES=3 attempts.
            deadline = time.monotonic() + 15
            while time.monotonic() < deadline:
                if jid in self.mgr._failed:
                    break
                time.sleep(0.2)

            self.assertIn(jid, self.mgr._failed)
            self.assertEqual(mock_print.call_count, cfg.MAX_RETRIES)
        finally:
            os.unlink(tmp) if tmp.exists() else None


if __name__ == "__main__":
    unittest.main(verbosity=2)
