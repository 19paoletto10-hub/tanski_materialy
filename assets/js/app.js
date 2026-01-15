/**
 * Portal dydaktyczny PWr - Wydział Medyczny
 * Profesjonalna aplikacja front-end
 * @version 2.0.0
 */
(function() {
  'use strict';

  // ============================================
  // KONFIGURACJA I UTILITY
  // ============================================
  
  /**
   * Pobiera bazowy URL strony (katalog bez nazwy pliku)
   */
  function getBasePath() {
    var pathname = window.location.pathname;
    var lastSlash = pathname.lastIndexOf('/');
    var dir = pathname.substring(0, lastSlash + 1);
    return window.location.origin + dir;
  }

  var BASE_PATH = getBasePath();

  /**
   * Buduje pełny URL z relatywnej ścieżki
   */
  function buildUrl(relativePath) {
    if (!relativePath || typeof relativePath !== 'string') {
      return '';
    }
    // Usuń ./ z początku jeśli istnieje
    var cleanPath = relativePath.replace(/^\.\//, '').trim();
    if (!cleanPath) {
      return '';
    }
    return BASE_PATH + cleanPath;
  }

  /**
   * Skrócony selektor DOM
   */
  function $(selector, context) {
    return (context || document).querySelector(selector);
  }

  function $$(selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  }

  /**
   * Debounce - opóźnia wykonanie funkcji
   */
  function debounce(fn, delay) {
    var timer = null;
    return function() {
      var args = arguments;
      var ctx = this;
      clearTimeout(timer);
      timer = setTimeout(function() {
        fn.apply(ctx, args);
      }, delay || 200);
    };
  }

  /**
   * Escape HTML - zabezpiecza przed XSS
   */
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    var text = String(str);
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
  }

  /**
   * Aktualizuje status bar
   */
  function setStatus(message, type) {
    var bar = $('#statusBar');
    if (!bar) return;
    bar.className = 'badge' + (type ? ' ' + type : '');
    bar.textContent = message;
  }

  /**
   * Formatuje aktualną datę
   */
  function formatNow() {
    return new Date().toISOString().replace('T', ' ').substring(0, 19);
  }

  // ============================================
  // THEME (MOTYW JASNY/CIEMNY)
  // ============================================

  function setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem('tanski_theme', theme);
    } catch (e) {}
  }

  function initTheme() {
    var saved = null;
    try {
      saved = localStorage.getItem('tanski_theme');
    } catch (e) {}

    if (saved) {
      setTheme(saved);
    } else {
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }

    var btn = $('#themeBtn');
    if (btn) {
      btn.addEventListener('click', function() {
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        setTheme(isDark ? 'light' : 'dark');
      });
    }
  }

  // ============================================
  // FETCH JSON
  // ============================================

  function fetchJson(url, timeout) {
    timeout = timeout || 10000;

    return new Promise(function(resolve, reject) {
      var controller = null;
      var timeoutId = null;

      // Obsługa AbortController jeśli dostępny
      if (typeof AbortController !== 'undefined') {
        controller = new AbortController();
        timeoutId = setTimeout(function() {
          controller.abort();
        }, timeout);
      }

      var options = {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      };

      if (controller) {
        options.signal = controller.signal;
      }

      fetch(url, options)
        .then(function(response) {
          if (timeoutId) clearTimeout(timeoutId);
          if (!response.ok) {
            var err = new Error('HTTP ' + response.status);
            err.status = response.status;
            err.url = url;
            throw err;
          }
          return response.json();
        })
        .then(resolve)
        .catch(function(err) {
          if (timeoutId) clearTimeout(timeoutId);
          err.url = err.url || url;
          reject(err);
        });
    });
  }

  /**
   * Normalizuje dane JSON (obsługuje różne formaty)
   */
  function normalizeData(raw) {
    if (Array.isArray(raw)) {
      return { meta: {}, items: raw };
    }
    if (raw && typeof raw === 'object' && Array.isArray(raw.items)) {
      return { meta: raw.meta || {}, items: raw.items };
    }
    return { meta: {}, items: [] };
  }

  /**
   * Sprawdza czy ogłoszenie wygasło
   */
  function isExpired(expiresDate) {
    if (!expiresDate) return false;
    try {
      var d = new Date(expiresDate + 'T23:59:59');
      if (isNaN(d.getTime())) return false;
      return d.getTime() < Date.now();
    } catch (e) {
      return false;
    }
  }

  // ============================================
  // MODAL PDF
  // ============================================

  var modalState = {
    isOpen: false
  };

  function openModal(title, pdfUrl) {
    if (!pdfUrl) return;
    
    var modal = $('#pdfModal');
    var frame = $('#pdfFrame');
    var titleEl = $('#pdfTitle');
    var downloadEl = $('#pdfDownload');
    
    if (!modal || !frame) return;

    var fullUrl = buildUrl(pdfUrl);
    
    if (titleEl) titleEl.textContent = title || 'Podgląd PDF';
    if (frame) frame.src = fullUrl;
    if (downloadEl) downloadEl.href = fullUrl;
    
    modal.hidden = false;
    modalState.isOpen = true;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    var modal = $('#pdfModal');
    var frame = $('#pdfFrame');
    
    if (!modal) return;
    
    modal.hidden = true;
    modalState.isOpen = false;
    document.body.style.overflow = '';
    
    if (frame) {
      frame.src = 'about:blank';
    }
  }

  function initModal() {
    var overlay = $('#modalOverlay');
    var closeBtn = $('#modalCloseBtn');
    var closeBtn2 = $('#modalCloseBtn2');

    if (overlay) {
      overlay.addEventListener('click', closeModal);
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }
    if (closeBtn2) {
      closeBtn2.addEventListener('click', closeModal);
    }

    // Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modalState.isOpen) {
        closeModal();
      }
    });
  }

  // ============================================
  // MATERIAŁY
  // ============================================

  var materialsState = {
    data: [],
    initialized: false
  };

  function fillMaterialFilters(materials) {
    var typeSel = $('#mType');
    var yearSel = $('#mYear');
    var chipsEl = $('#mChips');

    if (!typeSel || !yearSel) return;

    // Zbierz unikalne typy i lata
    var typesSet = {};
    var yearsSet = {};

    materials.forEach(function(m) {
      var t = (m.type || '').toUpperCase();
      var y = String(m.year || '');
      if (t) typesSet[t] = true;
      if (y) yearsSet[y] = true;
    });

    var types = Object.keys(typesSet).sort();
    var years = Object.keys(yearsSet).sort().reverse();

    // Wypełnij selecty
    typeSel.innerHTML = '<option value="">Wszystkie</option>' +
      types.map(function(t) {
        return '<option value="' + escapeHtml(t) + '">' + escapeHtml(t) + '</option>';
      }).join('');

    yearSel.innerHTML = '<option value="">Wszystkie</option>' +
      years.map(function(y) {
        return '<option value="' + escapeHtml(y) + '">' + escapeHtml(y) + '</option>';
      }).join('');

    // Chipy
    if (chipsEl) {
      var chipsHtml = '<div class="chip active" data-type="">Wszystkie</div>';
      types.slice(0, 10).forEach(function(t) {
        chipsHtml += '<div class="chip" data-type="' + escapeHtml(t) + '">' + escapeHtml(t) + '</div>';
      });
      chipsEl.innerHTML = chipsHtml;

      chipsEl.addEventListener('click', function(e) {
        var chip = e.target.closest('.chip');
        if (!chip) return;
        
        $$('.chip', chipsEl).forEach(function(c) { c.classList.remove('active'); });
        chip.classList.add('active');
        
        var val = chip.getAttribute('data-type') || '';
        typeSel.value = val;
        renderMaterials();
      });
    }
  }

  function renderMaterials() {
    var grid = $('#mGrid');
    var stats = $('#mStats');
    if (!grid) return;

    var materials = materialsState.data;
    var query = ($('#mQuery') ? $('#mQuery').value : '').trim().toLowerCase();
    var typeFilter = ($('#mType') ? $('#mType').value : '').toUpperCase();
    var yearFilter = ($('#mYear') ? $('#mYear').value : '');

    // Filtruj
    var filtered = materials.filter(function(m) {
      if (typeFilter && (m.type || '').toUpperCase() !== typeFilter) return false;
      if (yearFilter && String(m.year || '') !== yearFilter) return false;
      if (!query) return true;

      var searchable = [
        m.title, m.description, m.type, m.year, m.date
      ].concat(Array.isArray(m.tags) ? m.tags : []).join(' ').toLowerCase();

      return searchable.indexOf(query) !== -1;
    });

    // Statystyki
    if (stats) {
      stats.innerHTML = '<span class="metaDot ok"></span><span>Wynik: <b>' + 
        filtered.length + '</b> / ' + materials.length + ' • ' + escapeHtml(formatNow()) + '</span>';
    }

    // Brak materiałów
    if (materials.length === 0) {
      grid.innerHTML = '<div class="empty"><h3>Brak materiałów</h3>' +
        '<p class="muted">Dodaj plik do <code>wyklady/</code> i wykonaj commit/push. GitHub Actions wygeneruje listę.</p></div>';
      return;
    }

    // Brak wyników
    if (filtered.length === 0) {
      grid.innerHTML = '<div class="empty"><h3>Brak wyników</h3>' +
        '<p class="muted">Zmień filtry lub frazę wyszukiwania.</p></div>';
      return;
    }

    // Renderuj karty
    var html = filtered.map(function(m) {
      var title = escapeHtml(m.title || 'Plik');
      var desc = escapeHtml(m.description || '');
      var typeStr = escapeHtml((m.type || '').toUpperCase());
      var dateStr = m.date ? escapeHtml(m.date) : '';
      var yearStr = m.year ? escapeHtml(String(m.year)) : '';
      var url = (m.url || '').trim();
      var hasUrl = url.length > 0;
      var isPdf = hasUrl && /\.pdf$/i.test(url);
      var fullUrl = hasUrl ? buildUrl(url) : '';

      var pillsHtml = '';
      if (typeStr) pillsHtml += '<span class="pill teal"><span class="dot"></span>' + typeStr + '</span>';
      if (dateStr) pillsHtml += '<span class="pill red"><span class="dot"></span>' + dateStr + '</span>';
      else if (yearStr) pillsHtml += '<span class="pill"><span class="dot"></span>' + yearStr + '</span>';

      var actionsHtml = '';
      if (!hasUrl) {
        actionsHtml = '<span class="muted">Plik niedostępny</span>';
      } else if (isPdf) {
        actionsHtml = '<button class="btn previewBtn" type="button" data-url="' + escapeHtml(url) + 
          '" data-title="' + title + '">Podgląd</button>' +
          '<a class="btn ghost" href="' + escapeHtml(fullUrl) + '" download>Pobierz</a>';
      } else {
        actionsHtml = '<a class="btn" href="' + escapeHtml(fullUrl) + '" download>Pobierz</a>';
      }

      var tagsHtml = '';
      if (Array.isArray(m.tags) && m.tags.length) {
        tagsHtml = '<div class="muted"><code>tagi:</code> ' + escapeHtml(m.tags.join(', ')) + '</div>';
      }

      return '<article class="card">' +
        '<div class="cardTop"><div><h3 class="cardTitle">' + title + '</h3>' +
        '<div class="cardMeta">' + desc + '</div></div>' +
        '<div class="pills">' + pillsHtml + '</div></div>' +
        '<div class="cardBody">' + tagsHtml + '</div>' +
        '<div class="cardBottom">' + actionsHtml + '</div></article>';
    }).join('');

    grid.innerHTML = html;

    // Bind przyciski podglądu
    $$('.previewBtn', grid).forEach(function(btn) {
      btn.addEventListener('click', function() {
        var url = btn.getAttribute('data-url');
        var title = btn.getAttribute('data-title');
        if (url) openModal(title, url);
      });
    });
  }

  function initMaterials() {
    var grid = $('#mGrid');
    if (!grid) return;

    setStatus('Ładowanie materiałów…');
    grid.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';

    var url = buildUrl('data/materials.json') + '?v=' + Date.now();

    fetchJson(url, 15000)
      .then(function(raw) {
        var data = normalizeData(raw);
        materialsState.data = data.items || [];
        
        fillMaterialFilters(materialsState.data);
        renderMaterials();

        // Event listeners (tylko raz)
        if (!materialsState.initialized) {
          materialsState.initialized = true;
          
          var rerenderDebounced = debounce(renderMaterials, 200);
          
          var queryEl = $('#mQuery');
          var typeEl = $('#mType');
          var yearEl = $('#mYear');
          var resetEl = $('#mReset');

          if (queryEl) queryEl.addEventListener('input', rerenderDebounced);
          if (typeEl) typeEl.addEventListener('change', renderMaterials);
          if (yearEl) yearEl.addEventListener('change', renderMaterials);
          if (resetEl) {
            resetEl.addEventListener('click', function() {
              if (queryEl) queryEl.value = '';
              if (typeEl) typeEl.value = '';
              if (yearEl) yearEl.value = '';
              $$('#mChips .chip').forEach(function(c, i) {
                c.classList.toggle('active', i === 0);
              });
              renderMaterials();
            });
          }
        }

        var genInfo = data.meta && data.meta.generated_at ? ' • indeks: ' + data.meta.generated_at : '';
        setStatus('Materiały: ' + materialsState.data.length + genInfo, 'ok');
      })
      .catch(function(err) {
        console.error('Błąd ładowania materiałów:', err);
        setStatus('Błąd ładowania materiałów', 'bad');
        grid.innerHTML = '<div class="empty"><h3>Nie udało się wczytać materiałów</h3>' +
          '<p class="muted">Sprawdź konsolę przeglądarki (F12) lub poczekaj chwilę i odśwież stronę.</p></div>';
      });
  }

  // ============================================
  // OGŁOSZENIA
  // ============================================

  var announcementsState = {
    data: [],
    allData: [],
    initialized: false
  };

  function fillAnnouncementFilters(announcements) {
    var tagSel = $('#aTag');
    if (!tagSel) return;

    var tagsSet = {};
    announcements.forEach(function(a) {
      if (Array.isArray(a.tags)) {
        a.tags.forEach(function(t) {
          if (t) tagsSet[String(t)] = true;
        });
      }
    });

    var tags = Object.keys(tagsSet).sort();

    tagSel.innerHTML = '<option value="">Wszystkie</option>' +
      tags.map(function(t) {
        return '<option value="' + escapeHtml(t) + '">' + escapeHtml(t) + '</option>';
      }).join('');
  }

  function renderAnnouncements() {
    var grid = $('#aGrid');
    var stats = $('#aStats');
    if (!grid) return;

    var announcements = announcementsState.data;
    var query = ($('#aQuery') ? $('#aQuery').value : '').trim().toLowerCase();
    var tagFilter = ($('#aTag') ? $('#aTag').value : '');

    // Filtruj
    var filtered = announcements.filter(function(a) {
      if (tagFilter) {
        var tags = Array.isArray(a.tags) ? a.tags.map(String) : [];
        if (tags.indexOf(tagFilter) === -1) return false;
      }
      if (!query) return true;

      var searchable = [
        a.title, a.body, a.date, a.expires
      ].concat(Array.isArray(a.tags) ? a.tags : []).join(' ').toLowerCase();

      return searchable.indexOf(query) !== -1;
    });

    // Statystyki
    if (stats) {
      stats.innerHTML = '<span class="metaDot ok"></span><span>Wynik: <b>' + 
        filtered.length + '</b> / ' + announcements.length + ' • ' + escapeHtml(formatNow()) + '</span>';
    }

    // Brak ogłoszeń
    if (announcements.length === 0) {
      grid.innerHTML = '<div class="empty"><h3>Brak ogłoszeń</h3>' +
        '<p class="muted">Prowadzący publikuje ogłoszenia w <code>data/announcements.json</code>.</p></div>';
      return;
    }

    // Brak wyników
    if (filtered.length === 0) {
      grid.innerHTML = '<div class="empty"><h3>Brak wyników</h3>' +
        '<p class="muted">Zmień filtr tagów lub wyszukiwanie.</p></div>';
      return;
    }

    // Renderuj karty
    var html = filtered.map(function(a) {
      var title = escapeHtml(a.title || 'Ogłoszenie');
      var body = escapeHtml(a.body || '').replace(/\n/g, '<br>');
      var dateStr = a.date ? escapeHtml(a.date) : '';
      var expiresStr = a.expires ? escapeHtml(a.expires) : '';
      var isImportant = !!a.important;

      var pillsHtml = '';
      if (isImportant) {
        pillsHtml += '<span class="pill red"><span class="dot"></span>WAŻNE</span>';
      } else {
        pillsHtml += '<span class="pill teal"><span class="dot"></span>INFO</span>';
      }
      if (dateStr) pillsHtml += '<span class="pill"><span class="dot"></span>' + dateStr + '</span>';
      if (expiresStr) pillsHtml += '<span class="pill warn"><span class="dot"></span>do ' + expiresStr + '</span>';

      var tagsHtml = '';
      if (Array.isArray(a.tags) && a.tags.length) {
        tagsHtml = '<span class="muted"><code>tagi:</code> ' + escapeHtml(a.tags.join(', ')) + '</span>';
      }

      return '<article class="card">' +
        '<div class="cardTop"><div><h3 class="cardTitle">' + title + '</h3>' +
        '<div class="cardMeta">' + (dateStr ? 'Data: ' + dateStr : '') + '</div></div>' +
        '<div class="pills">' + pillsHtml + '</div></div>' +
        '<div class="cardBody">' + body + '</div>' +
        '<div class="cardBottom">' + (tagsHtml || '<span></span>') + '</div></article>';
    }).join('');

    grid.innerHTML = html;
  }

  function loadAnnouncements() {
    var grid = $('#aGrid');
    if (!grid) return;

    setStatus('Ładowanie ogłoszeń…');
    grid.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';

    var url = buildUrl('data/announcements.json') + '?v=' + Date.now();

    fetchJson(url, 15000)
      .then(function(raw) {
        var data = normalizeData(raw);
        announcementsState.allData = data.items || [];

        // Filtruj wygasłe
        var showExpired = $('#aShowExpired') && $('#aShowExpired').checked;
        var filtered = announcementsState.allData;
        
        if (!showExpired) {
          filtered = filtered.filter(function(a) {
            return !isExpired(a.expires);
          });
        }

        // Sortuj: ważne najpierw, potem po dacie malejąco
        filtered.sort(function(a, b) {
          var aImp = a.important ? 1 : 0;
          var bImp = b.important ? 1 : 0;
          if (aImp !== bImp) return bImp - aImp;
          var aDate = a.date || '';
          var bDate = b.date || '';
          return bDate.localeCompare(aDate);
        });

        announcementsState.data = filtered;
        
        fillAnnouncementFilters(announcementsState.data);
        renderAnnouncements();

        var genInfo = data.meta && data.meta.generated_at ? ' • aktualizacja: ' + data.meta.generated_at : '';
        setStatus('Ogłoszenia: ' + announcementsState.data.length + genInfo, 'ok');
      })
      .catch(function(err) {
        console.error('Błąd ładowania ogłoszeń:', err);
        setStatus('Błąd ładowania ogłoszeń', 'bad');
        grid.innerHTML = '<div class="empty"><h3>Nie udało się wczytać ogłoszeń</h3>' +
          '<p class="muted">Sprawdź konsolę przeglądarki (F12) lub poczekaj chwilę i odśwież stronę.</p></div>';
      });
  }

  function initAnnouncements() {
    loadAnnouncements();

    // Event listeners (tylko raz)
    if (!announcementsState.initialized) {
      announcementsState.initialized = true;
      
      var rerenderDebounced = debounce(renderAnnouncements, 200);
      
      var queryEl = $('#aQuery');
      var tagEl = $('#aTag');
      var expiredEl = $('#aShowExpired');
      var resetEl = $('#aReset');

      if (queryEl) queryEl.addEventListener('input', rerenderDebounced);
      if (tagEl) tagEl.addEventListener('change', renderAnnouncements);
      if (expiredEl) expiredEl.addEventListener('change', loadAnnouncements);
      if (resetEl) {
        resetEl.addEventListener('click', function() {
          if (queryEl) queryEl.value = '';
          if (tagEl) tagEl.value = '';
          renderAnnouncements();
        });
      }
    }
  }

  // ============================================
  // INICJALIZACJA
  // ============================================

  function init() {
    try {
      initTheme();
      initModal();

      var page = document.body.getAttribute('data-page') || '';

      if (page === 'materials') {
        initMaterials();
      } else if (page === 'announcements') {
        initAnnouncements();
      }
    } catch (err) {
      console.error('Błąd inicjalizacji:', err);
      setStatus('Błąd inicjalizacji strony', 'bad');
    }
  }

  // Uruchom po załadowaniu DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
