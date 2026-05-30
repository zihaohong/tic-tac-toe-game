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
    this.loadHelpText();
    this.loadGames();
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
      const cell = e.target.closest('.cell');
      if (cell) {
        this.handleCellClick(parseInt(cell.dataset.index));
      }
    });

    const gamesBtn = document.getElementById('gamesBtn');
    const gamesDropdown = document.getElementById('gamesDropdown');
    gamesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      gamesDropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      gamesDropdown.classList.remove('show');
    });

    gamesDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    const helpBtn = document.getElementById('helpBtn');
    const helpDropdown = document.getElementById('helpDropdown');
    helpBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      helpDropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      helpDropdown.classList.remove('show');
    });

    helpDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    document.getElementById('localeSelect').addEventListener('change', (e) => {
      this.loadHelpText(e.target.value);
    });
  },

  handleCellClick: function(index) {
    if (this.gameOver || this.board[index]) {
      if (this.gameOver) {
        this.init();
      }
      return;
    }
    this.board[index] = this.currentPlayer;
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    this.renderBoard();
    if (this.checkWin()) {
      this.gameOver = true;
      this.highlightWinner();
    } else if (this.board.every(cell => cell !== null)) {
      this.gameOver = true;
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

  loadHelpText: function(locale) {
    locale = locale || 'en';
    const helpTexts = {
      en: {
        title: 'How to Play',
        text: 'Click on a cell to place your mark (X or O). Take turns with the other player. Get three in a row (horizontal, vertical, or diagonal) to win!'
      },
      zh: {
        title: '如何玩',
        text: '点击格子放置你的标记（X 或 O）。与对手轮流下棋。在一条线上（水平、垂直或对角线）连成三个即可获胜！'
      }
    };
    const help = helpTexts[locale] || helpTexts.en;
    document.getElementById('helpTitle').textContent = help.title;
    document.getElementById('helpText').textContent = help.text;
  },

  loadGames: function() {
    fetch('https://zihaohong.github.io/data/links/games.json')
      .then(response => response.json())
      .then(data => {
        const locale = document.getElementById('localeSelect').value;
        const items = data[locale] || data.en || {};
        const currentPath = window.location.pathname;
        const dropdown = document.getElementById('gamesDropdown');
        dropdown.innerHTML = Object.entries(items).map(([title, params]) => {
          const isCurrent = currentPath.includes(params.url.replace('https://zihaohong.github.io/', ''));
          return `<a href="${params.url}" class="${isCurrent ? 'current' : ''}">${title}</a>`;
        }).join('');
      })
      .catch(error => console.error('Error loading games:', error));
  }
};

document.addEventListener('DOMContentLoaded', () => TicTacToe.init());
