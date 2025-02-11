document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const watchAdBtns = [
        document.getElementById('watchAdBtn1'),
        document.getElementById('watchAdBtn2'),
        document.getElementById('watchAdBtn3')
    ];
    const shareBtn = document.getElementById('shareBtn');

    // Initialisation du solde et de l'ID utilisateur
    let userBalance = parseFloat(localStorage.getItem('balance')) || 0;
    const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
    localStorage.setItem('userId', userId);
    const username = localStorage.getItem('username');

    const TASK_POINTS = {
        AD_WATCH: 200,
        SHARE_INVITE: 150
    };

    // Fonction pour enregistrer un nouvel utilisateur
// Fonction pour enregistrer un nouvel utilisateur
    function registerNewUser(newUsername) {
        const existingUsernames = JSON.parse(localStorage.getItem('usernames')) || [];
        
        // Vérifier si le nom d'utilisateur existe déjà
        if (existingUsernames.includes(newUsername)) {
            showCustomPopup('Ce nom d\'utilisateur est déjà utilisé.', 'error');
            return;
        }

        // Ajouter le nouveau nom d'utilisateur à la liste
        existingUsernames.push(newUsername);
        localStorage.setItem('usernames', JSON.stringify(existingUsernames));

        // Vérifier le parrainage
        const urlParams = new URLSearchParams(window.location.search);
        const referrerId = urlParams.get('ref');

        if (referrerId) {
            const referralKey = `referred_${referrerId}_${userId}`;
            
            // Marquer cet utilisateur comme parrainé
            localStorage.setItem(referralKey, 'true');

            // Mettre à jour le solde du parrain uniquement après l'inscription
            const addReferralPoints = () => {
                const referrerBalance = parseFloat(localStorage.getItem(`balance_${referrerId}`) || '0');
                localStorage.setItem(`balance_${referrerId}`, (referrerBalance + TASK_POINTS.SHARE_INVITE).toString());
                showCustomPopup('Vous avez gagné 150 FCFA pour avoir été parrainé.', 'success');
            };

            // Appeler la fonction pour ajouter des points après une pause simulée
            setTimeout(addReferralPoints, 1000); // Attendre 1 seconde avant d'ajouter les points

            showCustomPopup('Inscription réussie !', 'success');
        } else {
            showCustomPopup('Inscription réussie !', 'success');
        }
    }

    // Exemple d'utilisation lors de la demande du nom d'utilisateur
    
    function askForUsername() {
        const usernameModal = document.getElementById('usernameModal');
        usernameModal.classList.add('active');

        const startBtn = document.getElementById('startBtn');
        startBtn.addEventListener('click', function() {
            const usernameInput = document.getElementById('usernameInput').value;
            registerNewUser(usernameInput); // Appel à la fonction d'enregistrement
            usernameModal.classList.remove('active'); // Fermer le modal
        });
    }

    const generateReferralLink = () => {  
        const userId = localStorage.getItem('userId');  
        const referralLink = `${window.location.origin}/index.html?ref=${userId}`; // Modifiez ici pour diriger vers index.html  
        return referralLink;  
    };
    


    // Fonction pour créer un popup personnalisé
    function showCustomPopup(message, type = 'success') {
        const popup = document.createElement('div');
        popup.className = `custom-popup ${type}`;
        popup.innerHTML = `
            <div class="popup-content">
                <div class="popup-icon">
                    ${type === 'success' ?
                        '<i class="fas fa-check-circle"></i>' :
                        '<i class="fas fa-exclamation-triangle"></i>'}
                </div>
                <div class="popup-message">${message}</div>
            </div>
        `;
        const style = document.createElement('style');
        style.textContent = `
            .custom-popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1000;
                width: 300px;
                padding: 20px;
                border-radius: 15px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                animation: popupAppear 0.3s ease-out, popupDisappear 0.3s ease-in forwards;
                animation-delay: 0s, 2.7s;
            }
            .custom-popup.success {
                background: linear-gradient(135deg, #4CAF50, #45a049);
                color: white;
            }
            .custom-popup.error {
                background: linear-gradient(135deg, #f44336, #d32f2f);
                color: white;
            }
            .popup-content {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .popup-icon {
                font-size: 60px;
                margin-bottom: 15px;
                opacity: 0.9;
            }
            .popup-message {
                font-size: 16px;
                font-weight: 500;
            }
            @keyframes popupAppear {
                from { opacity: 0; transform: translate(-50%, -50%) scale(0.7); }
                to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
            @keyframes popupDisappear {
                from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                to { opacity: 0; transform: translate(-50%, -50%) scale(0.7); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(popup);
        setTimeout(() => {
            document.body.removeChild(popup);
            document.head.removeChild(style);
        }, 3000);
    }

    // Mettre à jour l'affichage du solde
    function updateBalanceDisplay() {
        const balanceElement = document.getElementById('balance');
        if (balanceElement) {
            balanceElement.textContent = userBalance.toFixed(1);
        }
        localStorage.setItem('balance', userBalance);
    }

    // Vérifier le paramètre de parrainage dans l'URL
    function checkReferral() {
        const urlParams = new URLSearchParams(window.location.search);
        const referrerId = urlParams.get('ref');
        
        if (referrerId && referrerId !== userId) {
            const referralKey = `referred_${referrerId}_${userId}`;
            if (!localStorage.getItem(referralKey)) {
                // Ajouter les points au parrain
                const referrerBalance = parseFloat(localStorage.getItem(`balance_${referrerId}`) || '0');
                localStorage.setItem(`balance_${referrerId}`, (referrerBalance + TASK_POINTS.SHARE_INVITE).toString());
                
                // Marquer cet utilisateur comme parrainé
                localStorage.setItem(referralKey, 'true');
                
                showCustomPopup('Bienvenue ! Vous avez été parrainé avec succès !');
            }
        }
    }

    // Gestion du visionnage des publicités
    function handleWatchAd(button) {
        button.disabled = true;
        button.textContent = "Revenez dans 24h pour regarder une nouvelle publicité";

        setTimeout(() => {
            userBalance += TASK_POINTS.AD_WATCH;
            updateBalanceDisplay();
            showCustomPopup(`+${TASK_POINTS.AD_WATCH} FCFA pour avoir regardé la publicité`);
            localStorage.setItem(button.id, Date.now());
        }, 2000);
    }

    // Gestion du partage
    async function handleShare() {
        const referralLink = generateReferralLink();
        
        try {
            await navigator.clipboard.writeText(referralLink);
            showCustomPopup('Lien de parrainage copié dans le presse-papiers !');
        } catch (error) {
            console.error('Erreur lors de la copie:', error);
            showCustomPopup('Erreur lors de la copie du lien', 'error');
        }
    }

    // Initialisation des boutons de publicité
    watchAdBtns.forEach(button => {
        const lastClicked = localStorage.getItem(button.id);
        if (lastClicked && (Date.now() - lastClicked < 24 * 60 * 60 * 1000)) {
            button.disabled = true;
            button.textContent = "Revenez dans 24h pour regarder une nouvelle publicité";
        }

        button.addEventListener('click', () => handleWatchAd(button));
    });

    // Initialisation du bouton de partage
    if (shareBtn) {
        shareBtn.addEventListener('click', handleShare);
    }

    // Vérifier le parrainage au chargement
    checkReferral();

    // Demander le nom d'utilisateur si ce n'est pas déjà fait
    if (!username) {
        askForUsername();
    }

    // Initialiser le solde du parrain
    const referralBalance = parseFloat(localStorage.getItem(`balance_${userId}`) || '0');
    userBalance += referralBalance;
    localStorage.setItem(`balance_${userId}`, '0');

    generateReferralLink();
    
    // Initialiser l'affichage du solde
    updateBalanceDisplay();

    // Configuration des particules
    if (typeof particlesJS !== 'undefined') {
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
    }

    const navItems = document.querySelectorAll('.nav-item-enhanced');  

    navItems.forEach(item => {  
        item.addEventListener('click', function(event) {  
            // Supprime la classe 'active' de tous les éléments .nav-item-enhanced  
            navItems.forEach(item => item.classList.remove('active'));  

            // Ajoute la classe 'active' à l'élément cliqué  
            this.classList.add('active');  
        });  
    });  

    // Définir l'élément actif basé sur la page actuelle  
    const path = window.location.pathname;  

    function setActiveLink(linkId) {  
        navItems.forEach(item => item.classList.remove('active'));  
        document.getElementById(linkId).classList.add('active');  
    }  

    if (path.includes("index.html") || path === "/") {  
        setActiveLink("taperBtn");  
    } else if (path.includes("taches.html")) {  
        setActiveLink("tasksBtn");  
    } else if (path.includes("jeux.html")) {  
        setActiveLink("minigameBtn");  
    } else if (path.includes("retrait.html")) {  
        setActiveLink("withdrawBtn");  
    }
});
