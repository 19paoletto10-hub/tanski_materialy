#!/usr/bin/env python3
"""
Generate data/materials.json by scanning wyklady/ (including subfolders).

Recommended naming convention:
  YYYY-MM-DD_Temat_wykladu.pdf
"""

import json, re
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
WYKLADY = ROOT / "wyklady"
OUT = ROOT / "data" / "materials.json"

ALLOWED = {".pdf",".pptx",".ppt",".docx",".doc",".xlsx",".xls",".png",".jpg",".jpeg"}

def slugify(s: str) -> str:
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-{2,}", "-", s).strip("-")
    return s or "item"

def guess_date(name: str) -> str:
    m = re.match(r"^(\d{4})-(\d{2})-(\d{2})[_ -]", name)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
    m = re.match(r"^(\d{4})(\d{2})(\d{2})[_ -]", name)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
    return ""

def prettify_title(filename: str) -> str:
    base = re.sub(r"\.[^.]+$", "", filename)
    base = re.sub(r"^\d{4}[-]?\d{2}[-]?\d{2}[_ -]+", "", base)
    base = base.replace("_", " ")
    base = re.sub(r"\s{2,}", " ", base).strip()
    return base or filename

def rel_tags(path: Path):
    rel = path.relative_to(WYKLADY)
    parts = list(rel.parts[:-1])
    tags=[]
    for part in parts:
        part = part.replace("_"," ").strip()
        if part:
            tags.append(part)
    return tags

def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    if not WYKLADY.exists():
        payload = {"meta":{"generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")}, "items":[]}
        OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print("No wyklady/ folder found. Generated empty index.")
        return

    files = [p for p in WYKLADY.rglob("*") if p.is_file() and p.suffix.lower() in ALLOWED]
    items=[]
    for f in files:
        rel = f.relative_to(ROOT).as_posix()
        date = guess_date(f.name)
        year = date[:4] if date else ""
        ext = f.suffix[1:].upper()
        title = prettify_title(f.name)
        tags = rel_tags(f)
        if year:
            tags.append(year)

        items.append({
            "id": slugify(rel),
            "title": title,
            "type": ext,
            "year": year,
            "date": date,
            "tags": tags,
            "description": f"Plik: {ext}",
            "url": rel,
            "preview": rel if f.suffix.lower()==".pdf" else ""
        })

    def sort_key(x):
        return (x.get("date") or "", x.get("title") or "")
    items.sort(key=sort_key, reverse=True)

    payload = {"meta":{"generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")}, "items": items}
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Generated {OUT} with {len(items)} items.")

if __name__ == "__main__":
    main()
