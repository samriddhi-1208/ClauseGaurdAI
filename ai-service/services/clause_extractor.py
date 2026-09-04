import os
import json
import re
from typing import List, Dict, Any

ALLOWED_CATEGORIES = [
    "PAYMENT",
    "CONFIDENTIALITY",
    "TERMINATION",
    "LIABILITY",
    "DATA_PRIVACY",
    "DATA_RETENTION",
    "DATA_STORAGE",
    "JURISDICTION",
    "INTELLECTUAL_PROPERTY",
    "OTHER"
]

KEYWORD_RULES = {
    "DATA_RETENTION": [r"retain", r"retention", r"delete", r"deletion", r"store.*data", r"keep.*data", r"destroy.*data", r"5 years", r"2 years", r"data storage period"],
    "DATA_PRIVACY": [r"privacy", r"gdpr", r"personal data", r"pii", r"data protection", r"user data", r"privacy policy"],
    "DATA_STORAGE": [r"cloud", r"server", r"location", r"storage location", r"stored in", r"data center"],
    "PAYMENT": [r"pay", r"payment", r"invoice", r"fee", r"amount", r"usd", r"due", r"billing", r"30 days", r"60 days", r"remit"],
    "CONFIDENTIALITY": [r"confidential", r"non-disclosure", r"nda", r"proprietary", r"secret", r"disclosure"],
    "TERMINATION": [r"terminate", r"termination", r"cancel", r"cancellation", r"notice period", r"expire", r"expiry"],
    "LIABILITY": [r"liable", r"liability", r"indemnify", r"indemnification", r"damages", r"limitation of liability"],
    "JURISDICTION": [r"governing law", r"jurisdiction", r"court", r"arbitration", r"venue", r"laws of"],
    "INTELLECTUAL_PROPERTY": [r"intellectual property", r"copyright", r"trademark", r"patent", r"ownership", r"ip rights"]
}

def extract_clauses_with_gemini(document_text: str, pages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Extract legal clauses using Google Gemini API with fallback to keyword rule engine."""
    api_key = os.getenv("GEMINI_API_KEY", "")
    
    if api_key and api_key != "your_gemini_api_key_here":
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            
            prompt = f"""
You are an expert legal intelligence system. Analyze the following legal document text and extract all important clauses.
Categorize each extracted clause into EXACTLY ONE of these categories:
- PAYMENT
- CONFIDENTIALITY
- TERMINATION
- LIABILITY
- DATA_PRIVACY
- DATA_RETENTION
- DATA_STORAGE
- JURISDICTION
- INTELLECTUAL_PROPERTY
- OTHER

DOCUMENT TEXT:
{document_text[:8000]}

Respond ONLY with a valid JSON array of objects with the following schema:
[
  {{
    "category": "DATA_RETENTION",
    "content": "Exact clause text extracted from document",
    "pageNumber": 1,
    "confidence": 0.95
  }}
]
Do not add markdown formatting or extra text.
"""
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            raw_text = response.text.strip()
            # Clean possible markdown ```json codeblock
            if raw_text.startswith("```"):
                raw_text = re.sub(r"^```[a-zA-Z]*\n", "", raw_text)
                raw_text = re.sub(r"\n```$", "", raw_text)
                
            parsed = json.loads(raw_text)
            if isinstance(parsed, list) and len(parsed) > 0:
                validated = []
                for item in parsed:
                    cat = str(item.get("category", "OTHER")).upper()
                    if cat not in ALLOWED_CATEGORIES:
                        cat = "OTHER"
                    validated.append({
                        "category": cat,
                        "content": str(item.get("content", "")).strip(),
                        "pageNumber": int(item.get("pageNumber", 1)),
                        "confidence": float(item.get("confidence", 0.9))
                    })
                return validated
        except Exception as e:
            print(f"[Gemini Clause Extraction Notice] Gemini API call failed or failed parsing: {e}. Using fallback rule engine.")

    # Rule-based fallback clause extraction
    return extract_clauses_fallback(pages)

def extract_clauses_fallback(pages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Extract clauses using semantic sentence breaking and keyword regex patterns."""
    clauses = []
    
    for p in pages:
        page_num = p["page"]
        text = p["text"]
        
        # Split text into sentence/paragraph chunks
        paragraphs = re.split(r'\n{2,}|\.\s+', text)
        
        for para in paragraphs:
            para_clean = para.strip()
            if len(para_clean) < 20:
                continue
                
            matched_category = None
            for cat, rules in KEYWORD_RULES.items():
                for pattern in rules:
                    if re.search(pattern, para_clean, re.IGNORECASE):
                        matched_category = cat
                        break
                if matched_category:
                    break
                    
            if matched_category:
                clauses.append({
                    "category": matched_category,
                    "content": para_clean + ("." if not para_clean.endswith(".") else ""),
                    "pageNumber": page_num,
                    "confidence": 0.85
                })
                
    if not clauses:
        # Generic fallback clause if no keywords matched
        clauses.append({
            "category": "OTHER",
            "content": "General contract terms and conditions.",
            "pageNumber": 1,
            "confidence": 0.70
        })
        
    return clauses
