import os
import re
from typing import List, Dict, Any

def extract_pdf_pages(file_path: str) -> List[Dict[str, Any]]:
    """
    Extract text per page/section from PDF, DOCX, or TXT file.
    Preserves exact multi-page numbering for PDF, single section for DOCX/TXT.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".txt":
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        cleaned = clean_text(content)
        if not cleaned:
            raise ValueError(f"TXT document contains no extractable text: {file_path}")
        return [{"page": 1, "text": cleaned}]

    if ext == ".docx":
        try:
            import docx
            doc = docx.Document(file_path)
            paragraphs = []
            # Extract paragraphs, ignoring blank lines
            for p in doc.paragraphs:
                txt = p.text.strip()
                if txt:
                    paragraphs.append(txt)
            # Also extract table text if present
            for table in doc.tables:
                for row in table.rows:
                    row_txt = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                    if row_txt:
                        paragraphs.append(" | ".join(row_txt))

            full_text = clean_text("\n\n".join(paragraphs))
            if not full_text:
                raise ValueError(f"DOCX document contains no extractable text: {file_path}")
            return [{"page": 1, "text": full_text}]
        except Exception as e:
            if isinstance(e, ValueError):
                raise e
            raise ValueError(f"Corrupted or unreadable DOCX file ({type(e).__name__}): {e}")

    if ext == ".pdf":
        pages = []
        try:
            import fitz  # PyMuPDF
            doc = fitz.open(file_path)
            for page_num in range(len(doc)):
                page = doc[page_num]
                text = page.get_text()
                cleaned = clean_text(text)
                if cleaned:
                    pages.append({"page": page_num + 1, "text": cleaned})
            doc.close()
        except Exception as e:
            print(f"[PDF Extractor Warning] PyMuPDF failed for {file_path}: {e}. Falling back to plain text read.")
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                cleaned = clean_text(content)
                if cleaned:
                    pages.append({"page": 1, "text": cleaned})
            except Exception as err:
                raise ValueError(f"Corrupted or unreadable PDF file: {err}")

        if not pages:
            raise ValueError(f"PDF document contains no extractable text: {file_path}")
        return pages

    raise ValueError(f"Unsupported document file extension: {ext}")

def clean_text(text: str) -> str:
    """Clean excess whitespace and formatting artifacts while preserving meaningful content."""
    if not text:
        return ""
    # Strip non-printable control characters except whitespace (\n, \r, \t)
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)
    # Normalize line breaks and multiple spaces
    text = re.sub(r'\r\n', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def chunk_pages(pages: List[Dict[str, Any]], chunk_size: int = 1000, chunk_overlap: int = 200) -> List[Dict[str, Any]]:
    """Chunk extracted pages into semantic blocks maintaining page metadata."""
    chunks = []
    chunk_index = 0

    for p in pages:
        page_num = p["page"]
        text = p["text"]

        if len(text) <= chunk_size:
            chunks.append({
                "chunkId": f"p{page_num}_c{chunk_index}",
                "pageNumber": page_num,
                "content": text
            })
            chunk_index += 1
            continue

        start = 0
        while start < len(text):
            end = start + chunk_size
            chunk_str = text[start:end]
            chunks.append({
                "chunkId": f"p{page_num}_c{chunk_index}",
                "pageNumber": page_num,
                "content": chunk_str
            })
            chunk_index += 1
            start += (chunk_size - chunk_overlap)

    return chunks
