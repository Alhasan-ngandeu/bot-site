document.addEventListener('DOMContentLoaded', function() {
    const watchAdBtns = [
        document.getElementById('watchAdBtn1'),
        document.getElementById('watchAdBtn2'),
        document.getElementById('watchAdBtn3')
    ];
    const shareBtn = document.getElementById('shareBtn');

    let userBalance = parseFloat(localStorage.getItem('balance')) || 0;
    const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
    localStorage.setItem('userId', userId);

    const TASK_POINTS = {
        AD_WATCH: 200,
        SHARE_INVITE: 150,
        REFERRAL_BONUS: 300
    };

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

    function updateBalanceDisplay() {
        const balanceElement = document.getElementById('balance');
        if (balanceElement) {
            balanceElement.textContent = userBalance.toFixed(1);
        }
        localStorage.setItem('balance', userBalance);
    }

    async function handleShare() {
        const referralLink = `${window.location.origin}/index.html?ref=${userId}`;
        
        try {
            await navigator.clipboard.writeText(referralLink);
            showCustomPopup('Lien de parrainage copié dans le presse-papiers !');
        } catch (error) {
            console.error('Erreur lors du partage:', error);
            showCustomPopup('Erreur lors de la génération du lien', 'error');
        }
    }

    watchAdBtns.forEach(button => {
        button.addEventListener('click', () => {
            button.disabled = true;
            button.textContent = "Revenez dans 24h pour regarder une nouvelle publicité";
            userBalance += TASK_POINTS.AD_WATCH;
            updateBalanceDisplay();
            showCustomPopup(`+${TASK_POINTS.AD_WATCH} FCFA pour avoir regardé la publicité`);
        });
    });

    if (shareBtn) {
        shareBtn.addEventListener('click', handleShare);
    }

    updateBalanceDisplay();
});