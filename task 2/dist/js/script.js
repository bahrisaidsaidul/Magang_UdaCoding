// ======================
// HAMBURGER
// ======================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('is-active');
});


// ======================
// SCROLL REVEAL
// ======================
const faders = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('appear');
    }
  });
},{ threshold: 0.2 });

faders.forEach(f => observer.observe(f));


// ======================
// CAROUSEL
// ======================
const track = document.querySelector(".carousel-track");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");

let index = 0;
const totalSlides = 5; 
const slideWidth = 520;

function nextSlide(){
  index++;
  if(index >= totalSlides) index = 0;
  track.style.transform = `translateX(-${index * slideWidth}px)`;
}

function prevSlide(){
  index--;
  if(index < 0) index = totalSlides - 1;
  track.style.transform = `translateX(-${index * slideWidth}px)`;
}

next.addEventListener("click", nextSlide);
prev.addEventListener("click", prevSlide);


// ======================
// AUTO SLIDE PREMIUM
// ======================
let autoSlide = setInterval(nextSlide, 4000);

// pause saat hover
track.addEventListener("mouseenter", () => {
  clearInterval(autoSlide);
});

// lanjut saat mouse keluar
track.addEventListener("mouseleave", () => {
  autoSlide = setInterval(nextSlide, 4000);
});


// ======================
// MODAL IMAGE
// ======================
const slides = document.querySelectorAll('.carousel-track img');
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const closeBtn = document.querySelector(".close");

slides.forEach(img => {
  img.addEventListener('click', () => {
    modal.style.display = "block";
    modalImg.src = img.src;
  });
});

closeBtn.onclick = () => modal.style.display = "none";

window.onclick = (e) => {
  if(e.target === modal){
    modal.style.display = "none";
  }
};