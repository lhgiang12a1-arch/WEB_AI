document.addEventListener("DOMContentLoaded", () => {
  // --- COMMON: footer year ---
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- HERO VIDEO LOOP ---
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
    video.addEventListener("canplay", () => {
      video.play().catch((err) => console.log("Autoplay blocked:", err));
      animateOpacity(video, 1, 500);
    });

    video.addEventListener("timeupdate", () => {
      if (isFadingOut || video.duration === 0) return;
      const remaining = video.duration - video.currentTime;
      if (remaining <= 0.55) {
        isFadingOut = true;
        animateOpacity(video, 0, 500);
      }
    });

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

  // --- REVEAL ON SCROLL ---
  const revealElements = document.querySelectorAll(
    ".reveal-item, .reveal-item-left, .reveal-item-right",
  );
  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: "-100px",
  };

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observerInstance.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => observer.observe(el));

  // --- FAQ ACCORDION ---
  const faqTriggers = document.querySelectorAll(".faq-trigger");
  faqTriggers.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".liquid-glass");
      if (!item) return;

      const content = item.querySelector(".faq-content");
      const isOpen = item.classList.contains("faq-item-open");

      item.classList.toggle("faq-item-open", !isOpen);

      if (content) {
        if (isOpen) {
          content.classList.add("hidden");
        } else {
          content.classList.remove("hidden");
        }
      }
    });
  });

  // --- LANDING SUBSCRIBE FORM ---
  const subscribeForm = document.getElementById("subscribe-form");
  const successMessage = document.getElementById("success-message");

  if (subscribeForm && successMessage) {
    subscribeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = subscribeForm.querySelector("input");
      if (!input || !input.value) return;

      subscribeForm.classList.add("hidden");
      successMessage.classList.remove("hidden");

      setTimeout(() => {
        input.value = "";
        subscribeForm.classList.remove("hidden");
        successMessage.classList.add("hidden");
      }, 3000);
    });
  }

  // --- LOGIN/REGISTER (login.html) ---
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const showRegisterBtn = document.getElementById("show-register");
  const backToLoginBtn = document.getElementById("back-to-login");

  const toggleRegisterPasswordBtn = document.getElementById(
    "toggle-register-password",
  );
  const registerPasswordInput = document.getElementById("register-password");
  const registerEmailInput = document.getElementById("register-email");
  const registerEmailError = document.getElementById("register-email-error");
  const registerPasswordError = document.getElementById(
    "register-password-error",
  );
  const registerFormError = document.getElementById("register-form-error");
  const registerSuccess = document.getElementById("register-success");
  const registerTermsCheckbox = document.getElementById("register-terms");

  const togglePasswordBtn = document.getElementById("toggle-password");
  const loginPasswordInput = document.getElementById("login-password");
  const loginEmailInput = document.getElementById("login-email");
  const loginEmailError = document.getElementById("login-email-error");
  const loginPasswordError = document.getElementById("login-password-error");
  const loginFormError = document.getElementById("login-form-error");
  const loginSuccess = document.getElementById("login-success");

  const showEl = (el) => {
    if (!el) return;
    el.classList.remove("hidden");
  };

  const hideEl = (el) => {
    if (!el) return;
    el.classList.add("hidden");
  };

  const togglePasswordVisibility = (input) => {
    if (!input) return;
    const type = input.getAttribute("type") === "password" ? "text" : "password";
    input.setAttribute("type", type);
  };

  const showLoginForm = () => {
    hideEl(registerEmailError);
    hideEl(registerPasswordError);
    hideEl(registerFormError);
    hideEl(registerSuccess);

    showEl(loginForm);
    hideEl(registerForm);

    if (registerEmailInput) registerEmailInput.value = "";
    if (registerPasswordInput) registerPasswordInput.value = "";
    if (registerTermsCheckbox) registerTermsCheckbox.checked = false;
  };

  const showRegisterForm = () => {
    hideEl(loginForm);
    hideEl(loginEmailError);
    hideEl(loginPasswordError);
    hideEl(loginFormError);
    hideEl(loginSuccess);

    showEl(registerForm);
    hideEl(registerFormError);
  };

  if (togglePasswordBtn && loginPasswordInput) {
    togglePasswordBtn.addEventListener("click", () => {
      togglePasswordVisibility(loginPasswordInput);
    });
  }

  if (toggleRegisterPasswordBtn && registerPasswordInput) {
    toggleRegisterPasswordBtn.addEventListener("click", () => {
      togglePasswordVisibility(registerPasswordInput);
    });
  }

  if (showRegisterBtn && registerForm && backToLoginBtn) {
    showRegisterBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showRegisterForm();
      window.history.replaceState(null, "", "#register");
    });

    backToLoginBtn.addEventListener("click", () => {
      showLoginForm();
      window.history.replaceState(null, "", window.location.pathname);
    });

    if (window.location.hash === "#register") {
      showRegisterForm();
    }
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      hideEl(registerEmailError);
      hideEl(registerPasswordError);
      hideEl(registerFormError);
      hideEl(registerSuccess);

      const email = (registerEmailInput?.value || "").trim();
      const password = registerPasswordInput?.value || "";
      const termsOk = !!registerTermsCheckbox?.checked;

      let ok = true;
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!emailOk) {
        showEl(registerEmailError);
        ok = false;
      }

      if (password.length < 6) {
        showEl(registerPasswordError);
        ok = false;
      }

      if (!termsOk) {
        if (registerFormError) {
          registerFormError.textContent =
            "Bạn cần đồng ý điều khoản để tiếp tục.";
          showEl(registerFormError);
        }
        ok = false;
      }

      if (!ok) return;

      showEl(registerSuccess);
      const submitBtn = registerForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Đang đăng ký...";
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Tạo tài khoản";
        }
      }, 900);
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      hideEl(loginEmailError);
      hideEl(loginPasswordError);
      hideEl(loginFormError);
      hideEl(loginSuccess);

      const email = (loginEmailInput?.value || "").trim();
      const password = loginPasswordInput?.value || "";

      let ok = true;
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!emailOk) {
        showEl(loginEmailError);
        ok = false;
      }

      if (password.length < 6) {
        showEl(loginPasswordError);
        ok = false;
      }

      if (!ok) {
        if (loginFormError) {
          loginFormError.textContent =
            "Vui lòng kiểm tra lại email và mật khẩu.";
          showEl(loginFormError);
        }
        return;
      }

      showEl(loginSuccess);
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Đang đăng nhập...";
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Đăng nhập";
        }
      }, 900);
    });
  }
});
