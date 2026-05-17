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

  // ------------------- Product hover (delegation) -------------------
  document.addEventListener('mouseover', (e) => {
    const card = e.target && e.target.closest ? e.target.closest('.sh-card') : null;
    if (card) card.classList.add('sh-card--hovered');
  });
  document.addEventListener('mouseout', (e) => {
    const card = e.target && e.target.closest ? e.target.closest('.sh-card') : null;
    if (card) card.classList.remove('sh-card--hovered');
  });

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

