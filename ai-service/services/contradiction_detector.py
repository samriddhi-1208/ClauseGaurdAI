import os
import json
import re
from typing import List, Dict, Any

def analyze_cross_document_contradictions(clauses: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Core USP: Group clauses by category, candidate match across distinct documents,
    and evaluate with Gemini AI or intelligent contradiction heuristic engine.
    """
    if len(clauses) < 2:
        return []

    # Step 1: Group clauses by category
    categorized: Dict[str, List[Dict[str, Any]]] = {}
    for c in clauses:
        cat = c.get("category", "OTHER")
        if cat not in categorized:
            categorized[cat] = []
        categorized[cat].append(c)

    findings = []

    # Step 2: Compare across different documents within each category
    for cat, items in categorized.items():
        # Group items by documentId
        doc_grouped: Dict[str, List[Dict[str, Any]]] = {}
        for item in items:
            d_id = item["documentId"]
            if d_id not in doc_grouped:
                doc_grouped[d_id] = []
            doc_grouped[d_id].append(item)

        doc_ids = list(doc_grouped.keys())
        if len(doc_ids) < 2:
            # Need at least two different documents in the same category to find cross-document contradiction
            continue

        # Step 3: Create candidate pairs between distinct documents
        for i in range(len(doc_ids)):
            for j in range(i + 1, len(doc_ids)):
                docA_id = doc_ids[i]
                docB_id = doc_ids[j]
                
                clauses_A = doc_grouped[docA_id]
                clauses_B = doc_grouped[docB_id]

                for itemA in clauses_A:
                    for itemB in clauses_B:
                        # Evaluate pair
                        finding = evaluate_clause_pair(itemA, itemB, cat)
                        if finding and finding["classification"] != "NO_SIGNIFICANT_CONFLICT":
                            findings.append(finding)

    return findings

def evaluate_clause_pair(clauseA: Dict[str, Any], clauseB: Dict[str, Any], category: str) -> Dict[str, Any]:
    """Evaluate candidate pair using Gemini API or heuristic contradiction rules."""
    textA = clauseA["content"]
    textB = clauseB["content"]
    docA_name = clauseA.get("documentName", "Document A")
    docB_name = clauseB.get("documentName", "Document B")

    api_key = os.getenv("GEMINI_API_KEY", "")
    
    if api_key and api_key != "your_gemini_api_key_here":
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            
            prompt = f"""
You are a senior legal contradiction analyst. Compare the following two clauses from two different legal documents for category '{category}'.

DOCUMENT A ({docA_name}):
"{textA}"

DOCUMENT B ({docB_name}):
"{textB}"

Task:
Determine if there is a contradiction or inconsistency between these two clauses.
Classification options:
- POTENTIAL_CONTRADICTION (High direct conflict)
- POTENTIAL_INCONSISTENCY (Medium noticeable difference or ambiguity)
- NO_SIGNIFICANT_CONFLICT (Clauses are compatible or cover separate scope)
- UNCERTAIN (Insufficient detail to conclude)

Risk Level options:
- HIGH (Direct clash in legal obligations, durations, or monetary terms)
- MEDIUM (Different operational requirements or timelines)
- LOW (Minor ambiguity or subtle variation)

Respond ONLY in valid JSON format:
{{
  "classification": "POTENTIAL_CONTRADICTION",
  "riskLevel": "HIGH",
  "confidence": 0.92,
  "explanation": "Document A requires customer data retention for 5 years, whereas Document B mandates permanent deletion after 2 years. These obligations directly clash.",
  "recommendation": "Review data lifecycle obligations with legal counsel to harmonize retention schedules across both contracts."
}}
Do not add markdown backticks.
"""
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            raw_text = response.text.strip()
            if raw_text.startswith("```"):
                raw_text = re.sub(r"^```[a-zA-Z]*\n", "", raw_text)
                raw_text = re.sub(r"\n```$", "", raw_text)
                
            res = json.loads(raw_text)
            
            return {
                "category": category,
                "classification": res.get("classification", "POTENTIAL_INCONSISTENCY"),
                "riskLevel": res.get("riskLevel", "MEDIUM"),
                "confidence": float(res.get("confidence", 0.88)),
                "documentA": {"id": clauseA["documentId"], "name": docA_name},
                "documentB": {"id": clauseB["documentId"], "name": docB_name},
                "clauseA": {"content": textA, "pageNumber": clauseA.get("pageNumber", 1)},
                "clauseB": {"content": textB, "pageNumber": clauseB.get("pageNumber", 1)},
                "explanation": res.get("explanation", "Potential inconsistency detected between document terms."),
                "recommendation": res.get("recommendation", "Review clauses with legal counsel.")
            }
        except Exception as e:
            print(f"[Gemini Contradiction Warning] API call failed: {e}. Falling back to heuristic contradiction engine.")

    # Smart Heuristic Fallback Contradiction Engine
    return evaluate_pair_heuristic(clauseA, clauseB, category)

def evaluate_pair_heuristic(clauseA: Dict[str, Any], clauseB: Dict[str, Any], category: str) -> Dict[str, Any]:
    """Smart heuristic contradiction analysis based on numeric, temporal, and semantic pattern clashes."""
    textA = clauseA["content"].lower()
    textB = clauseB["content"].lower()

    # Pattern 1: Data Retention & Deletion Clash (e.g. 5 years vs 2 years)
    if category in ["DATA_RETENTION", "DATA_PRIVACY"]:
        numsA = re.findall(r'\b\d+\b', textA)
        numsB = re.findall(r'\b\d+\b', textB)
        
        has_retain_A = "retain" in textA or "keep" in textA or "store" in textA
        has_delete_B = "delete" in textB or "destroy" in textB or "erase" in textB
        
        if (has_retain_A and (has_delete_B or "delete" in textB)) and numsA != numsB:
            return {
                "category": category,
                "classification": "POTENTIAL_CONTRADICTION",
                "riskLevel": "HIGH",
                "confidence": 0.94,
                "documentA": {"id": clauseA["documentId"], "name": clauseA.get("documentName", "Document A")},
                "documentB": {"id": clauseB["documentId"], "name": clauseB.get("documentName", "Document B")},
                "clauseA": {"content": clauseA["content"], "pageNumber": clauseA.get("pageNumber", 1)},
                "clauseB": {"content": clauseB["content"], "pageNumber": clauseB.get("pageNumber", 1)},
                "explanation": f"Document A specifies a data retention/storage requirement of {' '.join(numsA)} years/period, whereas Document B requires data deletion after {' '.join(numsB)} years. Compliance with both is impossible.",
                "recommendation": "Harmonize data retention and deletion schedules across both agreements with your data privacy officer."
            }

    # Pattern 2: Payment Days Inconsistency (e.g. 30 days vs 60 days)
    if category == "PAYMENT":
        daysA = re.findall(r'(\d+)\s*days?', textA)
        daysB = re.findall(r'(\d+)\s*days?', textB)
        
        if daysA and daysB and daysA[0] != daysB[0]:
            return {
                "category": category,
                "classification": "POTENTIAL_INCONSISTENCY",
                "riskLevel": "MEDIUM",
                "confidence": 0.89,
                "documentA": {"id": clauseA["documentId"], "name": clauseA.get("documentName", "Document A")},
                "documentB": {"id": clauseB["documentId"], "name": clauseB.get("documentName", "Document B")},
                "clauseA": {"content": clauseA["content"], "pageNumber": clauseA.get("pageNumber", 1)},
                "clauseB": {"content": clauseB["content"], "pageNumber": clauseB.get("pageNumber", 1)},
                "explanation": f"Document A mandates payment completion within {daysA[0]} days, whereas Document B specifies {daysB[0]} days. This creates ambiguity regarding payment deadlines.",
                "recommendation": "Clarify invoice payment terms and grace periods in a binding addendum."
            }

    # Default heuristic comparison
    return {
        "category": category,
        "classification": "NO_SIGNIFICANT_CONFLICT",
        "riskLevel": "LOW",
        "confidence": 0.70,
        "documentA": {"id": clauseA["documentId"], "name": clauseA.get("documentName", "Document A")},
        "documentB": {"id": clauseB["documentId"], "name": clauseB.get("documentName", "Document B")},
        "clauseA": {"content": clauseA["content"], "pageNumber": clauseA.get("pageNumber", 1)},
        "clauseB": {"content": clauseB["content"], "pageNumber": clauseB.get("pageNumber", 1)},
        "explanation": "No direct legal obligation conflict detected between these clause texts.",
        "recommendation": "No immediate legal action required."
    }
