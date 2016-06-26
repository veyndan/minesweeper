"use strict";

$(document).ready(function () {
    var game = {
        rows: 9,
        cols: 9,
        mines: 10,
        board: [],
        newGame: function () {
            for (let row = 0; row < this.rows; row++) {
                this.board[row] = [];
                this.board[row].length = this.rows;
                for (var col = 0; col < this.cols; col++) {
                    this.board[row][col] = {
                        value: 0,
                        revealed: false,
                        flagged: false
                    };
                }
            }

            $('#mine-count').text(this.mines);

            for (var i = 0; i < this.mines; i++) {
                do {
                    var mineRow = Math.floor(Math.random() * this.rows);
                    var mineCol = Math.floor(Math.random() * this.cols);
                } while (this.board[mineRow][mineCol].value === -1);
                this.board[mineRow][mineCol].value = -1;

                surrounding(this.rows, this.cols, mineRow, mineCol).map(elem => this.board[elem.row][elem.col]).filter(cell => cell.value >= 0).forEach(cell => cell.value++);
            }
        }
    };

    game.newGame();

    for (let row = 0; row < game.rows; row++) {
        const tr = $(document.createElement('tr')).appendTo($('#grid'));
        for (let col = 0; col < game.cols; col++) {
            const td = $(document.createElement('td')).prop('id', cellId(row, col, game.cols));
            td.click({ game, row, col }, reveal);
            td.contextmenu({ game, row, col }, toggleFlag);
            tr.append(td);
        }
    }
});

function reveal(event) {
    const { game, row, col } = event.data;
    const cell = game.board[row][col];

    if (!cell.revealed && !cell.flagged) {
        game.board[row][col].revealed = true;
        const value = game.board[row][col].value;
        const element = $(`#${ cellId(row, col, game.cols) }`);
        element.addClass('revealed');
        if (value === -1) {
            element.addClass('mine');
        }
        element.text(value > 0 ? value : '');
    }
}

function toggleFlag(event) {
    const { game, row, col } = event.data;
    game.board[row][col].flagged = !game.board[row][col].flagged;

    if (!game.board[row][col].revealed) {
        $(this).toggleClass('flag');
    }

    const mineCount = $('#mine-count');
    mineCount.text(mineCount.text() - 1);

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

//# sourceMappingURL=mines-compiled.js.map