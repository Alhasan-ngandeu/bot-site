document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const balanceElement = document.getElementById('balance');
    const taperBtn = document.getElementById('taperBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const languageModal = document.getElementById('languageModal');
    const languageButtons = document.querySelectorAll('.language-btn');
    const trophyBtn = document.getElementById('trophyBtn');

    // Récupérer l'ID utilisateur
    const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
    localStorage.setItem('userId', userId);

    // Initialize balance
    function updateBalanceDisplay() {
        const userSpecificBalance = parseFloat(localStorage.getItem(`balance_${userId}`)) || 0;
        const generalBalance = parseFloat(localStorage.getItem('balance')) || 0;
        const totalBalance = userSpecificBalance + generalBalance;

        balanceElement.textContent = totalBalance.toFixed(1);
    }

    // Translations
    const translations = {
        fr: {
            'balance': 'Votre Solde',
            'expires': 'EXPIRE LE 12/25',
            'tap': 'Taper',
            'tasks': 'Tâches',
            'minigame': 'Mini-jeu',
            'withdraw': 'Retirer',
            'select-language': 'Sélectionner la langue',
            'player': 'Joueur'
        },
        en: {
            'balance': 'Your Balance',
            'expires': 'EXPIRES 12/25',
            'tap': 'Tap',
            'tasks': 'Tasks',
            'minigame': 'Mini-game',
            'withdraw': 'Withdraw',
            'select-language': 'Select Language',
            'player': 'Player'
        }
    };

    // Function to update language
    function updateLanguage(lang) {
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                if (element.tagName === 'INPUT') {
                    element.placeholder = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });

        languageButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        localStorage.setItem('preferredLanguage', lang);
    }

    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'fr';
    updateLanguage(savedLanguage);

    // Settings button click handler
    settingsBtn.addEventListener('click', () => {
        languageModal.classList.add('active');
    });

    // Close modal when clicking outside
    languageModal.addEventListener('click', (e) => {
        if (e.target === languageModal) {
            languageModal.classList.remove('active');
        }
    });

    // Language selection handlers
    languageButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            updateLanguage(lang);
            languageModal.classList.remove('active');
        });
    });

    // Prevent default behavior for nav links
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
        });
    });

    // Handle taper button click
    taperBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const currentBalance = parseFloat(localStorage.getItem('balance')) || 0;
        const newBalance = currentBalance + 0.5;
        localStorage.setItem('balance', newBalance);
        updateBalanceDisplay();
    });

    // Handle trophy button click
    trophyBtn.addEventListener('click', function(e) {
        e.preventDefault();

        const currentBalance = parseFloat(localStorage.getItem('balance')) || 0;
        const newBalance = currentBalance + 0.5;
        localStorage.setItem('balance', newBalance);
        updateBalanceDisplay();

        this.classList.add('ripple');
        this.addEventListener('animationend', function() {
            this.classList.remove('ripple');
        }, { once: true });
    });

    // Vérifier les mises à jour du solde toutes les secondes
    setInterval(updateBalanceDisplay, 1000);

    // Vérifier le bonus de parrainage
    function checkReferralBonus() {
        const urlParams = new URLSearchParams(window.location.search);
        const referrerId = urlParams.get('ref');

        if (referrerId && referrerId !== userId) {
            const referralKey = `referred_${referrerId}_${userId}`;

            if (!localStorage.getItem(referralKey)) {
                // Récupérer le solde du PARRAIN
                let referrerBalance = parseFloat(localStorage.getItem(`balance_${referrerId}`) || '0');

                // Ajouter le bonus de 150 FCFA AU PARRAIN
                referrerBalance += 150;
                localStorage.setItem(`balance_${referrerId}`, referrerBalance.toString());

                // Marquer ce parrainage comme traité
                localStorage.setItem(referralKey, 'true');

                // Notification pour le PARRAIN uniquement
                if (referrerId === getCurrentUserId()) {
                    showCustomNotification('Bonus de parrainage : Un nouvel utilisateur a utilisé votre lien !');
                }
            }
        }
    }

    function getCurrentUserId() {
        return localStorage.getItem('userId');
    }

    function showCustomNotification(message) {
        const notificationContainer = document.createElement('div');
        notificationContainer.className = 'referral-notification';
        notificationContainer.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-gift"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notificationContainer);

        setTimeout(() => {
            document.body.removeChild(notificationContainer);
        }, 5000);
    }

    // Initialiser l'affichage du solde
    updateBalanceDisplay();
    // Vérifier le bonus de parrainage
    checkReferralBonus();

    // Initialisation de particles.js
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4 },
            move: { enable: true, speed: 2, direction: 'none' }
        }
    });

    // Demander le nom d'utilisateur si c'est la première connexion
    function askForUsername() {
        const storedUsername = localStorage.getItem('username');
        if (!storedUsername) {
            const username = prompt("Veuillez entrer votre nom d'utilisateur :");
            if (username) {
                localStorage.setItem('username', username);
                updateCardHolder(username);
            }
        } else {
            updateCardHolder(storedUsername);
        }
    }

    // Mettre à jour le nom d'utilisateur dans la carte
    function updateCardHolder(username) {
        const cardHolderElement = document.querySelector('.card-holder');
        if (cardHolderElement) {
            cardHolderElement.textContent = username;
        }
    }

    // Appeler la fonction lors du chargement de la page
    askForUsername();
});
