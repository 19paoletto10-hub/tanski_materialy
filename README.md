# Portal dydaktyczny (PWr / Wydział Medyczny) — final stabilny

Dwie zakładki:
- **Materiały** — auto-indeks z folderu `wyklady/` → `data/materials.json` (generuje GitHub Actions)
- **Ogłoszenia** — `data/announcements.json`

## Jak dodać materiał (PDF/DOCX/PPTX)
1. Wgraj plik do `wyklady/`
2. Commit + push do `main`
3. GitHub Actions wygeneruje `data/materials.json` i wykład pojawi się na stronie

## Jak dodać ogłoszenie
Edytuj `data/announcements.json` (w polu `items`), commit/push.

## GitHub Pages
Settings → Pages:
- Deploy from a branch
- Branch: `main`
- Folder: `/(root)`

## Uprawnienia Actions
Settings → Actions → General → Workflow permissions:
- ✅ Read and write permissions
