<div align="center">

# 🎓 Portal Dydaktyczny

### Wydział Medyczny · Politechnika Wrocławska

[![GitHub Pages](https://img.shields.io/badge/🌐_Strona-GitHub_Pages-2ea44f?style=for-the-badge)](https://19paoletto10-hub.github.io/tanski_materialy/)
[![License](https://img.shields.io/badge/📜_Licencja-MIT-blue?style=for-the-badge)](#licencja)
[![Maintenance](https://img.shields.io/badge/✅_Status-Aktywny-brightgreen?style=for-the-badge)](#)

<br>

<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5"/>
<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3"/>
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript"/>
<img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python"/>
<img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white" alt="GitHub Actions"/>

---

**Oficjalna platforma materiałów dydaktycznych**  
**gen. dr hab. lek. Wojciech Tański, prof. PWr**

</div>

---

## 📋 Spis treści

- [🔍 O projekcie](#-o-projekcie)
- [✨ Funkcje](#-funkcje)
- [🚀 Szybki start](#-szybki-start)
- [📚 Jak dodać materiał](#-jak-dodać-materiał)
- [📢 Jak dodać ogłoszenie](#-jak-dodać-ogłoszenie)
- [⚙️ Konfiguracja](#️-konfiguracja)
- [📁 Struktura projektu](#-struktura-projektu)
- [🛠️ Rozwiązywanie problemów](#️-rozwiązywanie-problemów)
- [📄 Licencja](#-licencja)

---

## 🔍 O projekcie

> Portal dydaktyczny to nowoczesna platforma do udostępniania materiałów wykładowych oraz ogłoszeń dla studentów Wydziału Medycznego Politechniki Wrocławskiej.

Strona umożliwia:
- 📖 Przeglądanie i pobieranie materiałów wykładowych
- 📣 Śledzenie ogłoszeń i komunikatów
- 🌓 Przełączanie między trybem jasnym i ciemnym
- 📱 Responsywny interfejs na wszystkich urządzeniach

---

## ✨ Funkcje

| Funkcja | Opis |
|---------|------|
| 📄 **Auto-indeksowanie** | Automatyczne generowanie listy materiałów z folderu `wyklady/` |
| 🔄 **GitHub Actions** | CI/CD pipeline automatycznie aktualizuje indeks materiałów |
| 🎨 **Dark/Light Mode** | Przełączanie motywu kolorystycznego |
| 📱 **Responsywność** | Pełna kompatybilność z urządzeniami mobilnymi |
| 🗂️ **Filtrowanie** | Wyszukiwanie i filtrowanie materiałów po dacie |
| 📢 **System ogłoszeń** | Zarządzanie ogłoszeniami z archiwizacją |

---

## 🚀 Szybki start

### Wymagania wstępne

- 🔧 Konto GitHub z dostępem do repozytorium
- 📝 Podstawowa znajomość Git (commit, push)

### Instalacja lokalna

```bash
# Sklonuj repozytorium
git clone https://github.com/19paoletto10-hub/tanski_materialy.git

# Przejdź do katalogu
cd tanski_materialy

# Otwórz w przeglądarce
open index.html   # macOS
xdg-open index.html   # Linux
start index.html   # Windows
```

---

## 📚 Jak dodać materiał

<table>
<tr>
<td width="60">

### 1️⃣

</td>
<td>

**Przygotuj plik**  
Obsługiwane formaty: `PDF`, `DOCX`, `PPTX`

</td>
</tr>
<tr>
<td>

### 2️⃣

</td>
<td>

**Wgraj do folderu**  
Umieść plik w katalogu `wyklady/`

</td>
</tr>
<tr>
<td>

### 3️⃣

</td>
<td>

**Zatwierdź zmiany**  
```bash
git add wyklady/
git commit -m "📚 Dodano nowy wykład"
git push origin main
```

</td>
</tr>
<tr>
<td>

### ✅

</td>
<td>

**Gotowe!**  
GitHub Actions automatycznie wygeneruje `data/materials.json` i materiał pojawi się na stronie

</td>
</tr>
</table>

---

## 📢 Jak dodać ogłoszenie

Edytuj plik `data/announcements.json`:

```json
{
  "items": [
    {
      "id": 1,
      "date": "2026-01-15",
      "title": "🎉 Przykładowe ogłoszenie",
      "body": "Treść ogłoszenia...",
      "archived": false
    }
  ]
}
```

Następnie zatwierdź zmiany:

```bash
git add data/announcements.json
git commit -m "📢 Nowe ogłoszenie"
git push origin main
```

---

## ⚙️ Konfiguracja

### 🌐 GitHub Pages

<details>
<summary><strong>Kliknij, aby rozwinąć instrukcję</strong></summary>

1. Przejdź do **Settings** → **Pages**
2. W sekcji **Source** wybierz:
   - **Deploy from a branch**
   - **Branch:** `main`
   - **Folder:** `/ (root)`
3. Kliknij **Save**

</details>

### 🔐 Uprawnienia GitHub Actions

<details>
<summary><strong>Kliknij, aby rozwinąć instrukcję</strong></summary>

1. Przejdź do **Settings** → **Actions** → **General**
2. W sekcji **Workflow permissions** wybierz:
   - ✅ **Read and write permissions**
3. Kliknij **Save**

</details>

---

## 📁 Struktura projektu

```
tanski_materialy/
├── 📄 index.html              # Strona główna (ogłoszenia)
├── 📄 materials.html          # Strona z materiałami
├── 📁 assets/
│   ├── 🎨 css/styles.css      # Style aplikacji
│   └── ⚡ js/app.js           # Logika JavaScript
├── 📁 data/
│   ├── 📋 announcements.json  # Dane ogłoszeń
│   └── 📋 materials.json      # Indeks materiałów (auto-gen)
├── 📁 scripts/
│   └── 🐍 generate_materials_index.py
├── 📁 wyklady/                # 📚 Pliki wykładów (PDF/DOCX/PPTX)
├── 📖 README.md
└── 🔧 TROUBLESHOOTING.md
```

---

## 🛠️ Rozwiązywanie problemów

Szczegółowe informacje o rozwiązywaniu typowych problemów znajdziesz w pliku:

📄 **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)**

---

## 📄 Licencja

<div align="center">

Projekt udostępniony na licencji **MIT**

[![Made with ❤️](https://img.shields.io/badge/Made_with-❤️-red?style=for-the-badge)](#)
[![PWr](https://img.shields.io/badge/Politechnika-Wrocławska-003366?style=for-the-badge)](#)

---

**© 2026 Wydział Medyczny · Politechnika Wrocławska**

</div>
