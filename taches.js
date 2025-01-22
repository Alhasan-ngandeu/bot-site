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

    const TASK_POINTS = {
        AD_WATCH: 200,
        SHARE_INVITE: 150
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
        const referralLink = `${window.location.origin}${window.location.pathname}?ref=${userId}`;
        
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Rejoignez MONEY AFRIQUE',
                    text: 'Utilisez mon lien de parrainage pour rejoindre MONEY AFRIQUE !',
                    url: referralLink
                });
            } else {
                await navigator.clipboard.writeText(referralLink);
                showCustomPopup('Lien de parrainage copié dans le presse-papiers !');
            }
        } catch (error) {
            console.error('Erreur lors du partage:', error);
            showCustomPopup('Erreur lors du partage du lien', 'error');
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
});
