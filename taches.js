document.addEventListener('DOMContentLoaded', function() {
    const watchAdBtns = [
        document.getElementById('watchAdBtn1'),
        document.getElementById('watchAdBtn2'),
        document.getElementById('watchAdBtn3')
    ];
    const shareBtn = document.getElementById('shareBtn');

    // Simuler un système de points/solde
    let userBalance = parseFloat(localStorage.getItem('balance')) || 0; // Récupérer le solde
    const TASK_POINTS = {
        AD_WATCH: 300, // Montant pour chaque publicité
        SHARE_INVITE: 500 // Montant pour chaque invitation
    };

    // Fonction pour créer un popup personnalisé et élégant
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
        localStorage.setItem('balance', userBalance); // Stocker le solde
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

    // Vérifier si le bouton doit être désactivé
    watchAdBtns.forEach(button => {
        const lastClicked = localStorage.getItem(button.id);
        if (lastClicked && (Date.now() - lastClicked < 24 * 60 * 60 * 1000)) {
            button.disabled = true;
            button.textContent = "Revenez dans 24h pour regarder une nouvelle publicité";
        }

        button.addEventListener('click', function() {
            handleWatchAd(button);
        });
    });

    // Générer le lien d'invitation
    const userId = localStorage.getItem('userId') || Date.now(); // Identifiant unique pour l'utilisateur
    localStorage.setItem('userId', userId); // Stocker l'utilisateur
    const inviteLink = `https://alhasan-ngandeu.github.io/bot-site/index.html?ref=${userId}`;

    // Gestion de la tâche de partage
    shareBtn.addEventListener('click', function() {
        shareBtn.disabled = true;

        const shareMessage = `Partagez ce lien avec vos amis pour gagner 500 FCFA: ${inviteLink}`;
        if (navigator.share) {
            navigator.share({
                title: 'Invitez vos amis',
                text: shareMessage,
                url: inviteLink
            }).then(() => {
                // Ne rien faire ici, le solde sera mis à jour lorsque le lien sera utilisé
            }).catch((error) => {
                console.error('Erreur lors du partage:', error);
            });
        } else {
            navigator.clipboard.writeText(inviteLink).then(() => {
                showCustomPopup('Lien copié dans le presse-papiers ! Partagez-le avec vos amis.');
            }).catch(err => {
                console.error('Erreur lors de la copie du lien:', err);
            });
        }

        setTimeout(() => {
            shareBtn.disabled = false;
        }, 2000);
    });

    // Vérifier si un paramètre d'invitation est présent dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const referrerId = urlParams.get('ref');
    if (referrerId) {
        // Récupérer le solde de l'utilisateur parrain
        let referrerBalance = parseFloat(localStorage.getItem(`balance_${referrerId}`)) || 0;
        referrerBalance += TASK_POINTS.SHARE_INVITE; // Augmenter le solde de l'utilisateur parrain
        localStorage.setItem(`balance_${referrerId}`, referrerBalance); // Stocker le nouveau solde
        userBalance += TASK_POINTS.SHARE_INVITE; // Ajouter au solde de l'utilisateur actuel
        updateBalanceDisplay();
        showCustomPopup(`+${TASK_POINTS.SHARE_INVITE} FCFA pour avoir invité un ami !`);
    }

    updateBalanceDisplay(); // Initialiser l'affichage du solde

    // Configuration des particules (si vous utilisez la bibliothèque particles.js)
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


