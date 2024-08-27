class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return false;
    }
    const validChars = /^[1-9.]+$/;
    return validChars.test(puzzleString);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowStart = row * 9;
    const rowEnd = rowStart + 9;
    for (let i = rowStart; i < rowEnd; i++) {
      if (puzzleString[i] === value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (puzzleString[i * 9 + column] === value) {
        return false;
      }
    }
    return true;
  }  

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionRow = Math.floor(row / 3) * 3;
    const regionCol = Math.floor(column / 3) * 3;
    for (let i = regionRow; i < regionRow + 3; i++) {
      for (let j = regionCol; j < regionCol + 3; j++) {
        if (puzzleString[i * 9 + j] === value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    if (!this.validate(puzzleString)) {
      return false;
    }

    const solveRecursive = (puzzle) => {
      const emptyCell = puzzle.indexOf('.');
      if (emptyCell === -1) {
        return puzzle; // Solved
      }

      const row = Math.floor(emptyCell / 9);
      const col = emptyCell % 9;

      for (let num = 1; num <= 9; num++) {
        const value = num.toString();
        if (
          this.checkRowPlacement(puzzle, row, col, value) &&
          this.checkColPlacement(puzzle, row, col, value) &&
          this.checkRegionPlacement(puzzle, row, col, value)
        ) {
          const newPuzzle = puzzle.substr(0, emptyCell) + value + puzzle.substr(emptyCell + 1);
          const result = solveRecursive(newPuzzle);
          if (result) {
            return result;
          }
        }
      }
      return false; // No solution found
    };

    return solveRecursive(puzzleString);
  }
}

module.exports = SudokuSolver;
