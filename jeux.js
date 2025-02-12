// jeux.js
document.addEventListener('DOMContentLoaded', function() {
    const gameModal = document.getElementById('gameModal');
    const gameContainer = document.getElementById('gameContainer');
    const closeBtn = document.querySelector('.close-btn');
    let balance = parseFloat(localStorage.getItem('balance')) || 0; // Récupérer balance
    let currentGame; // Variable pour suivre le jeu actuel

    // Fermeture du modal
    closeBtn.addEventListener('click', () => {
        gameModal.style.display = 'none';
        gameContainer.innerHTML = '';
    });

    // Fonction pour afficher le résultat
    function displayResult(reward) {
        const finalReward = reward * 50; // Multiplier la récompense par 50
        const gameMessage = document.getElementById('gameMessage');
        gameMessage.querySelector('#gameScore').innerText = finalReward; // Mettre à jour le score
        gameMessage.style.display = 'flex'; // Afficher le message

        // Gérer les clics sur les boutons
        gameMessage.querySelector('.btn-play').onclick = () => {
            gameModal.style.display = 'none';
            if (currentGame === 'memory') startMemoryGame();
            else if (currentGame === 'quickMath') startQuickMath();
            else if (currentGame === 'colorMatch') startColorMatch();
        };

        gameMessage.querySelector('.btn-confirm').onclick = () => {
            window.location.href = 'jeux.html'; // Rediriger vers jeux.html
        };

        // Mettez à jour la balance avec la récompense finale
        balance += finalReward; // Ajoutez la récompense finale au solde
        localStorage.setItem('balance', balance); // Mettez à jour localStorage
    }

    // Memory Game
    function startMemoryGame() {
        currentGame = 'memory'; // Définir le jeu actuel
        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
        const cards = [...colors, ...colors];
        let flippedCards = [];
        let matchedPairs = 0;

        gameContainer.innerHTML = `
            <h2>Memory Game</h2>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 20px;">
                ${cards.sort(() => Math.random() - 0.5).map((color, index) => `
                    <div class="memory-card" data-index="${index}" style="
                        width: 60px; 
                        height: 60px; 
                        background: #2a2a2a;
                        border-radius: 5px;
                        cursor: pointer;
                    "></div>
                `).join('')}
            </div>
        `;

        const cardElements = document.querySelectorAll('.memory-card');
        cardElements.forEach(card => {
            card.addEventListener('click', () => {
                const index = card.dataset.index;
                if (!flippedCards.includes(index) && flippedCards.length < 2) {
                    card.style.background = cards[index];
                    flippedCards.push(index);

                    if (flippedCards.length === 2) {
                        setTimeout(() => {
                            const [first, second] = flippedCards;
                            if (cards[first] === cards[second]) {
                                matchedPairs++;
                                if (matchedPairs === colors.length) {
                                    // Victoire !
                                    const reward = 1.0; // Récompense de base
                                    displayResult(reward);
                                }
                            } else {
                                cardElements[first].style.background = '#2a2a2a';
                                cardElements[second].style.background = '#2a2a2a';
                            }
                            flippedCards = [];
                        }, 1000);
                    }
                }
            });
        });

        gameModal.style.display = 'flex';
    }

    // Quick Math Game
    function startQuickMath() {
        currentGame = 'quickMath'; // Définir le jeu actuel
        let score = 0;
        let questionsLeft = 5;

        function generateQuestion() {
            const num1 = Math.floor(Math.random() * 10) + 1;
            const num2 = Math.floor(Math.random() * 10) + 1;
            const operators = ['+', '-', '*'];
            const operator = operators[Math.floor(Math.random() * operators.length)];
            const correctAnswer = eval(`${num1} ${operator} ${num2}`);
            return { num1, num2, operator, correctAnswer };
        }

        function showQuestion() {
            if (questionsLeft === 0) {
                const reward = score; // Récompense à la fin
                // Mettez à jour le score dans la section de résultat
                document.getElementById('gameScore').innerText = (reward === 0) ? '0' : (reward * 50).toFixed(0); // Multiplier par 50
                balance += reward * 50; // Ajouter le score obtenu au solde
                localStorage.setItem('balance', balance); // Mettre à jour le solde
                const gameMessage = document.getElementById('gameMessage');
                gameMessage.style.display = 'flex'; // Afficher le message
                gameModal.style.display = 'flex'; // Garder le modal ouvert
                document.querySelector('.btn-play').style.display = 'inline-block'; // Afficher le bouton Rejouer
                document.querySelector('.btn-confirm').style.display = 'inline-block'; // Afficher le bouton Terminer
                document.getElementById('mathAnswer').disabled = true; // Désactiver le champ d'entrée
                document.getElementById('checkButton').disabled = true; // Désactiver le bouton Vérifier
                return;
            }

            const question = generateQuestion();
            gameContainer.innerHTML = `
                <h2>Quick Math</h2>
                <div style="text-align: center; margin: 20px;">
                    <h3>${question.num1} ${question.operator} ${question.num2} = ?</h3>
                    <input type="number" id="mathAnswer" style="
                        margin: 10px;
                        padding: 5px;
                        width: 100px;
                    ">
                    <button id="checkButton" onclick="checkAnswer(${question.correctAnswer})" style="
                        background: #4affff;
                        border: none;
                        padding: 5px 15px;
                        border-radius: 5px;
                        cursor: pointer;
                    ">Vérifier</button>
                    <p>Questions restantes: ${questionsLeft}</p>
                    <p>Score: ${score}</p>
                </div>
            `;
        }

        window.checkAnswer = function(correctAnswer) {
            const userAnswer = parseInt(document.getElementById('mathAnswer').value);
            if (userAnswer === correctAnswer) {
                score++;
            }
            questionsLeft--;
            showQuestion();
        };

        showQuestion();
        gameModal.style.display = 'flex';
    }

    // Color Match Game
    function startColorMatch() {
        currentGame = 'colorMatch'; // Définir le jeu actuel
        const colors = ['🔴', '🟢', '🔵', '🟡'];
        let score = 0;
        let timeLeft = 30;
        let targetColor;
    
        function updateGame() {
            const colorNames = ['rouge', 'vert', 'bleu', 'jaune'];
            targetColor = Math.floor(Math.random() * colors.length);
    
            gameContainer.innerHTML = `
                <h2>Color Match</h2>
                <div style="text-align: center; margin: 20px;">
                    <h3>Cliquez sur le ${colorNames[targetColor]}</h3>
                    <div style="display: flex; justify-content: center; gap: 10px; margin: 20px;">
                        ${colors.map((color, index) => `
                            <div onclick="checkColor(${index})" style="
                                font-size: 40px;
                                cursor: pointer;
                            ">${color}</div>
                        `).join('')}
                    </div>
                    <p>Score: ${score}</p>
                    <p>Temps restant: ${timeLeft}s</p>
                </div>
            `;
        }
    
        window.checkColor = function(colorIndex) {
            if (colorIndex === targetColor) {
                score++;
            }
            updateGame();
        };
    
        const timer = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                clearInterval(timer);
                const reward = score * 0.2; // Récompense à la fin multipliée par 10
                const finalReward = reward * 5;
                displayResult(finalReward); // Afficher le résultat avec le score final
                gameModal.style.display = 'flex'; // Afficher le modal
            }
            updateGame();
        }, 1000);
    
        updateGame();
        gameModal.style.display = 'flex';
    }

    // Assigner les fonctions aux boutons
    window.startMemoryGame = startMemoryGame;
    window.startQuickMath = startQuickMath;
    window.startColorMatch = startColorMatch;

    // Gérer le bouton "Terminer" dans le modal
    const confirmButton = document.querySelector('.btn-confirm');
    confirmButton.onclick = () => {
        window.location.href = 'jeux.html'; // Rediriger vers jeux.html
    };

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
