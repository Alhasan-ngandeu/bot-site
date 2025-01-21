document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const balanceElement = document.getElementById('balance');
    const taperBtn = document.getElementById('taperBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const languageModal = document.getElementById('languageModal');
    const languageButtons = document.querySelectorAll('.language-btn');
    
    // Récupérer l'ID utilisateur
    const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
    localStorage.setItem('userId', userId);
    
    // Initialize balance
    function updateBalanceDisplay() {
        // Récupérer le solde spécifique à l'utilisateur
        const userSpecificBalance = parseFloat(localStorage.getItem(`balance_${userId}`)) || 0;
        // Récupérer le solde général
        const generalBalance = parseFloat(localStorage.getItem('balance')) || 0;
        // Utiliser le total des deux soldes
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

        // Update active state of language buttons
        languageButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        // Store the selected language
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

    // Ajoutez ce code dans votre fonction DOMContentLoaded existante  
    const trophyBtn = document.getElementById('trophyBtn');  

    // Ajoutez ce gestionnaire d'événements  
    trophyBtn.addEventListener('click', function(e) {  
        e.preventDefault();  
        
        // Incrémentation du solde  
        const currentBalance = parseFloat(localStorage.getItem('balance')) || 0;
        const newBalance = currentBalance + 0.5;
        localStorage.setItem('balance', newBalance);
        updateBalanceDisplay();
        
        // Animation de ripple  
        this.classList.add('ripple');  
        
        // Effet de pulsation  
        this.addEventListener('animationend', function() {  
            this.classList.remove('ripple');  
        }, { once: true });  
    });
    
    // Initialiser l'affichage du solde
    updateBalanceDisplay();
    
    // Vérifier les mises à jour du solde toutes les secondes
    setInterval(updateBalanceDisplay, 1000);
    
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
});
