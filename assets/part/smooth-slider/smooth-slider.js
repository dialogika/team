document.addEventListener("DOMContentLoaded", function () {
    var MySwiperR = new Swiper(".smooth-swiper-container-top", {
      direction: "horizontal",
      loop: true,
      autoplay: {
        delay: 1,
        disableOnInteraction: false,
      },
      speed: 5000,
      breakpoints: {
        320: {
          slidesPerView: "auto",
          spaceBetween: 10,
        },
        480: {
          slidesPerView: "auto",
          spaceBetween: 20,
        },
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
    var MySwiperR = new Swiper(".smooth-swiper-container-middle", {
      direction: "horizontal",
      loop: true,
      autoplay: {
        delay: 1,
        disableOnInteraction: false,
        reverseDirection: true,
      },
      speed: 5000,
      breakpoints: {
        320: {
          slidesPerView: "auto",
          spaceBetween: 10,
        },
        480: {
          slidesPerView: "auto",
          spaceBetween: 20,
        },
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  
    var MySwiperL = new Swiper(".smooth-swiper-container-bottom", {
      direction: "horizontal",
      loop: true,
      autoplay: {
        delay: 1,
        disableOnInteraction: false,
      },
      speed: 5000,
      breakpoints: {
        320: {
          slidesPerView: "auto",
          spaceBetween: 10,
        },
        480: {
          slidesPerView: "auto",
          spaceBetween: 20,
        },
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  });
  