/**
 * Portal dydaktyczny PWr - Wydział Medyczny
 * Profesjonalna aplikacja front-end
 * @version 2.1.0
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

  // Domyślna konfiguracja (fallback)
  var siteConfig = {
    site: { title: 'Materiały dydaktyczne', language: 'pl' },
    instructor: { name: '', department: '', university: 'PWr', subtitle: '' },
    branding: { logo_text: 'PWr', primary_color: '#9A342D', accent_color: '#00b2ba' },
    footer: { copyright: '', note: '' },
    features: { dark_mode: true, pdf_preview: true, search: true, filters: true }
  };

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
   * @param {string} message - główna wiadomość
   * @param {string} type - typ statusu (ok, bad, warn)
   * @param {string} updateTime - opcjonalna data aktualizacji
   */
  function setStatus(message, type, updateTime) {
    var bar = $('#statusBar');
    if (!bar) return;
    bar.className = 'badge' + (type ? ' ' + type : '');
    
    if (updateTime) {
      bar.innerHTML = '<span>' + escapeHtml(message) + '</span>' +
        '<span class="status-update">aktualizacja: ' + escapeHtml(updateTime) + '</span>';
    } else {
      bar.textContent = message;
    }
  }

  /**
   * Formatuje datę na polski format
   */
  function formatDatePL(dateStr) {
    if (!dateStr) return '';
    try {
      var parts = dateStr.split('-');
      if (parts.length !== 3) return dateStr;
      var months = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
                    'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
      var day = parseInt(parts[2], 10);
      var month = months[parseInt(parts[1], 10) - 1] || parts[1];
      var year = parts[0];
      return day + ' ' + month + ' ' + year;
    } catch (e) {
      return dateStr;
    }
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
  // FILTERS TOGGLE (MOBILE)
  // ============================================

  function initFiltersToggle() {
    var toggleBtn = $('#filtersToggle');
    var wrapper = toggleBtn ? toggleBtn.closest('.controls-wrapper') : null;
    
    if (!toggleBtn || !wrapper) return;

    toggleBtn.addEventListener('click', function() {
      var isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      
      toggleBtn.setAttribute('aria-expanded', !isExpanded);
      wrapper.classList.toggle('expanded', !isExpanded);
    });

    // Zamknij filtry po wybraniu opcji na mobile (lepszy UX)
    var filtersPanel = $('#filtersPanel');
    if (filtersPanel) {
      var selects = $$('select', filtersPanel);
      selects.forEach(function(sel) {
        sel.addEventListener('change', function() {
          // Sprawdź czy jesteśmy na mobile
          if (window.innerWidth <= 768) {
            setTimeout(function() {
              toggleBtn.setAttribute('aria-expanded', 'false');
              wrapper.classList.remove('expanded');
            }, 150);
          }
        });
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

  /**
   * Sprawdza czy urządzenie jest mobilne (telefon/tablet)
   */
  function isMobileDevice() {
    return window.innerWidth <= 768 || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  function openModal(title, pdfUrl) {
    if (!pdfUrl) return;
    
    var fullUrl = buildUrl(pdfUrl);
    
    // Na urządzeniach mobilnych otwórz PDF bezpośrednio w nowej karcie
    // Przeglądarki mobilne mają lepszą natywną obsługę PDF
    if (isMobileDevice()) {
      window.open(fullUrl, '_blank');
      return;
    }
    
    var modal = $('#pdfModal');
    var frame = $('#pdfFrame');
    var titleEl = $('#pdfTitle');
    var downloadEl = $('#pdfDownload');
    
    if (!modal || !frame) return;
    
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
      var statsText = 'Znaleziono <b>' + filtered.length + '</b> z ' + materials.length + ' materiałów';
      if (query || typeFilter || yearFilter) {
        statsText = 'Wyniki filtrowania: <b>' + filtered.length + '</b> materiałów';
      }
      stats.innerHTML = '<span class="metaDot ok"></span><span>' + statsText + '</span>';
    }

    // Brak materiałów
    if (materials.length === 0) {
      grid.innerHTML = '<div class="empty"><div class="emptyIcon">📚</div><div class="emptyTitle">Brak materiałów</div>' +
        '<div class="emptyDesc">Dodaj plik do <code>wyklady/</code> i wykonaj commit/push. GitHub Actions wygeneruje listę.</div></div>';
      return;
    }

    // Brak wyników
    if (filtered.length === 0) {
      grid.innerHTML = '<div class="empty"><div class="emptyIcon">🔍</div><div class="emptyTitle">Brak wyników</div>' +
        '<div class="emptyDesc">Zmień filtry lub frazę wyszukiwania.</div></div>';
      return;
    }

    // Renderuj karty
    var html = filtered.map(function(m) {
      var title = escapeHtml(m.title || 'Plik');
      var typeStr = escapeHtml((m.type || '').toUpperCase());
      var dateStr = m.date ? escapeHtml(m.date) : '';
      var datePL = m.date ? formatDatePL(m.date) : '';
      var yearStr = m.year ? escapeHtml(String(m.year)) : '';
      var url = (m.url || '').trim();
      var hasUrl = url.length > 0;
      var isPdf = hasUrl && /\.pdf$/i.test(url);
      var isDocx = hasUrl && /\.(docx?|doc)$/i.test(url);
      var isPptx = hasUrl && /\.(pptx?|ppt)$/i.test(url);
      var fullUrl = hasUrl ? buildUrl(url) : '';
      var tags = Array.isArray(m.tags) ? m.tags : [];

      // Wybierz ikonę i kolor w zależności od typu pliku
      var fileIcon = '📄';
      var fileClass = '';
      var fileTypeName = 'Dokument';
      if (isPdf) { fileIcon = '📕'; fileClass = 'pdf'; fileTypeName = 'Dokument PDF'; }
      else if (isDocx) { fileIcon = '📘'; fileClass = 'docx'; fileTypeName = 'Dokument Word'; }
      else if (isPptx) { fileIcon = '📙'; fileClass = 'pptx'; fileTypeName = 'Prezentacja PowerPoint'; }

      // Buduj listę kluczowych informacji
      var infoItems = [];
      infoItems.push('<li><strong>Typ:</strong> ' + fileTypeName + '</li>');
      if (datePL) {
        infoItems.push('<li><strong>Data dodania:</strong> ' + datePL + '</li>');
      }
      if (yearStr && !datePL) {
        infoItems.push('<li><strong>Rok:</strong> ' + yearStr + '</li>');
      }
      if (tags.length > 0) {
        var filteredTags = tags.filter(function(t) { return t !== yearStr; });
        if (filteredTags.length > 0) {
          infoItems.push('<li><strong>Kategorie:</strong> ' + escapeHtml(filteredTags.join(', ')) + '</li>');
        }
      }
      if (isPdf) {
        infoItems.push('<li><strong>Podgląd:</strong> Dostępny online</li>');
      }

      var actionsHtml = '';
      if (!hasUrl) {
        actionsHtml = '<span class="muted">Plik niedostępny</span>';
      } else if (isPdf) {
        actionsHtml = '<button class="btn primary previewBtn" type="button" data-url="' + escapeHtml(url) + 
          '" data-title="' + title + '">👁️ Podgląd</button>' +
          '<a class="btn ghost" href="' + escapeHtml(fullUrl) + '" download>⬇️ Pobierz</a>';
      } else {
        actionsHtml = '<a class="btn primary" href="' + escapeHtml(fullUrl) + '" download>⬇️ Pobierz</a>';
      }

      return '<article class="card ' + fileClass + '">' +
        '<div class="cardHeader">' +
        '<div class="cardIcon ' + fileClass + '">' + fileIcon + '</div>' +
        '<div class="cardInfo">' +
        '<h3 class="cardTitle">' + title + '</h3>' +
        '<span class="cardType">' + typeStr + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="cardDetails"><ul>' + infoItems.join('') + '</ul></div>' +
        '<div class="cardActions">' + actionsHtml + '</div>' +
        '</article>';
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

        var updateTime = data.meta && data.meta.generated_at ? data.meta.generated_at : '';
        setStatus('Materiały: ' + materialsState.data.length, 'ok', updateTime);
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
      stats.innerHTML = '<span class="metaDot ok"></span><span>Znaleziono <b>' + 
        filtered.length + '</b> z ' + announcements.length + ' ogłoszeń</span>';
    }

    // Brak ogłoszeń
    if (announcements.length === 0) {
      grid.innerHTML = '<div class="empty"><div class="emptyIcon">📢</div><div class="emptyTitle">Brak ogłoszeń</div>' +
        '<div class="emptyDesc">Prowadzący publikuje ogłoszenia w <code>data/announcements.json</code>.</div></div>';
      return;
    }

    // Brak wyników
    if (filtered.length === 0) {
      grid.innerHTML = '<div class="empty"><div class="emptyIcon">🔍</div><div class="emptyTitle">Brak wyników</div>' +
        '<div class="emptyDesc">Zmień filtr tagów lub wyszukiwanie.</div></div>';
      return;
    }

    // Renderuj karty
    var html = filtered.map(function(a) {
      var title = escapeHtml(a.title || 'Ogłoszenie');
      var body = escapeHtml(a.body || '');
      var dateStr = a.date ? escapeHtml(a.date) : '';
      var datePL = a.date ? formatDatePL(a.date) : '';
      var expiresStr = a.expires ? escapeHtml(a.expires) : '';
      var expiresPL = a.expires ? formatDatePL(a.expires) : '';
      var isImportant = !!a.important;

      // Formatuj treść - akapity i wyróżnienia
      var formattedBody = body
        .replace(/\n\n+/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>');
      formattedBody = '<p>' + formattedBody + '</p>';

      // Ikona w zależności od typu ogłoszenia
      var announcementIcon = isImportant ? '🔔' : '📢';
      var cardClass = isImportant ? 'card announcement important' : 'card announcement';

      var pillsHtml = '';
      if (isImportant) {
        pillsHtml += '<span class="pill red"><span class="dot"></span>Ważne</span>';
      } else {
        pillsHtml += '<span class="pill teal"><span class="dot"></span>Info</span>';
      }

      var tagsHtml = '';
      if (Array.isArray(a.tags) && a.tags.length) {
        tagsHtml = '<div class="tagsList">' + a.tags.map(function(tag) {
          return '<span class="tagItem">🏷️ ' + escapeHtml(tag) + '</span>';
        }).join('') + '</div>';
      }

      return '<article class="' + cardClass + '">' +
        '<div class="cardTop">' +
        '<div class="cardIcon">' + announcementIcon + '</div>' +
        '<div class="cardContent">' +
        '<h3 class="cardTitle">' + title + '</h3>' +
        '<div class="cardMeta">' +
        (datePL ? '<span class="metaItem"><span class="metaIcon">📅</span>' + datePL + '</span>' : '') +
        (expiresPL ? '<span class="metaItem"><span class="metaIcon">⏰</span>Ważne do: ' + expiresPL + '</span>' : '') +
        '</div></div>' +
        '<div class="pills">' + pillsHtml + '</div></div>' +
        '<div class="cardBody">' + formattedBody + '</div>' +
        '<div class="cardBottom">' +
        '<div class="cardFooterInfo">' + (isImportant ? '⚡ Priorytetowe ogłoszenie' : '💬 Ogłoszenie informacyjne') + '</div>' +
        '<div class="cardActions">' + (tagsHtml || '') + '</div></div></article>';
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

        var updateTime = data.meta && data.meta.generated_at ? data.meta.generated_at : '';
        setStatus('Ogłoszenia: ' + announcementsState.data.length, 'ok', updateTime);
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
  // KONFIGURACJA STRONY
  // ============================================

  /**
   * Ładuje plik config.json i aktualizuje elementy strony
   */
  function loadConfig() {
    var url = buildUrl('config.json') + '?v=' + Date.now();
    
    return fetchJson(url, 5000)
      .then(function(config) {
        // Scal z domyślną konfiguracją
        if (config.site) {
          siteConfig.site = Object.assign({}, siteConfig.site, config.site);
        }
        if (config.instructor) {
          siteConfig.instructor = Object.assign({}, siteConfig.instructor, config.instructor);
        }
        if (config.branding) {
          siteConfig.branding = Object.assign({}, siteConfig.branding, config.branding);
        }
        if (config.footer) {
          siteConfig.footer = Object.assign({}, siteConfig.footer, config.footer);
        }
        if (config.features) {
          siteConfig.features = Object.assign({}, siteConfig.features, config.features);
        }
        
        applyConfig();
        return siteConfig;
      })
      .catch(function(err) {
        console.warn('Nie udało się wczytać config.json, używam domyślnych wartości:', err);
        return siteConfig;
      });
  }

  /**
   * Stosuje konfigurację do elementów DOM
   */
  function applyConfig() {
    // Aktualizuj nagłówek - tytuł (imię wykładowcy)
    var titleEls = $$('.brandText .title');
    titleEls.forEach(function(el) {
      if (siteConfig.instructor.name) {
        el.textContent = siteConfig.instructor.name;
      }
    });

    // Aktualizuj nagłówek - podtytuł
    var subtitleEls = $$('.brandText .subtitle');
    subtitleEls.forEach(function(el) {
      var parts = [];
      if (siteConfig.instructor.department) {
        parts.push(siteConfig.instructor.department);
      }
      if (siteConfig.instructor.subtitle) {
        parts.push(siteConfig.instructor.subtitle);
      }
      if (parts.length > 0) {
        el.textContent = parts.join(' • ');
      }
    });

    // Aktualizuj logo
    var markEls = $$('.mark');
    markEls.forEach(function(el) {
      if (siteConfig.branding.logo_text) {
        el.textContent = siteConfig.branding.logo_text;
      }
    });

    // Aktualizuj stopkę
    var footerEls = $$('.footer');
    footerEls.forEach(function(el) {
      var html = '';
      if (siteConfig.footer.copyright) {
        html += '<span>' + escapeHtml(siteConfig.footer.copyright) + '</span>';
      }
      if (siteConfig.footer.note) {
        if (html) html += '<span class="sep">•</span>';
        html += '<span class="muted">' + escapeHtml(siteConfig.footer.note) + '</span>';
      }
      if (html) {
        el.innerHTML = html;
      }
    });

    // Aktualizuj tytuł strony
    if (siteConfig.site.title) {
      var page = document.body.getAttribute('data-page') || '';
      var pageTitle = page === 'announcements' ? 'Ogłoszenia' : 'Materiały dydaktyczne';
      document.title = pageTitle + ' — ' + siteConfig.instructor.university + ' ' + siteConfig.instructor.department;
    }
  }

  // ============================================
  // INICJALIZACJA
  // ============================================

  function init() {
    try {
      initTheme();
      initModal();
      initFiltersToggle();

      // Załaduj konfigurację, a następnie inicjalizuj odpowiednią stronę
      loadConfig().then(function() {
        var page = document.body.getAttribute('data-page') || '';

        if (page === 'materials') {
          initMaterials();
        } else if (page === 'announcements') {
          initAnnouncements();
        }
      });
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
