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
        // Créer l'élément du popup
        const popup = document.createElement('div');
        popup.className = `custom-popup ${type}`;

        // Structure HTML du popup
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

        // Ajouter le style CSS directement dans le javascript
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
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.7);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }

            @keyframes popupDisappear {
                from {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.7);
                }
            }
        `;

        // Ajouter le style et le popup au body
        document.head.appendChild(style);
        document.body.appendChild(popup);

        // Supprimer le popup après l'animation
        setTimeout(() => {
            document.body.removeChild(popup);
            document.head.removeChild(style);
        }, 3000);
    }

    // Mettre à jour l'affichage du solde
    function updateBalanceDisplay() {
        const balanceElement = document.getElementById('balance');
        if (balanceElement) {
            balanceElement.textContent = userBalance.toFixed(1); // Affiche le solde
        }
        localStorage.setItem('balance', userBalance); // Stocker le nouveau solde
    }

    // Fonction pour gérer le visionnage des publicités
    function handleWatchAd(button) {
        button.disabled = true;
        button.textContent = "Revenez dans 24h pour regarder une nouvelle publicité";

        // Simuler le visionnage d'une publicité
        setTimeout(() => {
            userBalance += TASK_POINTS.AD_WATCH; // Incrémentation du solde
            updateBalanceDisplay(); // Mettre à jour l'affichage du solde

            // Utiliser le nouveau popup personnalisé
            showCustomPopup(`+${TASK_POINTS.AD_WATCH} FCFA pour avoir regardé la publicité`);

            localStorage.setItem(button.id, Date.now()); // Enregistre le dernier clic
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

    // Ajoutez une variable pour stocker le lien d'invitation
    const inviteLink = "https://alhasan-ngandeu.github.io/bot-site/invitation?ref=" + Date.now(); // URL fictive avec un paramètre unique

    // Gestion de la tâche de partage
    shareBtn.addEventListener('click', function() {
        shareBtn.disabled = true;

        // Afficher une fenêtre de partage
        const shareMessage = `Partagez ce lien avec vos amis pour gagner 500 FCFA: ${inviteLink}`;
        if (navigator.share) {
            navigator.share({
                title: 'Invitez vos amis',
                text: shareMessage,
                url: inviteLink
            }).then(() => {
                // Lorsque le partage est réussi
                userBalance += TASK_POINTS.SHARE_INVITE; // Ajoutez les points
                updateBalanceDisplay();
                showCustomPopup(`+${TASK_POINTS.SHARE_INVITE} FCFA pour avoir partagé l'app`);
            }).catch((error) => {
                console.error('Erreur lors du partage:', error);
            });
        } else {
            // Si le partage n'est pas supporté, copier le lien dans le presse-papiers
            navigator.clipboard.writeText(inviteLink).then(() => {
                showCustomPopup('Lien copié dans le presse-papiers ! Partagez-le avec vos amis.');
                userBalance += TASK_POINTS.SHARE_INVITE; // Ajoutez les points
                updateBalanceDisplay();
            }).catch(err => {
                console.error('Erreur lors de la copie du lien:', err);
            });
        }

        // Réactivez le bouton après un délai
        setTimeout(() => {
            shareBtn.disabled = false;
        }, 2000);
    });

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
