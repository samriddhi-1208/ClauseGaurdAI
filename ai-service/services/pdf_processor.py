import os
import re
from typing import List, Dict, Any

def extract_pdf_pages(file_path: str) -> List[Dict[str, Any]]:
    """
    Extract text per page from a PDF file.
    If PyMuPDF (fitz) fails or text file is passed, fallback gracefully.
    """
    pages = []
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    # Check if file is plain text or PDF
    ext = os.path.splitext(file_path)[1].lower()
    
    if ext == ".txt":
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        pages.append({"page": 1, "text": clean_text(content)})
        return pages

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
            pages.append({"page": 1, "text": clean_text(content)})
        except Exception as err:
            print(f"[PDF Extractor Error] Failed to read {file_path}: {err}")
            pages.append({"page": 1, "text": "Document content could not be extracted."})
            
    if not pages:
        pages.append({"page": 1, "text": "Empty document."})
        
    return pages

def clean_text(text: str) -> str:
    """Clean excess whitespace and formatting artifacts while preserving meaningful content."""
    if not text:
        return ""
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
