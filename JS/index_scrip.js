document.addEventListener("DOMContentLoaded", () => {
  // --- LOGIC LẶP VIDEO HERO MƯỢT MÀ (requestAnimationFrame) ---
  const video = document.getElementById("hero-video");
  let isFadingOut = false;
  let activeAnimation = null;
  let fadeTimeout = null;

  const animateOpacity = (element, targetOpacity, duration, callback) => {
    if (activeAnimation) {
      cancelAnimationFrame(activeAnimation);
    }

    const startTime = performance.now();
    const startOpacity = parseFloat(element.style.opacity || "0");
    const diff = targetOpacity - startOpacity;

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = startOpacity + diff * progress;
      element.style.opacity = Math.max(0, Math.min(current, 1)).toString();

      if (progress < 1) {
        activeAnimation = requestAnimationFrame(step);
      } else {
        element.style.opacity = targetOpacity.toString();
        activeAnimation = null;
        if (callback) callback();
      }
    };

    activeAnimation = requestAnimationFrame(step);
  };

  if (video) {
    // 1. Khi video sẵn sàng phát: Phát và fade-in trong 500ms
    video.addEventListener("canplay", () => {
      video.play().catch((err) => console.log("Autoplay blocked:", err));
      animateOpacity(video, 1, 500);
    });

    // 2. Khi thời gian còn lại <= 0.55s: fade-out về 0 trong 500ms
    video.addEventListener("timeupdate", () => {
      if (isFadingOut || video.duration === 0) return;
      const remaining = video.duration - video.currentTime;
      if (remaining <= 0.55) {
        isFadingOut = true;
        animateOpacity(video, 0, 500);
      }
    });

    // 3. Khi video kết thúc: Chờ 100ms, reset về 0, phát lại và fade-in lên 1
    video.addEventListener("ended", () => {
      video.style.opacity = "0";
      if (fadeTimeout) clearTimeout(fadeTimeout);

      fadeTimeout = setTimeout(() => {
        video.currentTime = 0;
        video
          .play()
          .then(() => {
            isFadingOut = false;
            animateOpacity(video, 1, 500);
          })
          .catch((err) => console.warn("Playback interrupted:", err));
      }, 100);
    });
  }

  // --- LOGIC CUỘN TRANG XUẤT HIỆN GIAO DIỆN (Intersection Observer) ---
  const revealElements = document.querySelectorAll(
    ".reveal-item, .reveal-item-left, .reveal-item-right",
  );
  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: "-100px",
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target); // Chỉ chạy hiệu ứng một lần duy nhất
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => observer.observe(el));

  // --- LOGIC XỬ LÝ GỬI FORM ĐĂNG KÝ ---
  const subscribeForm = document.getElementById("subscribe-form");
  const successMessage = document.getElementById("success-message");

  if (subscribeForm && successMessage) {
    subscribeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = subscribeForm.querySelector("input");
      if (!input || !input.value) return;

      // Ẩn form, hiện thông báo thành công
      subscribeForm.classList.add("hidden");
      successMessage.classList.remove("hidden");

      setTimeout(() => {
        input.value = "";
        subscribeForm.classList.remove("hidden");
        successMessage.classList.add("hidden");
      }, 3000);
    });
  }
});
