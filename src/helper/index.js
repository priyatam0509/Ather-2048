// Rotate left matrix method
let rotateLeft = function (matrix) {
    let rows = matrix.length;
    let columns = matrix[0].length;
    let res = [];
    for (let row = 0; row < rows; ++row) {
        res.push([]);
        for (let column = 0; column < columns; ++column) {
            res[row][column] = matrix[column][columns - row - 1];
        }
    }
    return res;
};
// tiles class is constructed which is an array of object
class Tile {
    constructor(value, row, column) {
        this.value = value || 0;
        this.row = row || -1;
        this.column = column || -1;
        this.oldRow = -1;
        this.oldColumn = -1;
        this.markForDeletion = false;
        this.mergedInto = null;
        this.id = this.id++ || 0;
    }
// History of each grid
    moveTo(row, column) {
        this.oldRow = this.row;
        this.oldColumn = this.column;
        this.row = row;
        this.column = column;
    }
    // checking whether 2 4 is already persent or from random
    isNew() {
        return this.oldRow === -1 && !this.mergedInto;
    }
//    checking whether the grid has moved or not
    hasMoved() {
        return (
            (this.fromRow() !== -1 &&
                (this.fromRow() !== this.toRow() ||
                    this.fromColumn() !== this.toColumn())) ||
            this.mergedInto
        );
    }
    // History of row means from which row you come similaliy for all other
    fromRow() {
        return this.mergedInto ? this.row : this.oldRow;
    }

    fromColumn() {
        return this.mergedInto ? this.column : this.oldColumn;
    }

    toRow() {
        return this.mergedInto ? this.mergedInto.row : this.row;
    }

    toColumn() {
        return this.mergedInto ? this.mergedInto.column : this.column;
    }
}
// Board onstructor ceil is array of object
class Board {
    constructor() {
        this.tiles = [];
        this.cells = [];
        this.score = 0;
        this.size = 4;
        this.preScore = 0
        this.fourProbability = 0.1;
        this.deltaX = [-1, 0, 1, 0];
        this.deltaY = [0, -1, 0, 1];
        for (let i = 0; i < this.size; ++i) {
            this.cells[i] = [
                this.addTile(),
                this.addTile(),
                this.addTile(),
                this.addTile(),
            ];
        }
        this.addRandomTile();
        this.addRandomTile();
        this.setPositions();
        this.won = false;
    }
//    pushed res object into each tiles
    addTile(args) {
        let res = new Tile(args);
        this.tiles.push(res);
        return res;
    }
    // algorithm of swipe left1

    moveLeft() {
        let hasChanged = false;
        for (let row = 0; row < this.size; ++row) {
            let currentRow = this.cells[row].filter((tile) => tile.value !== 0);
            let resultRow = [];
            for (let target = 0; target < this.size; ++target) {
                let targetTile = currentRow.length
                    ? currentRow.shift()
                    : this.addTile();
                if (currentRow.length > 0 && currentRow[0].value === targetTile.value) {
                    let tile1 = targetTile;
                    targetTile = this.addTile(targetTile.value);
                    tile1.mergedInto = targetTile;
                    let tile2 = currentRow.shift();
                    tile2.mergedInto = targetTile;
                    targetTile.value += tile2.value;
                    this.preScore = this.score
                    this.score += tile1.value + tile2.value;
                }
                resultRow[target] = targetTile;
                this.won |= targetTile.value === 2048;
                hasChanged |= targetTile.value !== this.cells[row][target].value;
            }
            this.cells[row] = resultRow;
        }
        return hasChanged;
    }
    // At every grid there is an object for detecting changes it consists of five instances like oldRow oldColumn current row
    // curr column and one bool markfordeletion

    setPositions() {
        this.cells.forEach((row, rowIndex) => {
            row.forEach((tile, columnIndex) => {
                tile.oldRow = tile.row;
                tile.oldColumn = tile.column;
                tile.row = rowIndex;
                tile.column = columnIndex;
                tile.markForDeletion = false;
            });
        });
    }

//    first storing zero value grid then generating random index which is less then empty cells length and then just putting the value
// of 2 and 4 with probability of 0.1
    addRandomTile() {
        let emptyCells = [];
        for (let r = 0; r < this.size; ++r) {
            for (let c = 0; c < this.size; ++c) {
                if (this.cells[r][c].value === 0) {
                    emptyCells.push({ r: r, c: c });
                }
            }
        }
        let index = ~~(Math.random() * emptyCells.length);
        let cell = emptyCells[index];
        let newValue = Math.random() < this.fourProbability ? 4 : 2;
        this.cells[cell.r][cell.c] = this.addTile(newValue);
    }

    // rotate grid according to choice if it is right than rotate left twice similariy for other

    move(direction) {
        // 0 -> left, 1 -> up, 2 -> right, 3 -> down
        this.clearOldTiles();
        for (let i = 0; i < direction; ++i) {
            this.cells = rotateLeft(this.cells);
        }
        
        // if any two grid merged
        let hasChanged = this.moveLeft();
        // rerorate  back to original grid
        for (let i = direction; i < 4; ++i) {
            this.cells = rotateLeft(this.cells);
        }
        // if changed then we will add random tiles at those empty placed
        if (hasChanged) {
            this.addRandomTile();
        }
        // 
        this.setPositions();
        return this;
    }
    // condition for removing merged tiles
    clearOldTiles() {
        this.tiles = this.tiles.filter((tile) => tile.markForDeletion === false);
        this.tiles.forEach((tile) => {
            tile.markForDeletion = true;
        });
    }
//    check wether 2048 is achieved or not
    hasWon() {
        return this.won;
    }

// 

    hasLost() {
        let canMove = false;
        for (let row = 0; row < this.size; ++row) {
            for (let column = 0; column < this.size; ++column) {
                // if we found 0 then can move value would be 1
                canMove |= this.cells[row][column].value === 0;
                // checking wether the neioghour grid have same value or not.
                for (let dir = 0; dir < 4; ++dir) {
                    let newRow = row + this.deltaX[dir];
                    let newColumn = column + this.deltaY[dir];
                    if (
                        newRow < 0 ||
                        newRow >= this.size ||
                        newColumn < 0 ||
                        newColumn >= this.size
                    ) {
                        continue;
                    }
                    canMove |=
                        this.cells[row][column].value ===
                        this.cells[newRow][newColumn].value;
                }
            }
        }
        return !canMove;
    }
}

export { Board };