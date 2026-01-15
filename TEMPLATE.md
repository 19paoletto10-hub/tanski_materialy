<div align="center">

# 📦 Szablon Portalu Dydaktycznego

### Kompletna instrukcja wdrożenia dla wykładowców

[![Wersja](https://img.shields.io/badge/Wersja-1.0.0-blue?style=for-the-badge)](#)
[![Licencja](https://img.shields.io/badge/Licencja-MIT-green?style=for-the-badge)](#licencja)
[![GitHub Pages](https://img.shields.io/badge/Hosting-GitHub_Pages-black?style=for-the-badge&logo=github)](#)

---

**Profesjonalna platforma do udostępniania materiałów dydaktycznych**  
**Gotowa do użycia w 10 minut!**

</div>

---

## 📋 Spis treści

1. [🎯 Dla kogo jest ten szablon?](#-dla-kogo-jest-ten-szablon)
2. [✨ Co oferuje szablon?](#-co-oferuje-szablon)
3. [🚀 Szybki start (10 minut)](#-szybki-start-10-minut)
4. [⚙️ Personalizacja](#️-personalizacja)
5. [📚 Zarządzanie materiałami](#-zarządzanie-materiałami)
6. [📢 Zarządzanie ogłoszeniami](#-zarządzanie-ogłoszeniami)
7. [🎨 Dostosowanie wyglądu](#-dostosowanie-wyglądu)
8. [❓ FAQ](#-faq)
9. [🆘 Pomoc](#-pomoc)
10. [📄 Licencja](#-licencja)

---

## 🎯 Dla kogo jest ten szablon?

Ten szablon jest idealny dla:

| Grupa | Zastosowanie |
|-------|--------------|
| 👨‍🏫 **Wykładowcy** | Udostępnianie slajdów, skryptów i materiałów studentom |
| 👩‍🔬 **Naukowcy** | Publikowanie materiałów z konferencji i seminariów |
| 🏫 **Katedry/Zakłady** | Centralne repozytorium materiałów dydaktycznych |
| 📚 **Koła naukowe** | Udostępnianie materiałów edukacyjnych członkom |

### Wymagania

- ✅ Konto GitHub (darmowe)
- ✅ Podstawowa umiejętność obsługi przeglądarki
- ❌ **NIE** wymaga programowania
- ❌ **NIE** wymaga serwera
- ❌ **NIE** wymaga opłat

---

## ✨ Co oferuje szablon?

<table>
<tr>
<td width="50%">

### 📄 Automatyczne indeksowanie
Wrzuć plik do folderu → pojawi się na stronie

### 🌓 Tryb jasny/ciemny
Automatyczna detekcja preferencji systemu

### 📱 Responsywność
Działa na komputerze, tablecie i telefonie

</td>
<td width="50%">

### 📢 System ogłoszeń
Komunikaty z datami ważności i priorytetami

### 🔍 Wyszukiwarka
Szybkie filtrowanie materiałów

### 🔒 Zero kosztów
Hosting na GitHub Pages jest darmowy

</td>
</tr>
</table>

---

## 🚀 Szybki start (10 minut)

### Krok 1: Skopiuj szablon (2 min)

<table>
<tr>
<td width="80">

#### 1️⃣

</td>
<td>

Przejdź do repozytorium szablonu:  
**https://github.com/19paoletto10-hub/tanski_materialy**

</td>
</tr>
<tr>
<td>

#### 2️⃣

</td>
<td>

Kliknij zielony przycisk **"Use this template"** lub **"Fork"**

![Fork button](https://img.shields.io/badge/Kliknij-Fork-success?style=flat-square)

</td>
</tr>
<tr>
<td>

#### 3️⃣

</td>
<td>

Nadaj nazwę swojemu repozytorium, np. `materialy-wyklad`

✅ Zaznacz "Public" (wymagane dla darmowego GitHub Pages)

</td>
</tr>
<tr>
<td>

#### 4️⃣

</td>
<td>

Kliknij **"Create repository"** lub **"Create fork"**

</td>
</tr>
</table>

---

### Krok 2: Włącz GitHub Pages (3 min)

<table>
<tr>
<td width="80">

#### 1️⃣

</td>
<td>

W swoim nowym repozytorium kliknij **⚙️ Settings**

</td>
</tr>
<tr>
<td>

#### 2️⃣

</td>
<td>

W lewym menu wybierz **Pages**

</td>
</tr>
<tr>
<td>

#### 3️⃣

</td>
<td>

W sekcji **"Build and deployment"**:
- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/ (root)**

</td>
</tr>
<tr>
<td>

#### 4️⃣

</td>
<td>

Kliknij **Save**

⏳ Poczekaj 2-3 minuty na wdrożenie

</td>
</tr>
<tr>
<td>

#### ✅

</td>
<td>

Twoja strona jest dostępna pod adresem:  
`https://TWÓJ-LOGIN.github.io/NAZWA-REPOZYTORIUM/`

</td>
</tr>
</table>

---

### Krok 3: Nadaj uprawnienia (2 min)

Aby automatyczne generowanie listy materiałów działało:

<table>
<tr>
<td width="80">

#### 1️⃣

</td>
<td>

Przejdź do **Settings** → **Actions** → **General**

</td>
</tr>
<tr>
<td>

#### 2️⃣

</td>
<td>

Przewiń do **"Workflow permissions"**

</td>
</tr>
<tr>
<td>

#### 3️⃣

</td>
<td>

Wybierz: ✅ **Read and write permissions**

</td>
</tr>
<tr>
<td>

#### 4️⃣

</td>
<td>

Kliknij **Save**

</td>
</tr>
</table>

---

### Krok 4: Spersonalizuj stronę (3 min)

<table>
<tr>
<td width="80">

#### 1️⃣

</td>
<td>

W repozytorium otwórz plik **`config.json`**

</td>
</tr>
<tr>
<td>

#### 2️⃣

</td>
<td>

Kliknij ikonę ołówka (✏️ Edit this file)

</td>
</tr>
<tr>
<td>

#### 3️⃣

</td>
<td>

Zmień dane na swoje:

```json
{
  "instructor": {
    "name": "dr Jan Kowalski",
    "department": "Wydział Informatyki",
    "university": "Politechnika",
    "subtitle": "materiały do przedmiotu Programowanie"
  },
  "branding": {
    "logo_text": "WI"
  },
  "footer": {
    "copyright": "© 2026 Wydział Informatyki",
    "note": "Materiały udostępnione studentom"
  }
}
```

</td>
</tr>
<tr>
<td>

#### 4️⃣

</td>
<td>

Kliknij **"Commit changes"** → **"Commit changes"**

</td>
</tr>
</table>

---

## ⚙️ Personalizacja

### Plik `config.json` - pełna dokumentacja

```json
{
  "site": {
    "title": "Materiały dydaktyczne",
    "language": "pl"
  },
  "instructor": {
    "name": "Tytuł + Imię + Nazwisko",
    "department": "Nazwa wydziału",
    "university": "Skrót uczelni",
    "subtitle": "opis strony"
  },
  "branding": {
    "logo_text": "PWr",
    "primary_color": "#9A342D",
    "accent_color": "#00b2ba"
  },
  "footer": {
    "copyright": "© Tekst copyright",
    "note": "Dodatkowa notatka"
  },
  "features": {
    "dark_mode": true,
    "pdf_preview": true,
    "search": true,
    "filters": true
  }
}
```

**Opis parametrów:**

| Parametr | Opis |
|----------|------|
| `site.title` | Tytuł strony w zakładce przeglądarki |
| `site.language` | Język: pl, en, de, fr, es |
| `instructor.name` | Wyświetlane w nagłówku |
| `instructor.department` | Pod nazwiskiem |
| `instructor.university` | Skrót uczelni (np. PWr, AGH, UJ) |
| `instructor.subtitle` | Dodatkowy tekst opisu |
| `branding.logo_text` | Tekst w logo (max 3-4 znaki) |
| `branding.primary_color` | Kolor główny (format HEX) |
| `branding.accent_color` | Kolor akcentu (format HEX) |
| `footer.copyright` | Tekst copyright w stopce |
| `footer.note` | Opcjonalna notatka w stopce |
| `features.*` | Włącz/wyłącz funkcje (true/false) |

### Popularne schematy kolorów

| Uczelnia | primary_color | accent_color |
|----------|---------------|--------------|
| PWr (czerwony) | `#9A342D` | `#00b2ba` |
| AGH (zielony) | `#006633` | `#FFD700` |
| UJ (niebieski) | `#003366` | `#CC9900` |
| PW (czerwony) | `#A6192E` | `#1E90FF` |
| UW (niebieski) | `#0033A0` | `#FFB81C` |

---

## 📚 Zarządzanie materiałami

### Dodawanie materiałów

<table>
<tr>
<td width="80">

#### 1️⃣

</td>
<td>

Przejdź do folderu **`wyklady/`** w repozytorium

</td>
</tr>
<tr>
<td>

#### 2️⃣

</td>
<td>

Kliknij **"Add file"** → **"Upload files"**

</td>
</tr>
<tr>
<td>

#### 3️⃣

</td>
<td>

Przeciągnij pliki lub kliknij "choose your files"

**Obsługiwane formaty:** PDF, DOCX, DOC, PPTX, PPT

</td>
</tr>
<tr>
<td>

#### 4️⃣

</td>
<td>

Wpisz opis (np. "Dodano wykład 3") i kliknij **"Commit changes"**

</td>
</tr>
<tr>
<td>

#### ✅

</td>
<td>

**Gotowe!** Lista materiałów zaktualizuje się automatycznie w ciągu 1-2 minut

</td>
</tr>
</table>

### Usuwanie materiałów

1. Przejdź do pliku w folderze `wyklady/`
2. Kliknij ikonę kosza (🗑️) lub menu (⋮) → "Delete file"
3. Zatwierdź commit

### Konwencja nazewnictwa

Zalecane nazwy plików:

```
✅ Dobre:
wyklad_01_wprowadzenie.pdf
wyklad_02_podstawy_java.pptx
cwiczenia_lab3.pdf

❌ Unikaj:
Wykład 1 - Wprowadzenie!.pdf    (spacies, znaki specjalne)
WYKŁAD.PDF                       (wielkie litery)
nowy.pdf                         (niejasna nazwa)
```

---

## 📢 Zarządzanie ogłoszeniami

### Struktura pliku `data/announcements.json`

```json
{
  "meta": {
    "version": "1.0",
    "updated_at": "2026-01-15"
  },
  "items": [
    {
      "id": 1,
      "date": "2026-01-15",
      "title": "🎉 Witamy na nowym portalu!",
      "body": "Treść ogłoszenia. Może zawierać wiele linii.\n\nNowa linia.",
      "important": true,
      "expires": "2026-02-01",
      "tags": ["ważne", "organizacyjne"]
    },
    {
      "id": 2,
      "date": "2026-01-10",
      "title": "Terminy kolokwiów",
      "body": "Kolokwium 1: 20 stycznia\nKolokwium 2: 15 lutego",
      "important": false,
      "tags": ["terminy"]
    }
  ]
}
```

### Pola ogłoszenia

| Pole | Wymagane | Opis |
|------|----------|------|
| `id` | ✅ | Unikalny numer (1, 2, 3...) |
| `date` | ✅ | Data publikacji (RRRR-MM-DD) |
| `title` | ✅ | Tytuł ogłoszenia |
| `body` | ✅ | Treść ogłoszenia |
| `important` | ❌ | `true` = wyróżnione, `false` = normalne |
| `expires` | ❌ | Data wygaśnięcia (RRRR-MM-DD) |
| `tags` | ❌ | Tagi do filtrowania |

### Dodawanie ogłoszenia

1. Otwórz plik `data/announcements.json`
2. Kliknij ✏️ Edit
3. Dodaj nowy obiekt do tablicy `items`:

```json
{
  "id": 3,
  "date": "2026-01-20",
  "title": "Nowe ogłoszenie",
  "body": "Treść...",
  "important": false,
  "tags": ["info"]
}
```
4. Zatwierdź commit

⚠️ **Uwaga:** Pamiętaj o przecinkach między elementami tablicy!

---

## 🎨 Dostosowanie wyglądu

### Zmiana kolorów

Edytuj `config.json`:

```json
"branding": {
  "primary_color": "#0066CC",
  "accent_color": "#FF6600"
}
```

### Narzędzie do wyboru kolorów

1. Przejdź do: https://coolors.co/
2. Wygeneruj paletę
3. Skopiuj kody HEX (np. `#3498db`)

### Zaawansowane dostosowanie (CSS)

Jeśli znasz CSS, możesz edytować plik `assets/css/styles.css`.

Zmienne kolorów znajdziesz na początku pliku:

```css
:root {
  --pwr-red: #9A342D;
  --med-teal: #00b2ba;
  --bg: #f6f7f9;
  --card: #ffffff;
  --text: #101828;
}
```

---

## ❓ FAQ

<details>
<summary><strong>🤔 Jak długo trwa wdrożenie zmian?</strong></summary>

Po każdym "Commit" zmiany są widoczne po 1-5 minutach. GitHub musi zbudować i wdrożyć stronę.

Możesz śledzić postęp w zakładce **Actions**.

</details>

<details>
<summary><strong>📧 Czy studenci muszą mieć konto GitHub?</strong></summary>

**NIE.** Strona jest publiczna - każdy może ją przeglądać bez logowania.

</details>

<details>
<summary><strong>💾 Jaki jest limit rozmiaru plików?</strong></summary>

- Pojedynczy plik: max **100 MB**
- Całe repozytorium: max **1 GB** (zalecane < 500 MB)

Dla dużych plików rozważ kompresję PDF lub zewnętrzny hosting.

</details>

<details>
<summary><strong>🔒 Czy mogę ukryć niektóre materiały?</strong></summary>

GitHub Pages wymaga publicznego repozytorium dla darmowego hostingu.

Alternatywy:
- GitHub Pro/Team (płatne) - prywatne repozytoria
- Zewnętrzny hosting z autentykacją

</details>

<details>
<summary><strong>🌐 Czy mogę użyć własnej domeny?</strong></summary>

TAK! W ustawieniach Pages możesz dodać własną domenę (np. materialy.mojauczelnia.pl).

Wymaga konfiguracji DNS u rejestratora domeny.

</details>

<details>
<summary><strong>📊 Czy mogę śledzić statystyki odwiedzin?</strong></summary>

Dodaj kod śledzenia (np. Google Analytics) do plików HTML w nagłówku strony.

</details>

---

## 🆘 Pomoc

### Problemy techniczne

📖 Sprawdź stronę: **[troubleshooting.html](troubleshooting.html)**

Znajdziesz tam:
- Najczęstsze problemy i rozwiązania
- Instrukcje krok po kroku
- Przykłady kodu

### Zgłaszanie błędów

1. Przejdź do: https://github.com/19paoletto10-hub/tanski_materialy/issues
2. Kliknij "New issue"
3. Opisz problem i dołącz zrzuty ekranu

### Kontakt

📧 Problemy z szablonem zgłaszaj przez GitHub Issues

---

## 📄 Licencja

```
MIT License

Copyright (c) 2026 Portal Dydaktyczny

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<div align="center">

### 🎉 Gotowe!

Twój portal dydaktyczny jest gotowy do użycia.

**[🌐 Otwórz swoją stronę](https://19paoletto10-hub.github.io/tanski_materialy/)**

---

**Szablon stworzony z ❤️ dla społeczności akademickiej**

</div>