document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const menuToggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.contains("open");
    if (isOpen) {
      mobileNav.classList.remove("open");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    } else {
      mobileNav.classList.add("open");
      menuToggle.classList.add("open");
      menuToggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
  });
  mobileNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => { 
    mobileNav.classList.remove("open"); 
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded","false"); 
    document.body.style.overflow = "";
  }));

  const cards = [...document.querySelectorAll(".destination-card")];
  const filters = [...document.querySelectorAll(".filter-btn")];
  const search = document.getElementById("destination-search");
  const noResults = document.getElementById("no-results");
  let activeRegion = "all";
  function filterCards(){
    const term = search.value.trim().toLocaleLowerCase("vi");
    let count = 0;
    cards.forEach(card => {
      const visible = (activeRegion === "all" || card.dataset.region === activeRegion) && card.textContent.toLocaleLowerCase("vi").includes(term);
      card.style.display = visible ? "" : "none";
      if(visible) count++;
    });
    noResults.classList.toggle("hidden", count !== 0);
  }
  filters.forEach(button => button.addEventListener("click", () => {
    activeRegion = button.dataset.region;
    filters.forEach(item => item.classList.toggle("active", item === button));
    filterCards();
  }));
  search.addEventListener("input", filterCards);

  const modal = document.getElementById("destination-modal");
  const modalBody = document.getElementById("modal-body");
  function closeModal(){ modal.classList.remove("open"); document.body.style.overflow = ""; modalBody.innerHTML = ""; }
  document.querySelectorAll(".detail-trigger").forEach(button => button.addEventListener("click", () => {
    const source = button.closest(".destination-card");
    const clone = source.cloneNode(true);
    clone.classList.add("modal-card");
    clone.querySelector(".detail-trigger").remove();
    modalBody.appendChild(clone);
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }));
  document.getElementById("modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if(e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if(e.key === "Escape") closeModal(); });

  document.getElementById("experience-button").addEventListener("click", () => document.getElementById("experience-note").classList.toggle("hidden"));

  const pins = [...document.querySelectorAll(".map-pin")];
  const routes = [...document.querySelectorAll(".route-btn")];
  function selectRoute(key){
    pins.forEach(pin => pin.classList.toggle("active", pin.dataset.pin === key));
    routes.forEach(route => route.classList.toggle("active", route.dataset.route === key));
  }
  routes.forEach(route => route.addEventListener("click", () => selectRoute(route.dataset.route)));
  pins.forEach(pin => pin.addEventListener("click", () => selectRoute(pin.dataset.pin)));

  document.querySelectorAll("h1, h2, h3, h4, p, img, button:not(.nav-link):not(.filter-btn):not(.modal-close)").forEach(el => {
    if (!el.className.match(/reveal/) && !el.closest(".reveal, .reveal-left, .reveal-right, .reveal-zoom, .destination-card, .experience-card, .map-art, nav, .hero")) {
      el.classList.add("reveal");
    }
  });

  const observer = new IntersectionObserver((entries, obs) => {
    let delay = 0;
    entries.filter(e => e.isIntersecting).forEach(entry => {
      if(!entry.target.className.includes("delay-") && entry.target.className.match(/card/)) {
        entry.target.style.transitionDelay = `${delay}ms`;
        delay += 100;
      }
      entry.target.classList.add("visible");
      obs.unobserve(entry.target);
    });
  }, {threshold: 0, rootMargin: "0px 0px -50px 0px"});
  document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-zoom").forEach(el => observer.observe(el));

  const newsletter = document.getElementById("newsletter-form");
  const status = document.getElementById("newsletter-status");
  newsletter.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = event.submitter;
    const email = document.getElementById("newsletter-email").value.trim();
    if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ status.textContent = "Vui lòng nhập địa chỉ email hợp lệ."; status.className = "mt-3 text-sm text-[#edbd54]"; return; }
    button.disabled = true;
    button.style.opacity = ".65";
    try {
      const result = await window.dataSdk.create({email});
      if(result.isOk){ status.textContent = "Cảm ơn bạn! Cẩm nang sẽ sớm đồng hành cùng hành trình của bạn."; status.className = "mt-3 text-sm text-[#dce9c7]"; newsletter.reset(); }
      else { status.textContent = "Chưa thể xác nhận đăng ký. Vui lòng thử lại sau."; status.className = "mt-3 text-sm text-[#edbd54]"; }
    } catch { status.textContent = "Chưa thể kết nối để đăng ký. Vui lòng thử lại sau."; status.className = "mt-3 text-sm text-[#edbd54]"; }
    finally { button.disabled = false; button.style.opacity = ""; }
  });

  window.dataSdk.init({onDataChanged(){}}).then(result => {
    if(!result.isOk) status.textContent = "Form đăng ký hiện chưa sẵn sàng. Vui lòng thử lại sau.";
  });
});