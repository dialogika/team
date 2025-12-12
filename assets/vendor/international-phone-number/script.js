// Scroll animation
var iti;
var subFooterIti; //varibel untuk number di subscribe/connect now footer
document.addEventListener("DOMContentLoaded", function () {
  const input = document.querySelector("#whatsapp-number");
  if (input) {
    iti = window.intlTelInput(input, {
      initialCountry: "id",
      utilsScript: "./utils.js",
    });
  }

  
  // varibel untuk number di subscribe/connect now footer
  const inputSubFooterWhatsapp = document.querySelector(
    "#inputSubFooterWhatsapp"
  );
  if (inputSubFooterWhatsapp) {
    subFooterIti = window.intlTelInput(inputSubFooterWhatsapp, {
      initialCountry: "id",
      utilsScript: "./utils.js",
    });
  }

  document.querySelectorAll("#scroll-link").forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      const offset = parseInt(this.getAttribute("data-scroll-offset")) || 0;
      const elementPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset;

      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    });
  });
});
