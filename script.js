document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const hitsSpan = document.getElementById('hits');
    const missesSpan = document.getElementById('misses');
    const playerNameInput = document.getElementById('playerName');
    const startGameBtn = document.getElementById('startGameBtn');
    const resetGameBtn = document.getElementById('resetGameBtn');
    const winnersList = document.getElementById('winnersList');

    // Novos elementos para a funcionalidade de adivinhação
    const guessSection = document.querySelector('.guess-section');
    const stateGuessInput = document.getElementById('stateGuessInput');
    const checkGuessBtn = document.getElementById('checkGuessBtn');
    const guessFeedback = document.getElementById('guessFeedback');

    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let hits = 0;
    let misses = 0;
    let currentPlayer = 'Jogador';
    let gameStarted = false;
    let awaitingGuess = false; // Novo estado para controlar quando a adivinhação é necessária

    // Array de bandeiras dos estados brasileiros (mais exemplos adicionados)
    const flagImages = [
        { name: 'Acre', img: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Bandeira_do_Acre.svg' },
        { name: 'Alagoas', img: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Bandeira_de_Alagoas.svg' },
        { name: 'Amapá', img: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Bandeira_do_Amap%C3%A1.svg' },
        { name: 'Amazonas', img: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Bandeira_do_Amazonas.svg' },
        { name: 'Bahia', img: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Bandeira_da_Bahia.svg' },
        { name: 'Ceará', img: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Bandeira_do_Cear%C3%A1.svg' },
        { name: 'Distrito Federal', img: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Bandeira_do_Distrito_Federal_%28Brasil%29.svg' },
        { name: 'Espírito Santo', img: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Bandeira_do_Esp%C3%ADrito_Santo.svg' },
        { name: 'Goiás', img: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Bandeira_de_Goi%C3%A1s.svg' },
        { name: 'Maranhão', img: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Bandeira_do_Maranh%C3%A3o.svg' },
        { name: 'Mato Grosso', img: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Bandeira_de_Mato_Grosso.svg' },
        { name: 'Mato Grosso do Sul', img: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Bandeira_de_Mato_Grosso_do_Sul.svg' },
        { name: 'Minas Gerais', img: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Bandeira_de_Minas_Gerais.svg' },
        { name: 'Pará', img: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Bandeira_do_Par%C3%A1.svg' },
        { name: 'Paraíba', img: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Bandeira_da_Para%C3%ADba.svg' },
        { name: 'Paraná', img: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Bandeira_do_Paran%C3%A1.svg' },
        { name: 'Pernambuco', img: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Bandeira_de_Pernambuco.svg' },
        { name: 'Piauí', img: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Bandeira_do_Piau%C3%AD.svg' },
        { name: 'Rio de Janeiro', img: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Bandeira_do_estado_do_Rio_de_Janeiro.svg' },
        { name: 'Rio Grande do Norte', img: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Bandeira_do_Rio_Grande_do_Norte.svg' },
        { name: 'Rio Grande do Sul', img: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Bandeira_do_Rio_Grande_do_Sul.svg' },
        { name: 'Rondônia', img: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Bandeira_de_Rond%C3%B4nia.svg' },
        { name: 'Roraima', img: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Bandeira_de_Roraima.svg' },
        { name: 'Santa Catarina', img: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Bandeira_de_Santa_Catarina.svg' },
        { name: 'São Paulo', img: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Bandeira_do_estado_de_S%C3%A3o_Paulo.svg' },
        { name: 'Sergipe', img: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Bandeira_de_Sergipe.svg' },
        { name: 'Tocantins', img: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Bandeira_do_Tocantins.svg' },
    ];

    function initializeGame() {
        gameBoard.innerHTML = '';
        flippedCards = [];
        matchedPairs = 0;
        hits = 0;
        misses = 0;
        hitsSpan.textContent = hits;
        missesSpan.textContent = misses;
        document.body.classList.remove('correct-flash', 'wrong-flash');
        resetGuessSection(); // Reseta a seção de adivinhação

        // Embaralha as bandeiras e duplica para ter pares
        // Importante: use um subconjunto de flagImages para o jogo ser jogável
        // Aqui, estou pegando 8 bandeiras aleatórias para criar 16 cartas (8 pares)
        const selectedFlags = getRandomFlags(8); // Altere o número para mais ou menos pares
        cards = [...selectedFlags, ...selectedFlags];
        cards.sort(() => 0.5 - Math.random());

        cards.forEach((flag, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.name = flag.name;
            cardElement.dataset.originalIndex = index; // Adiciona um índice original para controle

            const cardInner = document.createElement('div');
            cardInner.classList.add('card-inner');

            const cardFront = document.createElement('div');
            cardFront.classList.add('card-front');
            const img = document.createElement('img');
            img.src = flag.img;
            img.alt = `Bandeira do ${flag.name}`;
            cardFront.appendChild(img);

            const cardBack = document.createElement('div');
            cardBack.classList.add('card-back');
            cardBack.textContent = '?';

            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            cardElement.appendChild(cardInner);

            cardElement.addEventListener('click', () => flipCard(cardElement));
            gameBoard.appendChild(cardElement);
        });

        displayWinners();
        if (!gameStarted) {
            gameBoard.style.pointerEvents = 'none';
            resetGameBtn.style.display = 'none';
        } else {
            gameBoard.style.pointerEvents = 'auto';
            resetGameBtn.style.display = 'block';
        }
    }

    // Função para pegar um número aleatório de bandeiras
    function getRandomFlags(count) {
        const shuffled = [...flagImages].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function flipCard(card) {
        if (!gameStarted || awaitingGuess) return; // Não permite virar cartas se aguardando palpite
        if (flippedCards.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
            card.classList.add('flipped');
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                // Desabilita o tabuleiro enquanto as cartas estão viradas
                gameBoard.style.pointerEvents = 'none';
                setTimeout(checkForMatch, 1000);
            }
        }
    }

    function checkForMatch() {
        const [cardOne, cardTwo] = flippedCards;
        const isMatch = cardOne.dataset.name === cardTwo.dataset.name;

        if (isMatch) {
            // Se as cartas forem um par, ativamos a seção de adivinhação
            awaitingGuess = true;
            guessSection.style.display = 'flex'; // Mostra a seção de adivinhação
            stateGuessInput.disabled = false;
            checkGuessBtn.disabled = false;
            stateGuessInput.focus(); // Coloca o foco no input
            // Armazena temporariamente o par que está sendo adivinhado
            flippedCards = [cardOne, cardTwo];
        } else {
            // Se não for um par, vira as cartas de volta e registra o erro
            misses++;
            missesSpan.textContent = misses;
            cardOne.classList.remove('flipped');
            cardTwo.classList.remove('flipped');
            flashBackground('wrong');
            // Reabilita o tabuleiro imediatamente para continuar o jogo
            gameBoard.style.pointerEvents = 'auto';
            flippedCards = []; // Limpa as cartas viradas
        }
    }

    function processGuess(isCorrectGuess) {
        const [cardOne, cardTwo] = flippedCards;
        awaitingGuess = false;
        resetGuessSection(); // Esconde e limpa a seção de adivinhação

        if (isCorrectGuess) {
            matchedPairs++;
            hits++;
            hitsSpan.textContent = hits;
            cardOne.classList.add('matched');
            cardTwo.classList.add('matched');
            cardOne.style.pointerEvents = 'none';
            cardTwo.style.pointerEvents = 'none';
            flashBackground('correct');
        } else {
            misses++;
            missesSpan.textContent = misses;
            cardOne.classList.remove('flipped');
            cardTwo.classList.remove('flipped');
            flashBackground('wrong');
        }

        flippedCards = []; // Limpa as cartas viradas para a próxima jogada
        gameBoard.style.pointerEvents = 'auto'; // Reabilita o tabuleiro

        if (matchedPairs === (cards.length / 2)) { // Verifica se todos os pares foram encontrados
            endGame();
        }
    }

    // Função para verificar o palpite do usuário
    function checkGuess() {
        const guessedName = stateGuessInput.value.trim().toLowerCase();
        // A carta virada (qualquer uma do par) contém o nome correto
        const correctName = flippedCards[0].dataset.name.toLowerCase();

        if (guessedName === correctName) {
            guessFeedback.textContent = 'Acertou! 🎉';
            guessFeedback.classList.add('correct');
            guessFeedback.classList.remove('wrong');
            processGuess(true);
        } else {
            guessFeedback.textContent = `Errou! O nome correto é: ${flippedCards[0].dataset.name}`;
            guessFeedback.classList.add('wrong');
            guessFeedback.classList.remove('correct');
            processGuess(false); // Passa false para registrar como erro
        }

        setTimeout(() => {
            guessFeedback.textContent = '';
            guessFeedback.classList.remove('correct', 'wrong');
        }, 2000); // Limpa a mensagem após 2 segundos
    }

    function resetGuessSection() {
        guessSection.style.display = 'none';
        stateGuessInput.value = '';
        stateGuessInput.disabled = true;
        checkGuessBtn.disabled = true;
        guessFeedback.textContent = '';
        guessFeedback.classList.remove('correct', 'wrong');
    }

    function flashBackground(type) {
        document.body.classList.remove('correct-flash', 'wrong-flash');
        if (type === 'correct') {
            document.body.classList.add('correct-flash');
        } else if (type === 'wrong') {
            document.body.classList.add('wrong-flash');
        }

        setTimeout(() => {
            document.body.classList.remove('correct-flash', 'wrong-flash');
        }, 300);
    }

    function endGame() {
        alert(`Parabéns, ${currentPlayer}! Você completou o jogo!\nAcertos: ${hits}\nErros: ${misses}`);
        saveWinner(currentPlayer, hits, misses);
        displayWinners();
        gameStarted = false;
        gameBoard.style.pointerEvents = 'none';
    }

    function saveWinner(name, hits, misses) {
        let winners = JSON.parse(localStorage.getItem('memoryGameWinners')) || [];
        winners.push({ name: name, hits: hits, misses: misses, date: new Date().toLocaleString() });
        if (winners.length > 10) {
            winners = winners.slice(winners.length - 10);
        }
        localStorage.setItem('memoryGameWinners', JSON.stringify(winners));
    }

    function displayWinners() {
        winnersList.innerHTML = '';
        let winners = JSON.parse(localStorage.getItem('memoryGameWinners')) || [];

        winners.sort((a, b) => {
            if (a.hits !== b.hits) {
                return b.hits - a.hits;
            }
            return a.misses - b.misses;
        });

        if (winners.length === 0) {
            winnersList.innerHTML = '<li>Nenhum vencedor ainda.</li>';
            return;
        }

        winners.forEach(winner => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<span>${winner.name}</span> - Acertos: ${winner.hits}, Erros: ${winner.misses} <small>(${winner.date})</small>`;
            winnersList.appendChild(listItem);
        });
    }

    // Event Listeners
    startGameBtn.addEventListener('click', () => {
        const name = playerNameInput.value.trim();
        if (name) {
            currentPlayer = name;
            gameStarted = true;
            initializeGame();
            playerNameInput.disabled = true;
            startGameBtn.style.display = 'none';
            resetGameBtn.style.display = 'block';
        } else {
            alert('Por favor, digite seu nome para começar!');
            playerNameInput.focus();
        }
    });

    resetGameBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja reiniciar o jogo? Seu progresso atual será perdido.')) {
            currentPlayer = playerNameInput.value.trim() || 'Jogador';
            gameStarted = true;
            initializeGame();
        }
    });

    // Event listeners para a nova funcionalidade de adivinhação
    checkGuessBtn.addEventListener('click', checkGuess);
    stateGuessInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            checkGuess();
        }
    });

    initializeGame();
});