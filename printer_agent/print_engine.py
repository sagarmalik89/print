"""
printer_agent/print_engine.py
------------------------------
Low-level print functions for PDF, DOCX, and TXT files on Windows.
Uses the Windows Shell / win32print APIs so no extra drivers are needed.
"""

import shutil
import subprocess
import tempfile
from pathlib import Path

import win32api
import win32con
import win32print

from .config import DEFAULT_PRINTER, COPIES
from .logger import get_logger, Path as _P  # noqa: re-export for type hints

logger = get_logger("print_engine")


# ──────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────

def get_default_printer() -> str:
    """Return the currently configured printer (from config or OS default)."""
    if DEFAULT_PRINTER:
        return DEFAULT_PRINTER
    return win32print.GetDefaultPrinter()


def list_printers() -> list[dict]:
    """Return a list of all installed printers with basic info."""
    printers = []
    for flags in (
        win32print.PRINTER_ENUM_LOCAL,
        win32print.PRINTER_ENUM_CONNECTIONS,
    ):
        for p in win32print.EnumPrinters(flags, None, 2):
            printers.append(
                {
                    "name":   p["pPrinterName"],
                    "driver": p["pDriverName"],
                    "port":   p["pPortName"],
                    "status": p["Status"],
                }
            )
    return printers


# ──────────────────────────────────────────────────────────────────
# File-type dispatchers
# ──────────────────────────────────────────────────────────────────

def _print_via_shell(file_path: Path, printer_name: str) -> None:
    """
    Use the Windows Shell 'print' verb.
    Works for any file type that has a registered print handler
    (PDF via Acrobat/Edge, DOCX via Word, TXT via Notepad, etc.).
    """
    logger.debug("Shell-print '%s' → printer '%s'", file_path.name, printer_name)
    win32api.ShellExecute(
        0,              # hwnd
        "print",        # verb
        str(file_path), # file
        f'/d:"{printer_name}"',  # parameters
        ".",            # working dir
        win32con.SW_HIDE,
    )


def _print_txt_raw(file_path: Path, printer_name: str) -> None:
    """Send a plain-text file directly to the printer as raw bytes."""
    logger.debug("RAW-print TXT '%s'", file_path.name)
    hprinter = win32print.OpenPrinter(printer_name)
    try:
        win32print.StartDocPrinter(hprinter, 1, (file_path.name, None, "RAW"))
        win32print.StartPagePrinter(hprinter)
        data = file_path.read_bytes()
        win32print.WritePrinter(hprinter, data)
        win32print.EndPagePrinter(hprinter)
        win32print.EndDocPrinter(hprinter)
    finally:
        win32print.ClosePrinter(hprinter)


def _print_docx(file_path: Path, printer_name: str) -> None:
    """
    Convert DOCX → PDF via LibreOffice (if available), then print the PDF.
    Falls back to Shell-print if LibreOffice is not installed.
    """
    soffice = shutil.which("soffice") or shutil.which("soffice.exe")
    if soffice:
        with tempfile.TemporaryDirectory() as tmp:
            logger.debug("Converting DOCX → PDF via LibreOffice")
            subprocess.run(
                [soffice, "--headless", "--convert-to", "pdf",
                 "--outdir", tmp, str(file_path)],
                check=True,
                capture_output=True,
            )
            pdf_path = Path(tmp) / (file_path.stem + ".pdf")
            if pdf_path.exists():
                _print_via_shell(pdf_path, printer_name)
                return
    # fallback
    logger.warning("LibreOffice not found – falling back to Shell print for DOCX")
    _print_via_shell(file_path, printer_name)


# ──────────────────────────────────────────────────────────────────
# Public API
# ──────────────────────────────────────────────────────────────────

def print_file(file_path: Path, printer_name: str = "", copies: int = COPIES) -> None:
    """
    Print *file_path* to *printer_name* (defaults to system default).

    Supported extensions: .pdf, .docx, .doc, .txt
    Raises FileNotFoundError or RuntimeError on failure.
    """
    file_path = Path(file_path).resolve()
    if not file_path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    printer = printer_name or get_default_printer()
    ext = file_path.suffix.lower()

    logger.info("🖨  Printing '%s' (%s) → '%s' [copies=%d]",
                file_path.name, ext, printer, copies)

    for copy_num in range(copies):
        if copies > 1:
            logger.debug("  Copy %d/%d", copy_num + 1, copies)

        if ext == ".txt":
            _print_txt_raw(file_path, printer)
        elif ext in (".docx", ".doc"):
            _print_docx(file_path, printer)
        else:
            # .pdf and anything else with a registered shell handler
            _print_via_shell(file_path, printer)

    logger.info("✅  Print job submitted for '%s'", file_path.name)
