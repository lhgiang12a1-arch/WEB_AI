// SmartHub UI: slider + hover smooth + trả góp online + modal compare + (tuỳ chọn) lọc sản phẩm
(function () {

  const $ = (sel, root = document) => root.querySelector(sel);

  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ------------------- Footer year -------------------
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ------------------- Banner slider -------------------
  const slider = $('[data-slider]');
  if (slider) {

    const slides = $$('[data-slide]', slider);
    const dotsWrap = $('[data-dots]', slider);
    const prev = $('[data-prev]', slider);
    const next = $('[data-next]', slider);
    let idx = 0;

    function renderDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const d = document.createElement('button');
        d.type = 'button';
        d.className = 'sh-dot' + (i === idx ? ' is-active' : '');
        d.addEventListener('click', () => go(i));
        dotsWrap.appendChild(d);
      });
    }

    function go(i) {
      if (!slides.length) return;
      idx = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-active', k === idx));
      $$('.sh-dot', dotsWrap).forEach((d, k) => d.classList.toggle('is-active', k === idx));
    }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(() => go(idx + 1), 5000);
    }

    let autoTimer = null;
    function stopAuto() {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = null;
    }

    if (prev) prev.addEventListener('click', () => {
      go(idx - 1);
      startAuto();
    });
    if (next) next.addEventListener('click', () => {
      go(idx + 1);
      startAuto();
    });

    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);

    renderDots();
    go(0);
    startAuto();
  }

  // ------------------- Product data + render grid -------------------
  const products = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      brand: 'Apple',
      price: 29990000,
      rating: 4.9,
      img: 'data:image/svg+xml;charset=utf-8,' +
        encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240"><rect width="200" height="240" rx="16" fill="#111827"/><rect x="20" y="20" width="160" height="200" rx="10" fill="#0b1220"/><text x="100" y="128" text-anchor="middle" font-family="sans-serif" font-size="22" fill="#ffffff" font-weight="700">iPhone</text><text x="100" y="155" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#2bd3ff" font-weight="700">15 Pro Max</text></svg>`)
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra',
      brand: 'Samsung',
      price: 31990000,
      rating: 4.8,
      img: 'data:image/svg+xml;charset=utf-8,' +
        encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240"><rect width="200" height="240" rx="16" fill="#0b1220"/><rect x="20" y="20" width="160" height="200" rx="10" fill="#111827"/><text x="100" y="128" text-anchor="middle" font-family="sans-serif" font-size="22" fill="#ffffff" font-weight="700">Samsung</text><text x="100" y="155" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#2bd3ff" font-weight="700">S24 Ultra</text></svg>`)
    },
    {
      id: 3,
      name: 'Xiaomi 14 Pro',
      brand: 'Xiaomi',
      price: 18990000,
      rating: 4.6,
      img: 'data:image/svg+xml;charset=utf-8,' +
        encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240"><rect width="200" height="240" rx="16" fill="#05060a"/><rect x="20" y="20" width="160" height="200" rx="10" fill="#0b1220"/><text x="100" y="128" text-anchor="middle" font-family="sans-serif" font-size="22" fill="#ffffff" font-weight="700">Xiaomi</text><text x="100" y="155" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#2bd3ff" font-weight="700">14 Pro</text></svg>`)
    },
    {
      id: 4,
      name: 'iPhone 14',
      brand: 'Apple',
      price: 16990000,
      rating: 4.7,
      img: 'data:image/svg+xml;charset=utf-8,' +
        encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240"><rect width="200" height="240" rx="16" fill="#0b1220"/><rect x="20" y="20" width="160" height="200" rx="10" fill="#111827"/><text x="100" y="128" text-anchor="middle" font-family="sans-serif" font-size="22" fill="#ffffff" font-weight="700">iPhone</text><text x="100" y="155" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#2bd3ff" font-weight="700">14</text></svg>`)
    },
    {
      id: 5,
      name: 'Samsung Galaxy A55',
      brand: 'Samsung',
      price: 10490000,
      rating: 4.5,
      img: 'data:image/svg+xml;charset=utf-8,' +
        encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240"><rect width="200" height="240" rx="16" fill="#111827"/><rect x="20" y="20" width="160" height="200" rx="10" fill="#0b1220"/><text x="100" y="128" text-anchor="middle" font-family="sans-serif" font-size="22" fill="#ffffff" font-weight="700">Galaxy</text><text x="100" y="155" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#2bd3ff" font-weight="700">A55</text></svg>`)
    },
    {
      id: 6,
      name: 'Xiaomi Redmi Note 13',
      brand: 'Xiaomi',
      price: 5990000,
      rating: 4.4,
      img: 'data:image/svg+xml;charset=utf-8,' +
        encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240"><rect width="200" height="240" rx="16" fill="#05060a"/><rect x="20" y="20" width="160" height="200" rx="10" fill="#0b1220"/><text x="100" y="128" text-anchor="middle" font-family="sans-serif" font-size="22" fill="#ffffff" font-weight="700">Redmi</text><text x="100" y="155" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#2bd3ff" font-weight="700">Note 13</text></svg>`)
    }
  ];

  let filtered = [...products];
  const grid = $('#productGrid');
  const countEl = $('#resultCount');

  function formatVND(n) {
    return Number(n).toLocaleString('vi-VN') + 'đ';
  }

  function render() {
    if (!grid || !countEl) return;
    countEl.textContent = String(filtered.length);

    if (!filtered.length) {
      grid.innerHTML = `
        <div style="grid-column:1/-1; padding:30px; text-align:center; background:rgba(255,255,255,.05); border-radius:16px; border:1px solid rgba(255,255,255,.1);">
          Không tìm thấy sản phẩm!
        </div>`;
      return;
    }

    grid.innerHTML = filtered
      .map(
        (p) => `
        <article class="sh-card">
          <div class="sh-card__media"><img src="${p.img}" alt="${p.name}"></div>
          <div class="sh-card__body">
            <h3 class="sh-card__name">${p.name}</h3>
            <div class="sh-card__meta">
              <span class="sh-price">${formatVND(p.price)}</span>
              <span class="sh-rating">★ ${p.rating}</span>
            </div>
            <div class="sh-card__actions">
              <button class="sh-btn sh-btn--primary sh-btn--full" type="button" data-buy="${p.id}">Mua ngay</button>
              <button class="sh-btn sh-btn--ghost sh-btn--full" type="button" data-addcart="${p.id}">+ Thêm giỏ hàng</button>
            </div>
          </div>
        </article>
      `
      )
      .join('');
  }

  // ------------------- Product hover (delegation) -------------------
  document.addEventListener('mouseover', (e) => {
    const card = e.target && e.target.closest ? e.target.closest('.sh-card') : null;
    if (card) card.classList.add('sh-card--hovered');
  });
  document.addEventListener('mouseout', (e) => {
    const card = e.target && e.target.closest ? e.target.closest('.sh-card') : null;
    if (card) card.classList.remove('sh-card--hovered');
  });


  // Initial render
  render();

  // ------------------- Emi online (trả góp online) -------------------
  const emiForm = $('#emiForm');

  const emiPrice = $('#emiPrice');
  const emiMonths = $('#emiMonths');
  const emiResult = $('#emiResult');

  if (emiForm && emiPrice && emiMonths && emiResult) {
    emiForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const price = Number(emiPrice.value);
      const months = Number(emiMonths.value);

      if (!Number.isFinite(price) || price <= 0) {
        emiResult.textContent = 'Vui lòng nhập giá sản phẩm hợp lệ.';
        return;
      }

      // Minh hoạ tính trả góp: giả lập lãi suất 0.75%/tháng
      const monthlyRate = 0.0075;
      const r = monthlyRate;
      const n = months;
      const payment = (price * r) / (1 - Math.pow(1 + r, -n));

      const rounded = Math.round(payment);
      emiResult.innerHTML = `Ước tính: <b>${rounded.toLocaleString('vi-VN')}</b> đ/tháng trong <b>${months}</b> tháng. <span style="color:rgba(255,255,255,.6)">*Ví dụ minh hoạ</span>`;
    });
  }

  // ------------------- Compare modal -------------------
  const modal = $('#compareModal');
  const openCompare = $('#openCompare');

  function openModal() {
    if (!modal) return;
    modal.classList.add('is-open');
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
  }

  if (openCompare) openCompare.addEventListener('click', openModal);

  $$('[data-close]', modal || document).forEach((btn) => {
    btn.addEventListener('click', closeModal);
  });

  // Click outside
  if (modal) {
    modal.addEventListener('click', (e) => {
      const backdrop = e.target && e.target.classList && e.target.classList.contains('sh-modal__backdrop');
      if (backdrop) closeModal();
    });

    // ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // ------------------- Optional: smart search (client only) -------------------
  const searchInput = $('#searchInput');
  const searchBtn = $('#searchBtn');
  if (searchInput && searchBtn) {
    const msg = $('#resultCount');
    function runSearch() {
      // Vì đây là trang tĩnh, chỉ hiển thị gợi ý trên UI.
      const q = (searchInput.value || '').trim();
      if (msg && q) msg.textContent = '0';
    }
    searchBtn.addEventListener('click', runSearch);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') runSearch();
    });
  }
})();

