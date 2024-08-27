'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      if (!solver.validate(puzzle)) {
        return res.json({ error: puzzle.length !== 81 ? 'Expected puzzle to be 81 characters long' : 'Invalid characters in puzzle' });
      }

      const coordRegex = /^[A-I][1-9]$/;
      if (!coordRegex.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      const row = coordinate.charCodeAt(0) - 65;
      const col = parseInt(coordinate[1]) - 1;

      if (puzzle[row * 9 + col] === value) {
        return res.json({ valid: true });
      }

      const rowCheck = solver.checkRowPlacement(puzzle, row, col, value);
      const colCheck = solver.checkColPlacement(puzzle, row, col, value);
      const regionCheck = solver.checkRegionPlacement(puzzle, row, col, value);

      const conflicts = [];
      if (!rowCheck) conflicts.push('row');
      if (!colCheck) conflicts.push('column');
      if (!regionCheck) conflicts.push('region');

      if (conflicts.length === 0) {
        res.json({ valid: true });
      } else {
        res.json({ valid: false, conflict: conflicts });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      if (!solver.validate(puzzle)) {
        return res.json({ error: puzzle.length !== 81 ? 'Expected puzzle to be 81 characters long' : 'Invalid characters in puzzle' });
      }

      const solution = solver.solve(puzzle);
      if (!solution) {
        res.json({ error: 'Puzzle cannot be solved' });
      } else {
        res.json({ solution });
      }
    });
};
