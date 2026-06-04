const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const backToTop = document.getElementById("backToTop");
const currentYear = document.getElementById("currentYear");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

currentYear.textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 500);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

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
