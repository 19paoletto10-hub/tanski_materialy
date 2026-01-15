# Rozwiązywanie problemów

## 🔄 Strona pokazuje „Ładowanie…" zbyt długo

### 1. Sprawdź adres URL
- ✅ Poprawny: `https://<login>.github.io/tanski_materialy/`
- ❌ Błędny: `https://<login>.github.io/tanski_materialy` (brak `/` na końcu)

### 2. Otwórz narzędzia deweloperskie (F12)
**Zakładka Console** — sprawdź czy nie ma błędów JavaScript:
- `Failed to fetch` → problem z połączeniem lub CORS
- `SyntaxError` → błąd w pliku JSON
- `404 Not Found` → brakuje pliku

**Zakładka Network** — sprawdź statusy plików:
| Plik | Oczekiwany status |
|------|-------------------|
| `app.js` | 200 OK |
| `materials.json` | 200 OK |
| `announcements.json` | 200 OK |

### 3. Wymuś odświeżenie
- Windows/Linux: `Ctrl + F5`
- Mac: `Cmd + Shift + R`

---

## 📁 Materiały nie pojawiają się na liście

### 1. Sprawdź czy plik jest w folderze `wyklady/`
```
wyklady/
├── 2026-01-15_Temat_wykladu.pdf
└── subfolder/
    └── inny_plik.pptx
```

### 2. Upewnij się, że rozszerzenie jest obsługiwane
Dozwolone formaty: `.pdf`, `.pptx`, `.ppt`, `.docx`, `.doc`, `.xlsx`, `.xls`, `.png`, `.jpg`, `.jpeg`, `.mp4`, `.zip`

### 3. Sprawdź GitHub Actions
1. Wejdź w repozytorium → zakładka **Actions**
2. Znajdź workflow „Generate materials index"
3. Jeśli jest czerwony (failed):
   - Kliknij, aby zobaczyć logi błędów
   - Sprawdź uprawnienia: **Settings → Actions → General → Workflow permissions → Read and write**

### 4. Konwencja nazewnictwa (zalecana)
```
YYYY-MM-DD_Temat_wykladu.pdf
```
Przykład: `2026-01-15_Reumatologia_podstawy.pdf`

---

## 🖼️ Podgląd PDF nie działa

### 1. Modal się nie otwiera
- Odśwież stronę (`Ctrl + F5`)
- Sprawdź czy plik PDF istnieje pod podanym adresem

### 2. PDF nie wyświetla się w oknie
- Niektóre przeglądarki blokują wyświetlanie PDF w iframe
- Użyj przycisku **Pobierz** zamiast podglądu
- Sprawdź czy przeglądarka ma włączoną obsługę PDF

### 3. Modal nie chce się zamknąć
- Kliknij przycisk **✕** lub **Zamknij**
- Kliknij w ciemne tło poza oknem
- Naciśnij klawisz `Escape`

---

## 📢 Ogłoszenia nie wyświetlają się

### 1. Sprawdź plik `data/announcements.json`
Poprawna struktura:
```json
{
  "meta": {
    "generated_at": "2026-01-15T12:00:00Z"
  },
  "items": [
    {
      "id": "unikalne-id",
      "title": "Tytuł ogłoszenia",
      "date": "2026-01-15",
      "expires": "",
      "important": false,
      "tags": ["informacja"],
      "body": "Treść ogłoszenia."
    }
  ]
}
```

### 2. Ogłoszenie zniknęło
- Sprawdź pole `expires` — jeśli data minęła, ogłoszenie jest ukryte
- Zaznacz checkbox **„Pokaż archiwalne"** na stronie

### 3. Błąd parsowania JSON
- Użyj walidatora JSON: https://jsonlint.com/
- Sprawdź czy nie brakuje przecinków lub cudzysłowów

---

## 🌐 Problemy z GitHub Pages

### 1. Strona nie działa (404)
1. **Settings → Pages** — sprawdź czy GitHub Pages jest włączone
2. Source powinien być ustawiony na: `Deploy from a branch` → `main` → `/ (root)`
3. Poczekaj 2-5 minut na deployment

### 2. Stare pliki są widoczne
- GitHub Pages cache'uje pliki
- Poczekaj kilka minut lub wymuś odświeżenie (`Ctrl + F5`)

### 3. CORS / Mixed Content
- Upewnij się, że wszystkie zasoby używają HTTPS
- Nie linkuj do zewnętrznych zasobów HTTP

---

## 💻 Testowanie lokalne

### 1. Plik `file://` nie działa
Przeglądarki blokują fetch z protokołu `file://`. Uruchom lokalny serwer:

```bash
# Python 3
python -m http.server 8080

# Node.js
npx serve .

# VS Code
# Zainstaluj rozszerzenie "Live Server" i kliknij "Go Live"
```

Następnie otwórz: `http://localhost:8080`

### 2. Generowanie indeksu materiałów lokalnie
```bash
python scripts/generate_materials_index.py
```

---

## 🎨 Problemy z wyglądem

### 1. Strona wygląda „rozjechana"
- Sprawdź czy `styles.css` załadował się poprawnie (Network → 200)
- Wyczyść cache przeglądarki

### 2. Ciemny/jasny motyw nie działa
- Kliknij przycisk **◐** w prawym górnym rogu
- Sprawdź czy LocalStorage nie jest zablokowany

### 3. Strona źle wygląda na telefonie
- Upewnij się, że meta viewport jest w HTML:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  ```

---

## ❓ Nadal masz problem?

1. Sprawdź konsolę przeglądarki (F12 → Console)
2. Sprawdź zakładkę Network pod kątem błędów 404/500
3. Sprawdź logi GitHub Actions
4. Utwórz Issue w repozytorium z opisem problemu i zrzutem ekranu
