"""
tests/test_print_engine.py
--------------------------
Tests for print_engine helpers (printer listing, file validation, etc.)
Run with:  python -m pytest tests/ -v
"""

import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import MagicMock, patch

sys.path.insert(0, str(Path(__file__).parent.parent))


class TestPrintEngine(unittest.TestCase):

    @patch("win32print.EnumPrinters", return_value=[
        {"pPrinterName": "Test Printer", "pDriverName": "Driver1",
         "pPortName": "USB001", "Status": 0}
    ])
    def test_list_printers(self, _mock):
        from printer_agent.print_engine import list_printers
        printers = list_printers()
        self.assertIsInstance(printers, list)
        self.assertTrue(any(p["name"] == "Test Printer" for p in printers))

    def test_print_file_missing_raises(self):
        from printer_agent.print_engine import print_file
        with self.assertRaises(FileNotFoundError):
            print_file(Path("nonexistent_file_xyz.pdf"))

    @patch("win32print.GetDefaultPrinter", return_value="My Default Printer")
    def test_get_default_printer_from_os(self, _mock):
        import printer_agent.config as cfg
        orig = cfg.DEFAULT_PRINTER
        cfg.DEFAULT_PRINTER = ""
        try:
            from printer_agent.print_engine import get_default_printer
            result = get_default_printer()
            self.assertEqual(result, "My Default Printer")
        finally:
            cfg.DEFAULT_PRINTER = orig

    @patch("printer_agent.print_engine.DEFAULT_PRINTER", "ConfigPrinter")
    def test_get_default_printer_from_config(self):
        """When config has a printer name set, it should be returned directly."""
        from printer_agent.print_engine import get_default_printer
        result = get_default_printer()
        self.assertEqual(result, "ConfigPrinter")

    @patch("win32api.ShellExecute")
    @patch("win32print.GetDefaultPrinter", return_value="FakePrinter")
    def test_print_pdf_calls_shell(self, _mock_printer, mock_shell):
        from printer_agent.print_engine import print_file
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as f:
            tmp = Path(f.name)
        try:
            print_file(tmp)
            mock_shell.assert_called_once()
        finally:
            tmp.unlink(missing_ok=True)

    @patch("win32print.OpenPrinter")
    @patch("win32print.StartDocPrinter")
    @patch("win32print.StartPagePrinter")
    @patch("win32print.WritePrinter")
    @patch("win32print.EndPagePrinter")
    @patch("win32print.EndDocPrinter")
    @patch("win32print.ClosePrinter")
    @patch("win32print.GetDefaultPrinter", return_value="FakePrinter")
    def test_print_txt_raw(self, *mocks):
        from printer_agent.print_engine import print_file
        with tempfile.NamedTemporaryFile(suffix=".txt", delete=False,
                                         mode="w") as f:
            f.write("Hello printer!")
            tmp = Path(f.name)
        try:
            print_file(tmp)   # should call raw print path
        finally:
            tmp.unlink(missing_ok=True)


if __name__ == "__main__":
    unittest.main(verbosity=2)
