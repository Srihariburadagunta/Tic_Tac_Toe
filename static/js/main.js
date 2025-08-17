document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('[data-cell]');
    const statusText = document.getElementById('status');
    const nextRoundBtn = document.getElementById('nextRoundBtn');
    const restartCompetitionBtn = document.getElementById('restartCompetitionBtn');
    const scoreXEl = document.getElementById('scoreX');
    const scoreOEl = document.getElementById('scoreO');
    const roundNumberEl = document.getElementById('roundNumber');
    const totalRoundsDisplay = document.getElementById('totalRoundsDisplay');
    const labelX = document.getElementById('labelX');
    const labelO = document.getElementById('labelO');

    // Modal
    const nameInputModal = document.getElementById('nameInputModal');
    const playerXInput = document.getElementById('playerXInput');
    const playerOInput = document.getElementById('playerOInput');
    const roundsInput = document.getElementById('roundsInput');
    const startGameBtn = document.getElementById('startGameBtn');
    const gameContainer = document.getElementById('gameContainer');

    // State
    let playerXName = "Player X";
    let playerOName = "Player O";
    let turn = 'X';
    let board = Array(9).fill('');
    let scoreX = 0;
    let scoreO = 0;
    let round = 1;
    let totalRounds = 5;
    let gameOver = false;

    const winningCombos = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    function checkWin(player) {
        return winningCombos.some(combo => combo.every(idx => board[idx] === player));
    }
    function checkDraw() {
        return board.every(cell => cell !== '');
    }
    function updateStatus(message) {
        statusText.textContent = message;
    }
    function animateScore(element) {
        element.classList.add('score-animate');
        setTimeout(() => element.classList.remove('score-animate'), 500);
    }
    function celebrateWinner(name) {
        statusText.innerHTML = `🏆 ${name} is the Champion! 🏆`;
        statusText.classList.add('winner-celebration');
    }

    function handleClick(e) {
        if (gameOver) return;
        const idx = Array.from(cells).indexOf(e.target);
        if (board[idx] !== '') return;

        board[idx] = turn;
        e.target.textContent = turn;
        e.target.style.color = turn === 'X' ? '#ff4d6d' : '#ffaf00';

        if (checkWin(turn)) {
            const winnerName = turn === 'X' ? playerXName : playerOName;
            updateStatus(`🎉 ${winnerName} wins this round!`);
            if (turn === 'X') { scoreX++; scoreXEl.textContent = scoreX; animateScore(scoreXEl); }
            else { scoreO++; scoreOEl.textContent = scoreO; animateScore(scoreOEl); }
            endRound();
            return;
        }
        else if (checkDraw()) {
            updateStatus("🤝 It's a draw!");
            endRound();
            return;
        }

        turn = turn === 'X' ? 'O' : 'X';
        updateStatus(`${turn === 'X' ? playerXName : playerOName}'s turn`);
    }

    function endRound() {
        gameOver = true;
        nextRoundBtn.style.display = round < totalRounds ? "inline-block" : "none";

        winningCombos.forEach(combo => {
            if (combo.every(idx => board[idx] === turn)) {
                combo.forEach(idx => cells[idx].classList.add('rainbow-win'));
            }
        });

        if (round === totalRounds) {
            if (scoreX > scoreO) celebrateWinner(playerXName);
            else if (scoreO > scoreX) celebrateWinner(playerOName);
            else updateStatus(`🤝 The competition ends in a draw!`);
        }
    }

    function startNextRound() {
        round++;
        roundNumberEl.textContent = round;
        board.fill('');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('rainbow-win');
            cell.style.color = '';
        });
        turn = 'X';
        gameOver = false;
        updateStatus(`${playerXName}'s turn`);
        nextRoundBtn.style.display = "none";
        statusText.classList.remove('winner-celebration');
    }

    function restartCompetition() {
        scoreX = 0; scoreO = 0; round = 1;
        scoreXEl.textContent = scoreX; scoreOEl.textContent = scoreO;
        roundNumberEl.textContent = round;
        startNextRound();
    }

    startGameBtn.addEventListener('click', () => {
        const nameX = playerXInput.value.trim();
        const nameO = playerOInput.value.trim();
        const roundsVal = parseInt(roundsInput.value.trim(), 10);

        playerXName = nameX || "Player X";
        playerOName = nameO || "Player O";
        if (!isNaN(roundsVal) && roundsVal > 0 && roundsVal <= 20) totalRounds = roundsVal;
        else totalRounds = 5;

        labelX.textContent = playerXName;
        labelO.textContent = playerOName;
        totalRoundsDisplay.textContent = totalRounds;
        roundNumberEl.textContent = 1;

        nameInputModal.style.display = 'none';
        gameContainer.style.display = 'block';
        updateStatus(`${playerXName}'s turn`);
    });

    cells.forEach(cell => cell.addEventListener('click', handleClick));
    nextRoundBtn.addEventListener('click', startNextRound);
    restartCompetitionBtn.addEventListener('click', () => {
        nameInputModal.style.display = 'flex';
        gameContainer.style.display = 'none';
        playerXInput.value = '';
        playerOInput.value = '';
        roundsInput.value = '';
        statusText.classList.remove('winner-celebration');
        restartCompetition();
    });

    nameInputModal.style.display = 'flex';
    gameContainer.style.display = 'none';
});
