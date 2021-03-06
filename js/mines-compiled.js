"use strict";

var GameOverEnum = Object.freeze({ won: 1, lost: 2 });

$(document).ready(function () {
    const game = {
        isFirstReveal: true,
        revealedCount: 0,
        rows: 9,
        cols: 9,
        mines: 10,
        board: [],
        seconds: 0,
        gameOver: function (gameOverEnum) {
            const overlay = $('#overlay');
            overlay.removeClass('won lost');
            if (gameOverEnum === GameOverEnum.won) {
                overlay.addClass('won');
            } else if (gameOverEnum === GameOverEnum.lost) {
                overlay.addClass('lost');
            }

            overlay.show();

            $('#play-again').click(() => {
                this.newGame();
                overlay.hide();
            });
        },
        newGame: function () {
            for (let row = 0; row < this.rows; row++) {
                this.board[row] = [];
                this.board[row].length = this.rows;
                for (let col = 0; col < this.cols; col++) {
                    this.board[row][col] = {
                        value: 0,
                        revealed: false,
                        flagged: false
                    };
                }
            }

            $('#mine-count').text(this.mines);
            this.isFirstReveal = true;
            this.revealedCount = 0;

            $('#grid').empty();
            this.drawBoard();
            this.resetTimer();
        },
        initialize: function (row, col) {
            for (let i = 0; i < this.mines; i++) {
                do {
                    var mineRow = Math.floor(Math.random() * this.rows);
                    var mineCol = Math.floor(Math.random() * this.cols);
                } while (this.board[mineRow][mineCol].value === -1 || mineRow === row && mineCol === col);
                this.board[mineRow][mineCol].value = -1;

                surrounding(this.rows, this.cols, mineRow, mineCol).map(elem => this.board[elem.row][elem.col]).filter(cell => cell.value >= 0).forEach(cell => cell.value++);
            }
        },
        drawBoard: function () {
            for (let row = 0; row < game.rows; row++) {
                const tr = $(document.createElement('tr')).appendTo($('#grid'));
                for (let col = 0; col < game.cols; col++) {
                    const td = $(document.createElement('td')).prop('id', cellId(row, col, game.cols));
                    td.click({ game, row, col }, reveal);
                    td.contextmenu({ game, row, col }, toggleFlag);
                    tr.append(td);
                }
            }
        },
        setupTimer: function () {
            startInterval(1, () => $("#timer").html(("00" + this.seconds++).slice(-3)));
        },
        resetTimer: function () {
            this.seconds = 0;
        }
    };

    game.newGame();
    game.setupTimer();

    $('#overlay').hide();
});

function reveal(event) {
    const { game, row, col } = event.data;
    const cell = game.board[row][col];

    if (game.isFirstReveal) {
        game.initialize(row, col);
        game.isFirstReveal = false;
    }

    if (!cell.revealed && !cell.flagged) {
        game.board[row][col].revealed = true;
        game.revealedCount++;

        if (cell.value === -1) {
            game.gameOver(GameOverEnum.lost);
        }

        if (cell.value === 0) {
            surrounding(game.rows, game.cols, row, col).forEach(elem => reveal({ data: { game, row: elem.row, col: elem.col } }));
        }

        const value = game.board[row][col].value;
        const element = $(`#${ cellId(row, col, game.cols) }`);
        element.addClass('revealed');
        if (value === -1) {
            element.addClass('mine');
        }
        element.text(value > 0 ? value : '');

        if (game.revealedCount === game.rows * game.cols - game.mines) {
            game.gameOver(GameOverEnum.won);
        }
    }
}

function toggleFlag(event) {
    const { game, row, col } = event.data;
    game.board[row][col].flagged = !game.board[row][col].flagged;

    if (!game.board[row][col].revealed) {
        $(this).toggleClass('flag');
    }

    const mineCount = $('#mine-count');
    if (game.board[row][col].flagged) {
        mineCount.text(Number(mineCount.text()) - 1);
    } else {
        mineCount.text(Number(mineCount.text()) + 1);
    }

    return false;
}

function surrounding(rows, cols, row, col) {
    const result = [];
    for (let rowSurrounding = Math.max(0, row - 1); rowSurrounding <= Math.min(rows - 1, row + 1); rowSurrounding++) {
        for (let colSurrounding = Math.max(0, col - 1); colSurrounding <= Math.min(cols - 1, col + 1); colSurrounding++) {
            if (!(rowSurrounding === row && colSurrounding === col)) {
                result.push({ row: rowSurrounding, col: colSurrounding });
            }
        }
    }
    return result;
}

function cellId(row, col, cols) {
    return row * cols + col;
}

function startInterval(seconds, callback) {
    callback();
    setInterval(callback, seconds * 1000);
}

//# sourceMappingURL=mines-compiled.js.map