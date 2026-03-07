// ===== VARIABLES GLOBALES =====
let currentSlide = 0;

// ===== SPLASH SCREEN =====
const splashScreen = document.getElementById('splashScreen');
const splashVideo = document.getElementById('splashVideo');
const progressBar = document.getElementById('progressBar');
const soundPermission = document.getElementById('soundPermission');
const enableSoundBtn = document.getElementById('enableSoundBtn');
const muteToggle = document.getElementById('muteToggle');

if (splashVideo) {
    splashVideo.muted = true;
    splashVideo.play().catch(e => console.log('Autoplay bloqué:', e));
    
    if (enableSoundBtn) {
        enableSoundBtn.addEventListener('click', () => {
            splashVideo.muted = false;
            splashVideo.volume = 1.0;
            if (soundPermission) soundPermission.style.display = 'none';
            if (muteToggle) muteToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            splashVideo.play();
        });
    }
    
    if (muteToggle) {
        muteToggle.addEventListener('click', () => {
            if (splashVideo.muted) {
                splashVideo.muted = false;
                muteToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                muteToggle.title = "Couper le son";
            } else {
                splashVideo.muted = true;
                muteToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
                muteToggle.title = "Activer le son";
            }
        });
    }
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 1;
        if (progressBar) {
            progressBar.style.width = (progress / 15) * 100 + '%';
        }
    }, 100);
    
    splashVideo.addEventListener('ended', () => {
        clearInterval(interval);
        if (splashScreen) splashScreen.classList.add('hidden');
    });
    
    const skipButton = document.getElementById('skipSplash');
    if (skipButton) {
        skipButton.addEventListener('click', () => {
            clearInterval(interval);
            if (splashScreen) splashScreen.classList.add('hidden');
        });
    }
}

// ===== CHAT WHATSAPP =====
window.toggleChat = function() {
    const chat = document.getElementById('whatsappChat');
    if (chat) chat.classList.toggle('minimized');
};

window.sendWhatsApp = function(type) {
    const phone = '221771359572';
    let message = '';
    
    switch(type) {
        case 'info':
            message = 'Bonjour, pouvez-vous me donner plus d\'informations sur vos produits ?';
            break;
        case 'reparation':
            message = 'Bonjour, j\'ai besoin d\'une réparation pour mon téléphone';
            break;
        case 'disponibilite':
            message = 'Bonjour, est-ce que ce produit est disponible ?';
            break;
        case 'contact':
            message = 'Bonjour, je souhaite vous contacter';
            break;
        default:
            message = 'Bonjour, je souhaite avoir plus d\'informations';
    }
    
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
};

// ===== COMPTOIR VISITEURS =====
setInterval(() => {
    const visitorCount = document.getElementById('visitorCount');
    if (visitorCount) {
        const count = Math.floor(Math.random() * 30) + 15;
        visitorCount.textContent = count;
    }
}, 5000);

// ===== CARROUSEL =====
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-item');
    const dotsContainer = document.getElementById('carouselDots');
    
    if (slides.length === 0 || !dotsContainer) return;
    
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    function updateCarousel() {
        const carouselInner = document.getElementById('carouselInner');
        if (carouselInner) {
            carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    window.nextSlide = function() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    };
    
    window.prevSlide = function() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel();
    };
    
    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }
    
    setInterval(() => window.nextSlide(), 5000);
    updateCarousel();
}
initCarousel();

// ===== COMMANDE PRODUIT =====
window.orderProduct = function(name) {
    const phone = '221771359572';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent('Bonjour, je souhaite connaître le prix du ' + name)}`, '_blank');
};

// ===== CALCULATEUR DE LIVRAISON =====
window.calculerLivraison = function() {
    const zone = document.getElementById('zoneLivraison');
    if (!zone) return;
    
    const zoneValue = zone.value;
    let frais = 0;
    
    switch(zoneValue) {
        case 'dakar': frais = 1000; break;
        case 'banlieue': frais = 2000; break;
        case 'region': frais = 3000; break;
        default: frais = 1000;
    }
    
    const deliveryResult = document.getElementById('deliveryResult');
    if (deliveryResult) {
        deliveryResult.innerHTML = `<strong>Frais de livraison : ${frais.toLocaleString()} FCFA</strong>`;
    }
};

// ===== POP-UP DE SORTIE FUN =====
let popupShown = false;

document.addEventListener('mouseleave', (e) => {
    const exitPopup = document.getElementById('exitPopup');
    if (e.clientY <= 0 && !popupShown && exitPopup) {
        exitPopup.style.display = 'flex';
        popupShown = true;
        
        // Petit effet sonore amusant (optionnel - décommente si tu veux)
        // const audio = new Audio('https://www.myinstants.com/media/sounds/mario-coin.mp3');
        // audio.play().catch(() => {});
    }
});

window.closePopup = function() {
    const exitPopup = document.getElementById('exitPopup');
    if (exitPopup) {
        exitPopup.style.display = 'none';
    }
};

window.sendFunWhatsApp = function() {
    const phone = '221771359572';
    
    // Messages aléatoires pour plus de fun
    const messages = [
        '😂 Salut Adra Électronique ! Je me suis fait attraper par votre pop-up trop fun... Du coup je veux profiter des offres de fou ! Parle-moi des meilleurs prix pour les téléphones et accessoires s\'il te plaît ! 🚀📱🔥',
        '🤣 Oh non vous m\'avez chopé ! Bon OK je craque... Dites-moi tout sur vos meilleures affaires ! 🎁✨',
        '😆 Votre pop-up est plus fort que ma volonté de partir ! Alors allez-y, envoyez-moi vos meilleures offres ! 💪📱',
        '🦸‍♂️ Vous m\'avez eu ! Je reviens dare-dare pour connaître vos promos de ouf ! 💥🔥',
        '🏃‍♂️💨 J\'essayais de partir mais vous êtes plus rapides ! Bon... Qu\'est-ce que vous avez de beau en ce moment ?'
    ];
    
    // Choisir un message aléatoire
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(randomMessage)}`, '_blank');
    
    // Animation de fermeture
    const popup = document.getElementById('exitPopup');
    popup.style.animation = 'bounceIn 0.5s reverse';
    setTimeout(() => {
        popup.style.display = 'none';
        popup.style.animation = '';
    }, 500);
    
    alert('🎉 Direction WhatsApp pour des offres explosives !');
};

// ===== FORMULAIRE DE CONTACT (UNIQUEMENT WHATSAPP) =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('contactName')?.value || '';
        const phone = document.getElementById('contactPhone')?.value || '';
        const subject = document.getElementById('contactSubject')?.value || 'Non précisé';
        const message = document.getElementById('contactMessage')?.value || '';
        
        if (!name || !phone || !message) {
            alert('Veuillez remplir tous les champs');
            return;
        }
        
        const whatsappMessage = `Bonjour Adra Électronique 313%0A%0A📱 *Nouveau message de ${encodeURIComponent(name)}*%0A%0A📞 Téléphone: ${encodeURIComponent(phone)}%0A📌 Sujet: ${encodeURIComponent(subject)}%0A💬 Message: ${encodeURIComponent(message)}%0A%0AMerci de me répondre rapidement.`;
        
        window.open(`https://wa.me/221771359572?text=${whatsappMessage}`, '_blank');
        this.reset();
        alert('✅ Message envoyé ! Vous allez être redirigé vers WhatsApp.');
    });
}

// ===== SERVICE WORKER (PWA) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(error => {
            console.log('Service Worker registration failed:', error);
        });
    });
}

// ===== GESTIONNAIRE D'ERREURS D'IMAGES =====
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        console.log('Image non trouvée:', e.target.src);
        if (!e.target.src.includes('placeholder')) {
            e.target.src = 'https://via.placeholder.com/300x300/333333/FFD700?text=Image+non+disponible';
        }
    }
}, true);

// ===== ANIMATION AU SCROLL =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.6s ease-out';
    observer.observe(section);
});

// ===== SMOOTH SCROLL POUR LES ANCRES =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== PETITE BLAGUE DANS LA CONSOLE (pour les développeurs) =====
console.log('%c🔥 Adra Électronique 313 🔥', 'color: #FFD700; font-size: 20px; font-weight: bold;');
console.log('%c🚀 Site chargé avec succès !', 'color: #25D366; font-size: 16px;');
console.log('%c😎 Prêt à vendre des téléphones !', 'color: #FFA500; font-size: 14px;');

// ===== BONUS: MESSAGE DU JOUR =====
const messagesDuJour = [
    "💡 Le saviez-vous ? Nos réparations sont plus rapides qu'un éclair !",
    "📱 Aujourd'hui c'est le bon jour pour acheter un nouveau téléphone !",
    "🎁 PSST... Demandez-nous nos offres secrètes par WhatsApp !",
    "⚡ Nos chargeurs 20W rechargent votre téléphone pendant que vous clignez des yeux !",
    "😉 Vous avez cliqué sur F12 ? Vous devez être un pro !"
];

const messageAleatoire = messagesDuJour[Math.floor(Math.random() * messagesDuJour.length)];
console.log(`%c${messageAleatoire}`, 'color: #FFD700; font-size: 12px; font-style: italic;');