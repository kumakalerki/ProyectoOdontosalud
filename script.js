const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navIndicator = document.getElementById("navIndicator");
const backToTop = document.getElementById("backToTop");
const currentYear = document.getElementById("currentYear");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const internalLinks = document.querySelectorAll('a[href^="#"]');
const navItems = navLinks.querySelectorAll("a");

currentYear.textContent = new Date().getFullYear();

const getHeaderOffset = () => {
  const headerHeight = document.querySelector(".site-header").offsetHeight;
  return headerHeight - 1;
};

const easeInOutCubic = (progress) => {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
};

const slideToSection = (targetElement) => {
  const startPosition = window.scrollY;
  const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  const distance = targetPosition - startPosition;
  const duration = 850;
  let startTime = null;

  const animateScroll = (currentTime) => {
    if (!startTime) {
      startTime = currentTime;
    }

    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    window.scrollTo(0, startPosition + distance * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};

const moveNavIndicator = (activeLink) => {
  if (!activeLink || window.innerWidth <= 780) {
    navIndicator.classList.remove("visible");
    return;
  }

  navItems.forEach((link) => link.classList.remove("active"));
  activeLink.classList.add("active");

  navIndicator.style.left = `${activeLink.offsetLeft}px`;
  navIndicator.style.width = `${activeLink.offsetWidth}px`;
  navIndicator.classList.add("visible");
};

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

internalLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (!target) {
      return;
    }

    event.preventDefault();
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    slideToSection(target);

    if (link.closest("#navLinks")) {
      moveNavIndicator(link);
    }
  });
});

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 500);
});

backToTop.addEventListener("click", () => {
  slideToSection(document.getElementById("inicio"));
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const activeLink = navLinks.querySelector(`a[href="#${entry.target.id}"]`);
        moveNavIndicator(activeLink);
      }
    });
  },
  {
    rootMargin: "-45% 0px -45% 0px",
    threshold: 0
  }
);

document.querySelectorAll("#inicio, main section[id]").forEach((section) => {
  sectionObserver.observe(section);
});

window.addEventListener("resize", () => {
  const activeLink = navLinks.querySelector("a.active") || navLinks.querySelector('a[href="#inicio"]');
  moveNavIndicator(activeLink);
});

moveNavIndicator(navLinks.querySelector('a[href="#inicio"]'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16
  }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const requiredFields = contactForm.querySelectorAll("[required]");
  const emptyField = Array.from(requiredFields).find((field) => !field.value.trim());

  formStatus.classList.remove("error");

  if (emptyField) {
    formStatus.textContent = "Por favor, completa todos los campos obligatorios.";
    formStatus.classList.add("error");
    emptyField.focus();
    return;
  }

  const email = document.getElementById("email");
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());

  if (!emailIsValid) {
    formStatus.textContent = "Ingresa un correo electrónico válido.";
    formStatus.classList.add("error");
    email.focus();
    return;
  }

  formStatus.textContent = "Consulta lista para enviar. Puedes conectar este formulario a un servicio de correo.";
  contactForm.reset();
});
