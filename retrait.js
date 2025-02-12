document.addEventListener('DOMContentLoaded', function() {  
    // Récupérer les éléments du DOM précédents  
    const withdrawBalance = document.getElementById('withdrawBalance');  
    const withdrawCodeInput = document.getElementById('withdrawCode');  
    const withdrawBtn = document.querySelector('.withdraw-btn');  
    const paymentOptions = document.querySelectorAll('.payment-option');  
    const paymentDetailsSection = document.getElementById('paymentDetailsSection');  
    const savePaymentDetailsBtn = document.getElementById('savePaymentDetailsBtn');  
    const fullNameInput = document.getElementById('fullName');  
    const paymentAddressInput = document.getElementById('paymentAddress');  

    // Navigation items  
    const taperBtn = document.getElementById('taperBtn');  
    const tasksBtn = document.getElementById('tasksBtn');  
    const minigameBtn = document.getElementById('minigameBtn');  
    const withdrawBtnNav = document.getElementById('withdrawBtn');  

    // Charger le solde depuis localStorage  
    let balance = localStorage.getItem('balance')   
        ? parseFloat(localStorage.getItem('balance'))   
        : 0;  

    // Créer le toast de notification  
    function createToast() {  
        const toast = document.createElement('div');  
        toast.id = 'customToast';  
        toast.innerHTML = `  
            <div class="toast-icon">  
                <i class="fas fa-check-circle"></i>  
            </div>  
            <div class="toast-content">  
                <p>Vos informations ont bien été enregistrées</p>  
            </div>  
        `;  
        document.body.appendChild(toast);  

        // Style du toast  
        const style = document.createElement('style');  
        style.textContent = `  
            #customToast {  
                position: fixed;  
                bottom: 20px;  
                right: 20px;  
                background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);  
                color: white;  
                border-radius: 10px;  
                box-shadow: 0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08);  
                display: flex;  
                align-items: center;  
                padding: 15px;  
                max-width: 300px;  
                z-index: 1000;  
                animation: slideInUp 0.5s ease, fadeOut 0.5s ease 4.5s forwards;  
                opacity: 1;  
            }  

            #customToast .toast-icon {  
                margin-right: 15px;  
                font-size: 24px;  
            }  

            #customToast .toast-content {  
                flex-grow: 1;  
            }  

            @keyframes slideInUp {  
                from {  
                    transform: translateY(100%);  
                    opacity: 0;  
                }  
                to {  
                    transform: translateY(0);  
                    opacity: 1;  
                }  
            }  

            @keyframes fadeOut {  
                to {  
                    transform: translateY(100%);  
                    opacity: 0;  
                }  
            }  
        `;  
        document.head.appendChild(style);  

        // Supprimer le toast après 5 secondes  
        setTimeout(() => {  
            document.body.removeChild(toast);  
        }, 3000);  
    }  

    // Mettre à jour l'affichage du solde  
    function updateBalance() {  
        withdrawBalance.textContent = balance.toFixed(1);  
    }  

    // Initialiser le solde au chargement  
    updateBalance();  

    // Fonction pour afficher les pop-ups
    // Mise à jour de la fonction showPopup pour inclure l'icône d'alerte  
    function showPopup(message, isError, type = 'default') {  
        const popup = document.createElement('div');  
        popup.id = isError ? 'insufficientBalancePopup' : 'successPopup';  
        popup.innerHTML = `  
            <div class="popup-icon">  
                <i class="${type === 'alert' ? 'fas fa-exclamation-circle' : (isError ? 'fas fa-times-circle' : 'fas fa-check-circle')}"></i>  
            </div>  
            <div class="popup-content">  
                <p>${message}</p>  
            </div>  
        `;  
        document.body.appendChild(popup);  
        
        // Fermer le pop-up après 5 secondes  
        setTimeout(() => {  
            document.body.removeChild(popup);  
        }, 3000);  
    }  

    // Gestion du bouton de retrait  
    withdrawBtn.addEventListener('click', function() {  
        const withdrawCode = withdrawCodeInput.value.trim();  
        
        // Vérification du solde minimum  
        if (balance < 100000) {  
            showPopup('Votre solde est insuffisant', true);  
            return;  
        }  

        // Vérification du code de retrait  
        if (withdrawCode === '-*+3354') {  
            showPopup('Votre transaction a bien été effectuée', false);  
            // Réinitialiser le solde  
            balance = 0;  
            localStorage.setItem('balance', balance);  
            updateBalance();  
        } else {  
            showPopup('Votre code est incorrect', true);  
        }  
    });  

    // Fonction pour afficher des alertes  
    function showAlert(message, type) {  
        const alertBox = document.createElement('div');  
        alertBox.className = `alert alert-${type}`;  
        alertBox.textContent = message;  
        document.body.appendChild(alertBox);  

        setTimeout(() => {  
            alertBox.remove();  
        }, 3000);  
    }  

    // Gestionnaire d'événements pour les méthodes de paiement  
    paymentOptions.forEach(option => {  
        option.addEventListener('click', function() {  
            // Enlever la sélection précédente  
            paymentOptions.forEach(opt => opt.classList.remove('selected'));  
            
            // Ajouter la sélection à l'option cliquée  
            this.classList.add('selected');  
            
            // Afficher la section de détails de paiement  
            paymentDetailsSection.style.display = 'block';  
            
            // Désactiver le bouton de sauvegarde par défaut  
            savePaymentDetailsBtn.disabled = true;  
            savePaymentDetailsBtn.classList.add('disabled');  
        });  
    });  

    // Validation dynamique des champs  
    function validatePaymentDetails() {  
        const fullNameValue = fullNameInput.value.trim();  
        const paymentAddressValue = paymentAddressInput.value.trim();  

        if (fullNameValue && paymentAddressValue) {  
            savePaymentDetailsBtn.disabled = false;  
            savePaymentDetailsBtn.classList.remove('disabled');  
        } else {  
            savePaymentDetailsBtn.disabled = true;  
            savePaymentDetailsBtn.classList.add('disabled');  
        }  
    }  

    // Gestionnaire d'événements pour le bouton Sauvegarder  
    // Remplacer cette section dans votre gestionnaire de clic pour le bouton Sauvegarder  
    savePaymentDetailsBtn.addEventListener('click', function() {  
        // Vérifiez le solde avant de sauvegarder  
        if (balance < 100000) { // Solde insuffisant  
            showPopup('Votre solde est insuffisant.', true);  
            return;  
        }  

        // Nouveau cas pour le solde suffisant  
        // Affichez le message "Veuillez patientez pour l'envoie du code"  
        showPopup('Veuillez patientez pour l\'envoi du code.', false, 'alert');  

        // Enregistrer les informations  
        const paymentDetails = {  
            fullName: fullNameInput.value.trim(),  
            paymentAddress: paymentAddressInput.value.trim(),  
            method: document.querySelector('.payment-option.selected span').textContent  
        };  

        // Enregistrer dans localStorage après un court délai pour simuler un envoi  
        setTimeout(() => {  
            localStorage.setItem('paymentDetails', JSON.stringify(paymentDetails));  
            // Afficher le message de succès (optionnel)  
            showPopup('Vos informations ont bien été enregistrées.', false);  
        }, 3000);  

        // Réinitialiser la section  
        setTimeout(() => {  
            paymentDetailsSection.style.display = 'none';  
            fullNameInput.value = '';  
            paymentAddressInput.value = '';  
            document.querySelector('.payment-option.selected')?.classList.remove('selected');  

            // Réactiver la validation  
            savePaymentDetailsBtn.disabled = true;  
            savePaymentDetailsBtn.classList.add('disabled');  
        }, 4000); // Délai d'attente pour réinitialiser la section  
    });  

    // Ajouter des écouteurs d'événements pour la validation en temps réel  
    fullNameInput.addEventListener('input', validatePaymentDetails);  
    paymentAddressInput.addEventListener('input', validatePaymentDetails);  

    // Navigation entre les pages  
    taperBtn.addEventListener('click', function() {  
        window.location.href = 'taper.html';  
    });  

    tasksBtn.addEventListener('click', function() {  
        window.location.href = 'taches.html';  
    });  

    minigameBtn.addEventListener('click', function() {  
        window.location.href = 'jeux.html';  
    });  

    // Initialisation des particules  
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

    document.addEventListener('contextmenu', event => event.preventDefault());
});