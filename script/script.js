// Add class navbarDark on navbar scroll
const header = document.querySelector('.navbar');
window.onscroll = function() {
    const top = window.scrollY;
    if (top >= 100) {
        header.classList.add('navbarDark');
    } else {
        header.classList.remove('navbarDark');
    }
};

// Collapse navbar after click on small devices
const navLinks = document.querySelectorAll('.nav-item');
const menuToggle = document.getElementById('navbarSupportedContent');

navLinks.forEach((l) => {
    l.addEventListener('click', () => {
        new bootstrap.Collapse(menuToggle).toggle();
    });
});

// Typewriter effect function
function typeWriter(element, text, delay = 2) {
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, delay);
        }
    }
    type();
}

document.addEventListener("DOMContentLoaded", function() {
    const heroTitleElement = document.getElementById('hero_title');
    const heroDescElement = document.getElementById('hero_desc');

    const heroTitleText = "Hi, it's me Vamshi !!!";
    const heroDescText = "Thank you for visiting my portfolio...";

    heroTitleElement.innerHTML = '';
    heroDescElement.innerHTML = '';

    typeWriter(heroTitleElement, heroTitleText, 100);
    setTimeout(() => typeWriter(heroDescElement, heroDescText, 100), heroTitleText.length * 100);
});
