import * as R from "ramda";
import {generateGrid, refreshGrid} from "./game";

test("generates grid correctly", () => {
  jest.spyOn(global.Math, "random")
    .mockReturnValueOnce(0.9)
    .mockReturnValueOnce(0.6)
    .mockReturnValue(0.1);

  const grid = generateGrid();
  expect(grid).toEqual([
    [4, 3, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  jest.spyOn(global.Math, "random").mockRestore();
});

test("refreshes grid containing empty cells correctly", () => {
  const grid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, null, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, null, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, null, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, null, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, null, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, null, 0, 0, 0, 0, 0],
  ];

  jest.spyOn(global.Math, "random").mockReturnValue(0.9);

  refreshGrid(grid);
  expect(grid).toEqual([
    [0, 0, 4, 0, 4, 0, 0, 0, 4, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, null, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, null, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, null, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  jest.spyOn(global.Math, "random").mockRestore();
});

test("refreshes grid containing no empty cells correctly", () => {
  const matchFreeGrid = [
    [0, 1, 2, 3, 4, 0, 1, 2, 3, 4],
    [1, 2, 3, 4, 0, 1, 2, 3, 4, 0],
    [2, 3, 4, 0, 1, 2, 3, 4, 0, 1],
    [3, 4, 0, 1, 2, 3, 4, 0, 1, 2],
    [4, 0, 1, 2, 3, 4, 0, 1, 2, 3],
    [0, 1, 2, 3, 4, 0, 1, 2, 3, 4],
    [1, 2, 3, 4, 0, 1, 2, 3, 4, 0],
    [2, 3, 4, 0, 1, 2, 3, 4, 0, 1],
    [3, 4, 0, 1, 2, 3, 4, 0, 1, 2],
    [4, 0, 1, 2, 3, 4, 0, 1, 2, 3],
  ];
  const grid: (number | null)[][] = R.clone(matchFreeGrid);
  grid[2][2] = 1;
  grid[3][2] = 1;
  grid[4][2] = 1;
  grid[5][2] = 1;
  grid[6][2] = 1;
  grid[5][7] = 2;
  grid[6][7] = 2;
  grid[7][7] = 2;
  grid[8][7] = 2;
  grid[7][6] = 2;
  grid[7][8] = 2;
  refreshGrid(grid);
  const updatedGrid = R.clone(grid);
  updatedGrid[7][6] = null;
  updatedGrid[7][7] = null;
  updatedGrid[7][8] = null;
  expect(grid).toEqual(updatedGrid);
});
