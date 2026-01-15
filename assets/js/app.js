(() => {
  "use strict";

  // Oblicz bazowy URL względem lokalizacji strony
  const getBaseUrl = () => {
    const loc = window.location;
    const path = loc.pathname;
    // Usuń nazwę pliku (np. index.html) z ścieżki
    const dir = path.substring(0, path.lastIndexOf('/') + 1);
    return loc.origin + dir;
  };

  const BASE_URL = getBaseUrl();
  const u = (path) => {
    if(!path || typeof path !== 'string') return '';
    // Usuń "./" z początku ścieżki jeśli istnieje
    const cleanPath = path.replace(/^\.\//,  '').trim();
    if(!cleanPath) return '';
    return BASE_URL + cleanPath;
  };

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const debounce = (fn, ms=170) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  };

  const escapeHtml = (str) => (str ?? "").toString().replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"
  }[m]));

  const toast = (text, kind="ok") => {
    const bar = $("#statusBar");
    if(!bar) return;
    bar.classList.remove("ok","warn","bad");
    if(kind) bar.classList.add(kind);
    bar.textContent = text;
  };

  const nowISO = () => new Date().toISOString().replace("T"," ").slice(0,19);

  const setTheme = (theme) => {
    if(theme === "dark") document.documentElement.setAttribute("data-theme","dark");
    else document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("tanski_theme", theme);
  };

  const initTheme = () => {
    const saved = localStorage.getItem("tanski_theme");
    if(saved) setTheme(saved);
    else {
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
    $("#themeBtn")?.addEventListener("click", () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      setTheme(isDark ? "light" : "dark");
    });
  };

  const fetchJson = async (url, timeoutMs=9000) => {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);

    let res;
    try{
      console.log("[fetchJson] Pobieranie:", url);
      res = await fetch(url, {
        method: "GET",
        headers: { "Accept": "application/json" },
        cache: "no-store",
        signal: controller.signal
      });
    } catch(fetchErr) {
      clearTimeout(t);
      console.error("[fetchJson] Błąd fetch:", fetchErr);
      const err = new Error(`Błąd połączenia: ${fetchErr.message}`);
      err.url = url;
      throw err;
    } finally {
      clearTimeout(t);
    }

    if(!res.ok){
      const err = new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
      err.status = res.status;
      err.url = url;
      throw err;
    }
    
    try {
      return await res.json();
    } catch(jsonErr) {
      console.error("[fetchJson] Błąd parsowania JSON:", jsonErr);
      const err = new Error(`Nieprawidłowy format JSON: ${jsonErr.message}`);
      err.url = url;
      throw err;
    }
  };

  const normalizePayload = (raw) => {
    if(Array.isArray(raw)) return { meta: {}, items: raw };
    if(raw && typeof raw === "object" && Array.isArray(raw.items)) return { meta: raw.meta || {}, items: raw.items };
    return { meta: {}, items: [] };
  };

  const isExpired = (expires) => {
    if(!expires) return false;
    const d = new Date(expires + "T23:59:59");
    if(Number.isNaN(d.getTime())) return false;
    return d.getTime() < Date.now();
  };

  /* ===========================
     Modal (PDF preview)
     =========================== */
  const openPdf = (title, url) => {
    if(!url || !url.trim()) {
      console.warn("openPdf: brak URL");
      return;
    }
    const modal = $("#pdfModal");
    if(!modal) return;
    $("#pdfTitle").textContent = title || "Podgląd";
    const full = u(url);
    $("#pdfFrame").src = full;
    $("#pdfDownload").href = full;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    const modal = $("#pdfModal");
    if(!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    const frame = $("#pdfFrame");
    if(frame) frame.src = "about:blank";
  };

  const bindModal = () => {
    const modal = $("#pdfModal");
    if(!modal) return;
    
    // Zamykanie przez kliknięcie na overlay lub przyciski z data-close
    modal.addEventListener("click", (e) => {
      const t = e.target;
      // Sprawdź czy to element z data-close lub jego rodzic
      const closeEl = t.hasAttribute?.("data-close") ? t : t.closest?.("[data-close]");
      if(closeEl) {
        // Dla linków (Pobierz) - pozwól na domyślne zachowanie, ale zamknij modal
        if(closeEl.tagName === "A") {
          // Nie blokuj download - zamknij z opóźnieniem
          setTimeout(closeModal, 100);
        } else {
          e.preventDefault();
          closeModal();
        }
      }
    });
    
    // Zamykanie przez Escape
    window.addEventListener("keydown", (e) => { 
      if(e.key === "Escape" && !modal.hidden) closeModal(); 
    });
  };

  /* ===========================
     Materials
     =========================== */
  const fillMaterialFilters = (materials) => {
    const typeSel = $("#mType");
    const yearSel = $("#mYear");
    if(!typeSel || !yearSel) return;

    const types = [...new Set(materials.map(m => (m.type||"").toUpperCase()).filter(Boolean))].sort();
    const years = [...new Set(materials.map(m => (m.year||"").toString()).filter(Boolean))].sort().reverse();

    typeSel.innerHTML = `<option value="">Wszystkie</option>` + types.map(t => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join("");
    yearSel.innerHTML = `<option value="">Wszystkie</option>` + years.map(y => `<option value="${escapeHtml(y)}">${escapeHtml(y)}</option>`).join("");

    const chips = $("#mChips");
    if(chips){
      const make = (label, val) => `<div class="chip ${val==="" ? "active":""}" data-type="${escapeHtml(val)}">${escapeHtml(label)}</div>`;
      chips.innerHTML = [make("Wszystkie",""), ...types.slice(0,12).map(t => make(t,t))].join("");
      chips.addEventListener("click", (e) => {
        const el = e.target?.closest?.(".chip");
        if(!el) return;
        const val = el.getAttribute("data-type") || "";
        $$(".chip", chips).forEach(c => c.classList.remove("active"));
        el.classList.add("active");
        typeSel.value = val;
        renderMaterials(materials);
      });
    }
  };

  const renderMaterials = (materials) => {
    const grid = $("#mGrid");
    if(!grid) return;

    const q = ($("#mQuery")?.value || "").trim().toLowerCase();
    const type = ($("#mType")?.value || "").trim().toUpperCase();
    const year = ($("#mYear")?.value || "").trim();

    const items = materials.filter(m => {
      if(type && (m.type||"").toUpperCase() !== type) return false;
      if(year && (m.year||"").toString() !== year) return false;
      if(!q) return true;
      const blob = [
        m.title, m.description, m.type, m.year, m.date,
        ...(Array.isArray(m.tags) ? m.tags : [])
      ].join(" ").toLowerCase();
      return blob.includes(q);
    });

    // Stats
    const stats = $("#mStats");
    if(stats){
      stats.innerHTML = `<span class="metaDot ok"></span><span>Wynik: <b>${items.length}</b> / ${materials.length} • ${escapeHtml(nowISO())}</span>`;
    }

    if(materials.length === 0){
      grid.innerHTML = `<div class="empty"><h3>Brak materiałów</h3><p class="muted">Dodaj plik do <span class="mono">wyklady/</span> i wykonaj commit/push. GitHub Actions wygeneruje listę.</p></div>`;
      return;
    }

    if(items.length === 0){
      grid.innerHTML = `<div class="empty"><h3>Brak wyników</h3><p class="muted">Zmień filtry lub frazę wyszukiwania.</p></div>`;
      return;
    }

    grid.innerHTML = items.map(m => {
      const title = escapeHtml(m.title || "Plik");
      const desc = escapeHtml(m.description || "");
      const typeP = escapeHtml((m.type || "").toUpperCase());
      const dateP = m.date ? escapeHtml(m.date) : "";
      const yearP = m.year ? escapeHtml(String(m.year)) : "";
      const url = (m.url || "").trim();
      const hasUrl = url.length > 0;
      const isPdf = hasUrl && /\.pdf$/i.test(url);
      // Unikaj podwójnego kodowania - encodeURI tylko dla surowej ścieżki
      const fullUrl = hasUrl ? u(url) : '';
      const href = hasUrl && fullUrl ? escapeHtml(fullUrl) : "#";

      const pills = [
        typeP ? `<span class="pill teal"><span class="dot"></span>${typeP}</span>` : "",
        dateP ? `<span class="pill red"><span class="dot"></span>${dateP}</span>` : "",
        (!dateP && yearP) ? `<span class="pill"><span class="dot"></span>${yearP}</span>` : ""
      ].filter(Boolean).join("");

      let actions = '';
      if(!hasUrl) {
        actions = `<span class="muted">Plik niedostępny</span>`;
      } else if(isPdf) {
        actions = `<button class="btn" type="button" data-preview="${escapeHtml(url)}" data-title="${title}">Podgląd</button>
           <a class="btn ghost" href="${href}" download>Pobierz</a>`;
      } else {
        actions = `<a class="btn" href="${href}" download>Pobierz</a>`;
      }

      return `
        <article class="card">
          <div class="cardTop">
            <div>
              <h3 class="cardTitle">${title}</h3>
              <div class="cardMeta">${desc}</div>
            </div>
            <div class="pills">${pills}</div>
          </div>
          <div class="cardBody">
            ${(Array.isArray(m.tags) && m.tags.length) ? `<div class="muted"><span class="mono">tagi:</span> ${escapeHtml(m.tags.join(", "))}</div>` : ""}
          </div>
          <div class="cardBottom">${actions}</div>
        </article>
      `;
    }).join("");

    // Bind preview buttons
    $$("#mGrid [data-preview]").forEach(btn => {
      btn.addEventListener("click", () => {
        const url = btn.getAttribute("data-preview");
        const title = btn.getAttribute("data-title");
        if(url) openPdf(title || "Podgląd", url);
      });
    });
  };

  const initMaterials = async () => {
    const grid = $("#mGrid");
    if(!grid) return;

    toast("Ładowanie materiałów…");
    grid.innerHTML = `<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>`;

    const target = u("./data/materials.json") + "?v=" + Date.now();

    try{
      const raw = await fetchJson(target, 12000);
      const { meta, items } = normalizePayload(raw);
      const materials = Array.isArray(items) ? items : [];

      fillMaterialFilters(materials);
      renderMaterials(materials);

      // Events
      const rer = debounce(() => renderMaterials(materials), 160);
      $("#mQuery")?.addEventListener("input", rer);
      $("#mType")?.addEventListener("change", () => renderMaterials(materials));
      $("#mYear")?.addEventListener("change", () => renderMaterials(materials));
      $("#mReset")?.addEventListener("click", () => {
        $("#mQuery").value = "";
        $("#mType").value = "";
        $("#mYear").value = "";
        $$("#mChips .chip").forEach((c, i) => c.classList.toggle("active", i===0));
        renderMaterials(materials);
      });

      const gen = meta?.generated_at ? ` • indeks: ${meta.generated_at}` : "";
      toast(`Materiały: ${materials.length}${gen}`, "ok");
    }catch(e){
      console.error(e);
      toast("Błąd ładowania materiałów", "bad");
      grid.innerHTML = `
        <div class="empty">
          <h3>Nie udało się wczytać materiałów</h3>
          <p class="muted">
            <span class="mono">URL:</span> <span class="mono">${escapeHtml(e.url || target)}</span><br/>
            Jeśli właśnie dodałeś PDF do <span class="mono">wyklady/</span>, sprawdź repo → <b>Actions</b> (czy workflow wygenerował <span class="mono">data/materials.json</span>).<br/>
            Jeśli testujesz lokalnie, uruchom prosty serwer (np. VS Code Live Server) — <span class="mono">file://</span> może blokować fetch.
          </p>
        </div>`;
    }
  };

  /* ===========================
     Announcements
     =========================== */
  const fillAnnouncementFilters = (ann) => {
    const sel = $("#aTag");
    if(!sel) return;
    const tags = [...new Set(ann.flatMap(a => Array.isArray(a.tags) ? a.tags : []).map(t => String(t)).filter(Boolean))].sort();
    sel.innerHTML = `<option value="">Wszystkie</option>` + tags.map(t => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join("");
  };

  const renderAnnouncements = (ann) => {
    const grid = $("#aGrid");
    if(!grid) return;

    const q = ($("#aQuery")?.value || "").trim().toLowerCase();
    const tag = ($("#aTag")?.value || "").trim();

    const items = ann.filter(a => {
      if(tag){
        const tags = Array.isArray(a.tags) ? a.tags.map(String) : [];
        if(!tags.includes(tag)) return false;
      }
      if(!q) return true;
      const blob = [
        a.title, a.body, a.date, a.expires,
        ...(Array.isArray(a.tags) ? a.tags : [])
      ].join(" ").toLowerCase();
      return blob.includes(q);
    });

    const stats = $("#aStats");
    if(stats){
      stats.innerHTML = `<span class="metaDot ok"></span><span>Wynik: <b>${items.length}</b> / ${ann.length} • ${escapeHtml(nowISO())}</span>`;
    }

    if(ann.length === 0){
      grid.innerHTML = `<div class="empty"><h3>Brak ogłoszeń</h3><p class="muted">Prowadzący publikuje ogłoszenia w <span class="mono">data/announcements.json</span>.</p></div>`;
      return;
    }

    if(items.length === 0){
      grid.innerHTML = `<div class="empty"><h3>Brak wyników</h3><p class="muted">Zmień filtr tagów lub wyszukiwanie.</p></div>`;
      return;
    }

    grid.innerHTML = items.map(a => {
      const title = escapeHtml(a.title || "Ogłoszenie");
      const body = escapeHtml(a.body || "");
      const date = a.date ? escapeHtml(a.date) : "";
      const expires = a.expires ? escapeHtml(a.expires) : "";
      const important = !!a.important;

      const pills = [
        important ? `<span class="pill red"><span class="dot"></span>WAŻNE</span>` : `<span class="pill teal"><span class="dot"></span>INFO</span>`,
        date ? `<span class="pill"><span class="dot"></span>${date}</span>` : "",
        expires ? `<span class="pill warn" title="Do: ${expires}"><span class="dot"></span>do ${expires}</span>` : ""
      ].filter(Boolean).join("");

      return `
        <article class="card">
          <div class="cardTop">
            <div>
              <h3 class="cardTitle">${title}</h3>
              <div class="cardMeta">${date ? "Data: " + date : ""}</div>
            </div>
            <div class="pills">${pills}</div>
          </div>
          <div class="cardBody">${body.replace(/\n/g,"<br/>")}</div>
          <div class="cardBottom">
            ${(Array.isArray(a.tags) && a.tags.length) ? `<span class="muted"><span class="mono">tagi:</span> ${escapeHtml(a.tags.join(", "))}</span>` : `<span></span>`}
          </div>
        </article>
      `;
    }).join("");
  };

  // Przechowujemy referencję do aktualnych ogłoszeń, aby uniknąć wielokrotnego dodawania listenerów
  let announcementsData = null;
  let announcementListenersBound = false;

  const initAnnouncements = async () => {
    const grid = $("#aGrid");
    if(!grid) return;

    toast("Ładowanie ogłoszeń…");
    grid.innerHTML = `<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>`;

    const target = u("./data/announcements.json") + "?v=" + Date.now();

    try{
      const raw = await fetchJson(target, 12000);
      const { meta, items } = normalizePayload(raw);
      let ann = Array.isArray(items) ? items : [];

      const showExpired = $("#aShowExpired")?.checked || false;
      if(!showExpired) ann = ann.filter(a => !isExpired(a.expires));

      ann.sort((a,b) => {
        const ai = !!a.important, bi = !!b.important;
        if(ai !== bi) return (bi - ai);
        const ad = a.date || ""; const bd = b.date || "";
        return bd.localeCompare(ad);
      });

      announcementsData = ann;
      fillAnnouncementFilters(ann);
      renderAnnouncements(ann);

      // Binduj listenery tylko raz, aby uniknąć powielania
      if(!announcementListenersBound) {
        announcementListenersBound = true;
        
        const rer = debounce(() => {
          if(announcementsData) renderAnnouncements(announcementsData);
        }, 160);
        $("#aQuery")?.addEventListener("input", rer);
        $("#aTag")?.addEventListener("change", () => {
          if(announcementsData) renderAnnouncements(announcementsData);
        });
        $("#aShowExpired")?.addEventListener("change", () => initAnnouncements());
        $("#aReset")?.addEventListener("click", () => {
          $("#aQuery").value = "";
          $("#aTag").value = "";
          if(announcementsData) renderAnnouncements(announcementsData);
        });
      }

      const gen = meta?.generated_at ? ` • aktualizacja: ${meta.generated_at}` : "";
      toast(`Ogłoszenia: ${ann.length}${gen}`, "ok");
    }catch(e){
      console.error(e);
      toast("Błąd ładowania ogłoszeń", "bad");
      grid.innerHTML = `
        <div class="empty">
          <h3>Nie udało się wczytać ogłoszeń</h3>
          <p class="muted">
            <span class="mono">URL:</span> <span class="mono">${escapeHtml(e.url || target)}</span><br/>
            Sprawdź, czy plik <span class="mono">data/announcements.json</span> jest w repo i ma poprawny JSON.
          </p>
        </div>`;
    }
  };

  /* ===========================
     Boot
     =========================== */
  const init = async () => {
    try {
      initTheme();
      bindModal();

      const page = document.body?.dataset?.page || "";
      if(page === "materials") await initMaterials();
      if(page === "announcements") await initAnnouncements();
    } catch(e) {
      console.error("Błąd inicjalizacji:", e);
      toast("Błąd inicjalizacji strony", "bad");
    }
  };

  // Uruchom po załadowaniu DOM lub natychmiast jeśli już załadowany
  if(document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
