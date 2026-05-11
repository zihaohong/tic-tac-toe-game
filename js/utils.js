// Tic Tac Toe Game Logic
const TicTacToe = {
  board: [],
  currentPlayer: 'X',
  gameOver: false,

  init: function() {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.gameOver = false;
    this.renderBoard();
    this.bindEvents();
    this.updateStatus();
  },

  renderBoard: function() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('button');
      cell.className = 'cell';
      cell.dataset.index = i;
      cell.textContent = this.board[i] || '';
      boardEl.appendChild(cell);
    }
  },

  bindEvents: function() {
    document.getElementById('board').addEventListener('click', (e) => {
      if (e.target.classList.contains('cell')) {
        this.handleCellClick(parseInt(e.target.dataset.index));
      }
    });
    document.getElementById('resetBtn').addEventListener('click', () => { this.init(); });
  },

  handleCellClick: function(index) {
    if (this.gameOver || this.board[index]) return;
    this.board[index] = this.currentPlayer;
    this.renderBoard();
    if (this.checkWin()) {
      this.gameOver = true;
      document.getElementById('status').textContent = `Player ${this.currentPlayer} wins!`;
      this.highlightWinner();
    } else if (this.board.every(cell => cell !== null)) {
      this.gameOver = true;
      document.getElementById('status').textContent = "It's a draw!";
    } else {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
      this.updateStatus();
    }
  },

  checkWin: function() {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (const line of lines) {
      const [a,b,c] = line;
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        this.winningLine = line;
        return true;
      }
    }
    return false;
  },

  highlightWinner: function() {
    if (this.winningLine) {
      const cells = document.querySelectorAll('.cell');
      this.winningLine.forEach(index => { cells[index].classList.add('winner'); });
    }
  },

  updateStatus: function() {
    document.getElementById('status').textContent = `Player ${this.currentPlayer}'s turn`;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Navbar.init();
  TicTacToe.init();
});
