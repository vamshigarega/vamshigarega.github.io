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
function typeWriter(element, text, delay = 0) {
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

    const heroTitleText = "Hello, I'm Vamshi";
    const heroDescriptions = [
        "Data Engineer | Software Developer",
        "Transforming Data into Insights",
        "Building Scalable Cloud Solutions",
        "AI / ML Enthusiast"
    ];
    let currentDescIndex = 0;

    function updateHeroDesc() {
        heroDescElement.innerHTML = '';
        typeWriter(heroDescElement, heroDescriptions[currentDescIndex], 100);
        currentDescIndex = (currentDescIndex + 1) % heroDescriptions.length;
    }

    // Initial text animation
    typeWriter(heroTitleElement, heroTitleText, 100);
    updateHeroDesc();

    // Rotate description text every 4 seconds
    setInterval(updateHeroDesc, 4000);

    // Remove this line as it's no longer needed
    // setTimeout(() => typeWriter(heroDescElement, heroDescText, 100), heroTitleText.length * 100);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add fade-in animation for sections
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('hidden');
    observer.observe(section);
});

// Handle contact form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    const templateParams = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        to_name: 'Vamshi Krishna Garega',
    };

    emailjs.send('service_g7hxjpd', 'template_5xiobf9', templateParams)
        .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
            alert('Message sent successfully!');
            this.reset();
        })
        .catch((err) => {
            console.log('FAILED...', err);
            alert('Failed to send message. Please try again. Error: ' + err.text);
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        });
});
