<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>sim eu tipidi para jogar vc joga</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <h1>joguinho so para distrair, bora?</h1>

        <div class="player-info">
            <label for="playerName">seu nome:</label>
            <input type="text" id="playerName" placeholder="Digite seu nome" maxlength="15">
            <button id="startGameBtn">iniciar</button>
        </div>

        <div class="score-board">
            <p>Acertos: <span id="hits">0</span></p>
            <p>Erros: <span id="misses">0</span></p>
        </div>

        <div class="game-board" id="gameBoard">
            </div>

        <div class="guess-section" style="display: none;">
            <input type="text" id="stateGuessInput" placeholder="Nome do estado" disabled>
            <button id="checkGuessBtn" disabled>Verificar</button>
            <p id="guessFeedback" class="feedback-message"></p>
        </div>

        <div class="winner-board">
            <h2>Vencedores:</h2>
            <ul id="winnersList">
                </ul>
        </div>

        <button id="resetGameBtn">Reiniciar Jogo</button>
    </div>

    <script src="script.js"></script>
</body>
</html>
