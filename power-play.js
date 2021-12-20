// game: power play
// an algorithm that checks when a player has won the game
// we consider that a player wins when they have completed 4 cells.

// We consider a grid designed as follows:
// 0 is neutral
// 1 is gray
// 2 is white
// by default, everything is neutral
const grid = [
  [0, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
];

// always good to run tests:
// console.log(checkRow([1, 0, 1, 1, 1, 1]));

/**
 * Checks whether the selected row is completed.
 * To win, the player must have 4 pieces in a row.
 * @param {int[]} row The row to check
 * @returns {{winner?:string,won:boolean}}
 */
function checkRow(row) {
  // if the row cannot make the player win (because it's too short)
  // then it is pointless to run the algorithm.
  // This check is important for diagonals.
  if (row.length <= 3) {
    return { won: false };
  }

  const check = (type) => {
    let winner = false;
    for (let x = 0; x < row.length; x++) {
      // check if the current cell is colored as type
      if (row[x] === type) {
        // then the cell must be followed by 4 identic cells
        // however it is useless to test this if we don't even have the place
        if (x + 3 < row.length) {
          let check_4_pieces_in_a_row = true;
          for (let y = x; y <= x + 3; y++) {
            if (row[y] !== type) {
              check_4_pieces_in_a_row = false;
              break;
            }
          }
          winner = check_4_pieces_in_a_row;
          // if we detected a win, useless to continue the loop
          if (winner) break;
        }
      }
    }
    return winner;
  };

  if (check(1)) return { winner: "gray", won: true };
  if (check(2)) return { winner: "white", won: true };

  return { won: false };
}

/**
 * Called everytime a user plays
 * @returns {{winner?:string,won:boolean}}
 */
function checkWin() {
  const number_of_rows = grid.length; // 7
  const number_of_columns = grid[0].length; // 6

  // check rows
  for (let i = 0; i < number_of_rows; i++) {
    let row = grid[i];
    let row_winner = checkRow(row);
    if (row_winner.won) {
      return row_winner;
    }
  }

  // check columns
  for (let i = 0; i < number_of_columns; i++) {
    let row_from_column = grid.map((row) => row[i]);
    let column_winner = checkRow(row_from_column);
    if (column_winner.won) {
      return column_winner;
    }
  }

  // check diagonals
  // The principle behind this algorithm is to separate the work
  // in such a way that performance is better in most cases.

  // from middle to the top right corner
  // first divison (grid cut in half in the center, so we take here the part in the top left corner)
  // For this algorithm, we'll have `number_of_columns` diagonals (the length of a row), so we iterate this number of times
  for (let i = 0; i < number_of_columns; i++) {
    // each iteration will give a diagonal
    let diagonal = [];
    // y will always return to 0 once we finish reading a diagonal
    let y = 0;
    // x starts with 0, but then, at the following iteration,
    // x will start at 1 then at the next iteration,
    // x will start at 2 etc.
    // therefore x is 0 + i
    // limited to the length of a row
    for (let x = i; x < number_of_columns; x++) {
      // we want to take the element from top to bottom
      // so element [y][x], [y+1][x+1], [y+2][x+2] etc.
      diagonal.push(grid[y][x]);
      // now we can start to go down
      y++;
    }
    // We want to check if the selected diagonal is already completed.
    // This is great for performance because the program doesn't need to continue
    // if it has already met a completed line!
    // Besides, `checkRow` checks if the given row has more than 3 cells,
    // indeed it is useless to consum memory for a line that cannot make the player win.
    let diagonal_winner = checkRow(diagonal);
    if (diagonal_winner.won) {
      return diagonal_winner;
    }
  }

  // second division (from the middle to the bottom left)
  // For this algorithm, we'll have `number_of_colums` diagonals (the length of a row), so we iterate this number of times
  for (let i = 0; i < number_of_columns; i++) {
    // each iteration will give a diagonal
    let diagonal = [];
    // x will always return to 0 once we finish reading a diagonal
    let x = 0;
    // y starts at 1 because the diagonal at y=0 is already read by the first algorithm.
    // Plus, y will start at a different position at each iteration
    // therefore, y starts at 1 + number of iterations.
    // In addition, y can go to `number_of_rows` because the grid might have a greater number of rows than columns
    for (let y = 1 + i; y < number_of_rows; y++) {
      // we want to take the element from top to bottom (in the diagonal)
      // so element [y][x], [y+1][x+1], [y+2][x+2] etc.
      diagonal.push(grid[y][x]);
      // now we can start to go down
      x++;
    }
    let diagonal_winner = checkRow(diagonal);
    if (diagonal_winner.won) {
      return diagonal_winner;
    }
  }

  // Now we must start the reading backwards
  // Indeed, we handle the left side (from bottom left to top right)
  // but not the right side (from top left to bottom right)

  // We cut the grid in half, so we read from the middle to the top left corner
  // For this algorithm, we'll have `number_of_columns` diagonals (the length of a row), so we iterate this number of times
  for (let i = 0; i < number_of_columns; i++) {
    // each iteration will give a diagonal
    let diagonal = [];
    // y will always return to 0 once we finish reading a diagonal
    let y = 0;
    // x starts with `number_of_columns - 1` because we start at the end of the row (top right to top left, the first half)
    // x will start at `number_of_columns - 2` at the next diagonal
    // and so on...
    // so at each iteration (`i`), x decreases by `i`
    for (let x = number_of_columns - 1 - i; x >= 0; x--) {
      // we want to take the element from top to bottom (top of the diagonal to bottom of the diagonal)
      // so element [y][x], [y+1][x-1], [y+2][x-2] etc.
      diagonal.push(grid[y][x]);
      // now we can start to go down
      y++;
    }
    let diagonal_winner = checkRow(diagonal);
    if (diagonal_winner.won) {
      return diagonal_winner;
    }
  }

  // Finally, the last half, so we read from the middle to the bottom right corner
  // For this algorithm, we'll have `number_of_columns` diagonals (the length of a row), so we iterate this number of times
  for (let i = 0; i < number_of_columns; i++) {
    // each iteration will give a diagonal
    let diagonal = [];
    // x will always return to `number_of_columns - 1` once we finish reading a diagonal
    let x = number_of_columns - 1;
    // y starts at 1 because the diagonal at y=0 is already read by the algorithm above.
    // Plus, y will start at a different position at each iteration
    // therefore, y starts at 1 + number of iterations.
    // In addition, y can go to `number_of_rows` because the grid might have a greater number of rows than columns
    for (let y = 1 + i; y < number_of_rows; y++) {
      // we want to take the element from top to bottom (in the diagonal)
      // se element [y][x], [y+1][x-1], [y+2][x-2] etc.
      diagonal.push(grid[y][x]);
      // now we can start to go down
      x--;
    }
    let diagonal_winner = checkRow(diagonal);
    if (diagonal_winner.won) {
      return diagonal_winner;
    }
  }

  return {won: false};
}
