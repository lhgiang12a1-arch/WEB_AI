(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // Year
  const yearEl = $('#year');
  if(yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Slider Logic
  const slider = $('[data-slider]');
  if(slider){
    const slides = $$('[data-slide]', slider);
    const dotsWrap = $('[data-dots]', slider);
    const prev = $('[data-prev]', slider);
    const next = $('[data-next]', slider);
    let idx = 0;

    function renderDots(){
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const d = document.createElement('button');
        d.className = 'sh-dot' + (i === idx ? ' is-active' : '');
        d.addEventListener('click', () => go(i));
        dotsWrap.appendChild(d);
      });
    }

    function go(i){
      idx = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-active', k === idx));
      $$('.sh-dot', dotsWrap).forEach((d, k) => d.classList.toggle('is-active', k === idx));
    }

    if(prev) prev.addEventListener('click', () => go(idx-1));
    if(next) next.addEventListener('click', () => go(idx+1));
    renderDots();
    setInterval(() => go(idx+1), 5000);
  }

  // Mockup Database
  function createPhoneSVG(name, hue){
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240"><rect width="200" height="240" rx="16" fill="hsl(${hue}, 40%, 20%)"/><rect x="20" y="20" width="160" height="200" rx="8" fill="rgba(0,0,0,0.5)"/><text x="100" y="125" text-anchor="middle" fill="#fff" font-family="sans-serif" font-weight="bold" font-size="24">${name}</text></svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  const products = [
    {id:1, name:'iPhone 15 Pro Max', brand:'Apple', ram:8, price:29990000, rating:4.9, img: createPhoneSVG('IP 15', 220)},
    {id:2, name:'Samsung Galaxy S24 Ultra', brand:'Samsung', ram:12, price:31990000, rating:4.8, img: createPhoneSVG('S24', 260)},
    {id:3, name:'Xiaomi 14 Pro', brand:'Xiaomi', ram:12, price:18990000, rating:4.6, img: createPhoneSVG('Mi 14', 150)},
    {id:4, name:'iPhone 14', brand:'Apple', ram:6, price:16990000, rating:4.7, img: createPhoneSVG('IP 14', 220)},
    {id:5, name:'Samsung Galaxy A55', brand:'Samsung', ram:8, price:10490000, rating:4.5, img: createPhoneSVG('A55', 260)},
    {id:6, name:'Xiaomi Redmi Note 13', brand:'Xiaomi', ram:8, price:5990000, rating:4.4, img: createPhoneSVG('Note 13', 150)},
    {id:7, name:'iPhone 13', brand:'Apple', ram:4, price:13990000, rating:4.8, img: createPhoneSVG('IP 13', 220)},
    {id:8, name:'Samsung Z Fold 5', brand:'Samsung', ram:12, price:40990000, rating:4.9, img: createPhoneSVG('Fold 5', 260)}
  ];

  let filtered = [...products];
  const grid = $('#productGrid');
  const countEl = $('#resultCount');

  // Render Logic
  function render(){
    countEl.textContent = filtered.length;
    if(filtered.length === 0){
      grid.innerHTML = `<div style="grid-column:1/-1; padding:30px; text-align:center; background:rgba(255,255,255,.05); border-radius:16px;">Không tìm thấy sản phẩm!</div>`;
      return;
    }
    
    grid.innerHTML = filtered.map(p => `
      <div class="sh-card">
        <div class="sh-card__media"><img src="${p.img}" alt="${p.name}"></div>
        <div class="sh-card__body">
          <div class="sh-card__name">${p.name}</div>
          <div class="sh-card__meta">
            <span class="sh-price">${p.price.toLocaleString('vi-VN')}₫</span>
            <span class="sh-rating">★ ${p.rating}</span>
          </div>
          <div class="sh-card__actions">
            <button class="sh-btn sh-btn--primary sh-btn--full">Mua ngay</button>
            <button class="sh-btn sh-btn--ghost sh-btn--full">+ Giỏ hàng</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Filter Logic
  $('#applyFilters').addEventListener('click', () => {
    const min = parseInt($('#minPrice').value) || 0;
    const max = parseInt($('#maxPrice').value) || Infinity;
    const brands = $$('input[name="brand"]:checked').map(el => el.value);
    
    filtered = products.filter(p => {
      const matchBrand = brands.length === 0 || brands.includes(p.brand);
      const matchPrice = p.price >= min && p.price <= max;
      return matchBrand && matchPrice;
    });
    render();
  });

  $('#resetFilters').addEventListener('click', () => {
    $$('input[type="checkbox"]').forEach(el => el.checked = false);
    $('#minPrice').value = '';
    $('#maxPrice').value = '';
    filtered = [...products];
    render();
  });

  // Modal Compare Basic
  const modal = $('#compareModal');
  $('#openCompare').addEventListener('click', () => { modal.classList.add('is-open'); });
  $$('[data-close]').forEach(btn => btn.addEventListener('click', () => modal.classList.remove('is-open')));

  render();
})();