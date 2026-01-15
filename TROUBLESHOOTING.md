# Troubleshooting

Jeśli strona długo pokazuje „Ładowanie…”:

1) Otwórz adres z końcowym ukośnikiem:
- ✅ `https://<login>.github.io/tanski-materialy/`
- ❌ `https://<login>.github.io/tanski-materialy`

2) Otwórz DevTools (F12):
- Console: sprawdź czy nie ma błędu JS
- Network: sprawdź statusy:
  - `assets/js/app.js` → 200
  - `data/materials.json` → 200
  - `data/announcements.json` → 200

3) Automatyczne materiały:
- Dodaj plik do `wyklady/`
- Repo → **Actions** → workflow „Generate materials index”
- Ustaw: Settings → Actions → Workflow permissions → **Read and write** (musi być)

4) Cache:
- `Ctrl+F5` (twarde odświeżenie)
