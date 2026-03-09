// ===== VARIABLES GLOBALES =====
let currentSlide = 0;
let splashTimeout;

const WHATSAPP_NUMBERS = {
    principal: '221771359572',
    commandes: '221760280674',
    sav: '221710112255'
};

function getTrackingSource() {
    const params = new URLSearchParams(window.location.search);
    return params.get('src') || params.get('source') || 'site';
}

function trackEvent(eventName, payload = {}) {
    const eventPayload = {
        event: eventName,
        source: getTrackingSource(),
        timestamp: new Date().toISOString(),
        ...payload
    };

    if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push(eventPayload);
    }

    console.log('tracking_event', eventPayload);
}

function openWhatsApp(message, target = WHATSAPP_NUMBERS.principal, context = 'general') {
    const source = getTrackingSource();
    const finalMessage = `${message}

— Source: ${source}`;
    trackEvent('whatsapp_open', { target, context });
    window.open(`https://wa.me/${target}?text=${encodeURIComponent(finalMessage)}`, '_blank');
}

// ===== SPLASH SCREEN CORRIGÉ =====
const splashScreen = document.getElementById('splashScreen');
const splashVideo = document.getElementById('splashVideo');
const progressBar = document.getElementById('progressBar');
const soundPermission = document.getElementById('soundPermission');
const enableSoundBtn = document.getElementById('enableSoundBtn');
const muteToggle = document.getElementById('muteToggle');

function hideSplashScreen() {
    if (splashScreen) {
        splashScreen.classList.add('hidden');
        // Petit délai pour que l'animation se termine avant de retirer du DOM
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 800);
    }
}

if (splashVideo) {
    // Configuration initiale
    splashVideo.muted = true;
    splashVideo.volume = 0;
    
    // Gestion de la lecture automatique
    const playPromise = splashVideo.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Autoplay bloqué par le navigateur:', error);
            // Afficher le bouton d'activation du son si l'autoplay est bloqué
            if (soundPermission) {
                soundPermission.style.display = 'flex';
            }
        });
    }
    
    // Barre de progression
    let progressInterval;
    
    function startProgressBar() {
        let progress = 0;
        progressInterval = setInterval(() => {
            progress += 1;
            if (progressBar) {
                progressBar.style.width = (progress / 10) * 100 + '%'; // 10 secondes max
            }
            if (progress >= 100) {
                clearInterval(progressInterval);
            }
        }, 100);
    }
    
    startProgressBar();
    
    // Quand la vidéo se termine
    splashVideo.addEventListener('ended', function() {
        clearInterval(progressInterval);
        hideSplashScreen();
    });
    
    // Si la vidéo dure moins longtemps que prévu
    splashVideo.addEventListener('durationchange', function() {
        const duration = splashVideo.duration;
        if (duration && !isNaN(duration)) {
            clearInterval(progressInterval);
            // Recalculer l'intervalle basé sur la durée réelle
            let progress = 0;
            progressInterval = setInterval(() => {
                progress += 1;
                const percent = (progress / (duration * 10)) * 100;
                if (progressBar) {
                    progressBar.style.width = percent + '%';
                }
                if (progress >= duration * 10) {
                    clearInterval(progressInterval);
                }
            }, 100);
        }
    });
    
    // Timeout de sécurité (15 secondes max)
    setTimeout(() => {
        if (splashScreen && !splashScreen.classList.contains('hidden')) {
            clearInterval(progressInterval);
            hideSplashScreen();
        }
    }, 15000);
    
    // Bouton pour activer le son
    if (enableSoundBtn) {
        enableSoundBtn.addEventListener('click', function() {
            splashVideo.muted = false;
            splashVideo.volume = 1.0;
            if (soundPermission) soundPermission.style.display = 'none';
            if (muteToggle) muteToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            // Relancer la vidéo si elle est en pause
            if (splashVideo.paused) {
                splashVideo.play();
            }
        });
    }
    
    // Bouton mute/unmute
    if (muteToggle) {
        muteToggle.addEventListener('click', function() {
            if (splashVideo.muted) {
                splashVideo.muted = false;
                splashVideo.volume = 1.0;
                muteToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                muteToggle.title = "Couper le son";
            } else {
                splashVideo.muted = true;
                splashVideo.volume = 0;
                muteToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
                muteToggle.title = "Activer le son";
            }
        });
    }
    
    // Bouton passer
    const skipButton = document.getElementById('skipSplash');
    if (skipButton) {
        skipButton.addEventListener('click', function() {
            clearInterval(progressInterval);
            hideSplashScreen();
            // Arrêter la vidéo
            splashVideo.pause();
            splashVideo.currentTime = 0;
        });
    }
}

// ===== CHAT WHATSAPP =====
window.toggleChat = function() {
    const chat = document.getElementById('whatsappChat');
    if (chat) {
        chat.classList.toggle('minimized');
    }
};

window.sendWhatsApp = function(type) {
    let message = '';
    let target = WHATSAPP_NUMBERS.principal;

    switch(type) {
        case 'info':
            message = "Bonjour, pouvez-vous me donner plus d'informations sur vos produits ?";
            break;
        case 'reparation':
            target = WHATSAPP_NUMBERS.sav;
            message = "Bonjour, j'ai besoin d'une réparation pour mon téléphone";
            break;
        case 'disponibilite':
            target = WHATSAPP_NUMBERS.commandes;
            message = 'Bonjour, est-ce que ce produit est disponible ?';
            break;
        case 'catalogue':
            target = WHATSAPP_NUMBERS.commandes;
            message = "Bonjour, je veux recevoir votre catalogue complet avec les prix du jour.";
            break;
        case 'promo':
            target = WHATSAPP_NUMBERS.commandes;
            message = "Bonjour, pouvez-vous m'envoyer vos promotions actuelles ?";
            break;
        case 'support':
            target = WHATSAPP_NUMBERS.sav;
            message = "Bonjour, j'ai besoin d'assistance SAV.";
            break;
        case 'contact':
            message = 'Bonjour, je souhaite vous contacter';
            break;
        default:
            message = "Bonjour, je souhaite avoir plus d'informations";
    }

    openWhatsApp(message, target, `chat_${type}`);
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
    const carouselInner = document.getElementById('carouselInner');
    
    if (slides.length === 0 || !dotsContainer || !carouselInner) return;
    
    // Créer les dots
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    function updateCarousel() {
        if (carouselInner) {
            carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    window.nextSlide = function() {
        currentSlide = (currentSlide + 1) % slides.length;
        trackEvent('carousel_next', { slide: currentSlide });
        updateCarousel();
    };
    
    window.prevSlide = function() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        trackEvent('carousel_prev', { slide: currentSlide });
        updateCarousel();
    };
    
    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }
    
    // Auto-slide toutes les 5 secondes
    setInterval(() => {
        if (slides.length > 0) {
            window.nextSlide();
        }
    }, 5000);
    
    updateCarousel();
}

// Initialiser le carrousel quand le DOM est chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
} else {
    initCarousel();
}

// ===== COMMANDE PRODUIT =====
window.orderProduct = function(name) {
    openWhatsApp('Bonjour, je souhaite connaître le prix du ' + name, WHATSAPP_NUMBERS.commandes, 'product_order');
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
        // Animation
        deliveryResult.style.animation = 'pulse 0.5s';
        setTimeout(() => {
            deliveryResult.style.animation = '';
        }, 500);
    }
};

// ===== POP-UP DE SORTIE =====
let popupShown = false;

document.addEventListener('mouseleave', (e) => {
    const exitPopup = document.getElementById('exitPopup');
    if (e.clientY <= 0 && !popupShown && exitPopup) {
        exitPopup.style.display = 'flex';
        popupShown = true;
    }
});

window.closePopup = function() {
    const exitPopup = document.getElementById('exitPopup');
    if (exitPopup) {
        exitPopup.style.animation = 'fadeOut 0.3s';
        setTimeout(() => {
            exitPopup.style.display = 'none';
            exitPopup.style.animation = '';
        }, 300);
    }
};

window.sendExitOffer = function() {
    const exitPhoneInput = document.getElementById('exitPhone');
    const clientPhone = exitPhoneInput?.value?.trim() || '';

    const message = clientPhone
        ? `Bonjour, je veux recevoir vos offres exclusives. Mon numéro WhatsApp: ${clientPhone}`
        : 'Bonjour, je veux recevoir vos offres exclusives WhatsApp.';

    openWhatsApp(message, WHATSAPP_NUMBERS.commandes, 'exit_offer');

    if (exitPhoneInput) {
        exitPhoneInput.value = '';
    }
    window.closePopup();
};

// ===== FORMULAIRE DE CONTACT =====
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
        
        const whatsappMessage = `Bonjour Adra Électronique 313\n\n📱 Nouveau message de ${name}\n\n📞 Téléphone: ${phone}\n📌 Sujet: ${subject}\n💬 Message: ${message}\n\nMerci de me répondre rapidement.`;
        
        openWhatsApp(whatsappMessage, WHATSAPP_NUMBERS.principal, 'contact_form');
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
        const href = this.getAttribute('href');
        if (!href || href === '#') {
            return;
        }
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== MESSAGES DE BIENVENUE =====
console.log('%c🔥 Adra Électronique 313 🔥', 'color: #FFD700; font-size: 20px; font-weight: bold;');
console.log('%c🚀 Site chargé avec succès !', 'color: #25D366; font-size: 16px;');
console.log('%c😎 Prêt à vendre des téléphones !', 'color: #FFA500; font-size: 14px;');

// Message aléatoire
const messagesDuJour = [
    "💡 Le saviez-vous ? Nos réparations sont plus rapides qu'un éclair !",
    "📱 Aujourd'hui c'est le bon jour pour acheter un nouveau téléphone !",
    "🎁 PSST... Demandez-nous nos offres secrètes par WhatsApp !",
    "⚡ Nos chargeurs 20W rechargent votre téléphone pendant que vous clignez des yeux !",
    "😉 Vous avez cliqué sur F12 ? Vous devez être un pro !"
];

const messageAleatoire = messagesDuJour[Math.floor(Math.random() * messagesDuJour.length)];
console.log(`%c${messageAleatoire}`, 'color: #FFD700; font-size: 12px; font-style: italic;');
