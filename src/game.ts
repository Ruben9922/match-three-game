import * as R from "ramda";

export type Point = [number, number];
type Grid = (number | null)[][];

export const symbolCount: number = 5;
const gridSize: Point = [10, 10];

export function generateGrid(): Grid {
  return R.range(0, gridSize[0]).map(() => R.range(0, gridSize[1]).map(getRandomSymbol));
}

export function refreshGrid(grid: Grid): void {
  if (gridContainsEmptyCells(grid)) {
    shift(grid);
  } else {
    let match: Point[] | null = findMatch(grid);

    if (match !== null) {
      clearCells(grid, match);
    }
  }
}

// function findMatch(grid: Grid): Match | null {
//   const directions: Point[] = [
//     [0, 1],
//     [1, 0],
//   ];
//   return R.find(x => x !== null, R.map(direction => findMatchesInDirection(grid, direction), directions)) ?? null;
// }
//
// function findMatchesInDirection(grid: Grid, direction: Point): Match | null {
//   const matchLength = 3;
//   const maxRowIndex = grid.length - (matchLength * direction[0]);
//
//   for (let rowIndex = maxRowIndex; rowIndex >= 0; rowIndex--) {
//     const row = grid[rowIndex];
//     const maxColumnIndex = row.length - 1 + (matchLength * direction[1]);
//     for (let columnIndex = maxColumnIndex; columnIndex >= 0; columnIndex--) {
//       const line = R.map(x => grid[rowIndex + (x * direction[0])][columnIndex + (x * direction[1])], R.range(0, matchLength));
//       const isMatch = R.all(x => x === R.head(line), line);
//       if (isMatch) {
//         return {
//           position: [rowIndex, columnIndex],
//           direction,
//         };
//       }
//     }
//   }
//
//   return null;
// }

export function findMatch(grid: Grid): Point[] | null {
  const matchLength = 3;
  const directions: Point[] = [
    [0, 1],
    [1, 0],
  ];

  for (const direction of directions) {
    const minRowIndex = Math.max(0, (matchLength * direction[0]) - 1);

    for (let rowIndex = grid.length - 1; rowIndex >= minRowIndex; rowIndex--) {
      const row = grid[rowIndex];
      const minColumnIndex = Math.max(0, (matchLength * direction[1]) - 1);

      for (let columnIndex = row.length - 1; columnIndex >= minColumnIndex; columnIndex--) {
        let currentPoint: Point = [rowIndex, columnIndex];
        let line: Point[] = [];

        while (isPointInsideGrid(currentPoint) && grid[rowIndex][columnIndex] === grid[currentPoint[0]][currentPoint[1]]) {
          line = R.append(currentPoint, line);
          currentPoint = [currentPoint[0] - direction[0], currentPoint[1] - direction[1]];
        }

        if (line.length >= matchLength) {
          return line;
        }
      }
    }
  }

  return null;
}

function isPointInsideGrid(point: Point): boolean {
  return point[0] >= 0 && point[0] < gridSize[0] && point[1] >= 0 && point[1] < gridSize[1];
}

function clearCells(grid: Grid, points: Point[]): void {
  for (const point of points) {
    grid[point[0]][point[1]] = null;
  }
}

function shift(grid: Grid): void {
  for (let columnIndex = 0; columnIndex < gridSize[1]; columnIndex++) {
    // Row index of the lowest empty cell in the column
    const lowestEmptyRowIndex = R.findLast(rowIndex => grid[rowIndex][columnIndex] === null, R.range(0, gridSize[0]));

    // If the column has an empty cell
    if (lowestEmptyRowIndex !== undefined) {
      // Shift every cell, that is above the empty point, down by 1
      for (let rowIndex = lowestEmptyRowIndex; rowIndex >= 1; rowIndex--) {
        grid[rowIndex][columnIndex] = grid[rowIndex - 1][columnIndex];
      }

      // There should now be an empty cell at the top of the column
      // Fill this with a random symbol
      grid[0][columnIndex] = getRandomSymbol();
    }
  }
}

function getRandomSymbol(): number {
  return Math.floor(Math.random() * symbolCount);
}

function gridContainsEmptyCells(grid: Grid): boolean {
  return R.any(row => R.any(symbol => symbol === null, row), grid);
}
