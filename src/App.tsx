import React, {useEffect} from "react";
import {useImmerReducer} from "use-immer";
import {
  areAdjacent,
  findMatch,
  generateGrid,
  Grid,
  Point,
  refreshGrid,
  swap,
  symbolCount
} from "./game";
import * as R from "ramda";
import randomColor from "randomcolor";
import {css, cx} from "@emotion/css";

const symbolColors: string[] = R.times(() => randomColor({ luminosity: "bright" }), symbolCount);

interface AppState {
  grid: Grid;
  selected: Point | null;
}

type AppAction =
  | { type: "refreshGrid" }
  | { type: "select", point: Point }
  | { type: "deselect" };

const initialState: AppState = {
  grid: generateGrid(),
  selected: null,
};

function reducer(draft: AppState, action: AppAction): void {
  switch (action.type) {
    case "refreshGrid":
      refreshGrid(draft.grid);
      return;
    case "select":
      // If a cell was selected previously and the clicked cell is adjacent to the previously
      // selected cell, then swap the two cells
      // If no cell was selected, or if the clicked cell is not adjacent to the previously selected
      // cell, then simply update the selected cell
      if (draft.selected !== null) {
        if (areAdjacent(action.point, draft.selected)) {
          const updatedGrid = swap(action.point, draft.selected, draft.grid);
          if (findMatch(updatedGrid) !== null) {
            draft.grid = updatedGrid;
          }
        }
        draft.selected = null;
      } else {
        draft.selected = action.point;
      }
      return;
    case "deselect":
      draft.selected = null;
      return;
  }
}

const containerStyles = css({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: 10,
  height: "100vh",
  backgroundColor: "darkslategrey",
});

const gridStyles = css({
  display: "grid",
  gridGap: "10px",
});

const baseCellStyles = css({
  borderRadius: "10px",
  position: "relative",
  width: "50px",
  height: "50px",
  cursor: "pointer",
});

const selectableCellStyles = css({
  outline: "2px solid white",
});

const nonSelectableCellStyles = css({
  opacity: "20%",
  cursor: "default",
});

function App() {
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  // TODO: Refresh grid "on-demand" instead of on an interval
  useEffect(() => {
    const intervalId = setInterval(() => dispatch({ type: "refreshGrid" }), 100);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <div className={containerStyles}>
      <div
        className={gridStyles}
        onBlur={() => dispatch( { type: "deselect" })}
        tabIndex={0}
      >
        {state.grid.map((row, rowIndex) => row.map((symbol, cellIndex) => {
          const isSelectable = state.selected !== null && areAdjacent(state.selected, [rowIndex, cellIndex]) && findMatch(swap(state.selected, [rowIndex, cellIndex], state.grid)) !== null;
          const isSelected = state.selected !== null && R.equals(state.selected, [rowIndex, cellIndex]);

          return symbol !== null && (
            <div
              key={`${rowIndex},${cellIndex}`}
              className={cx(baseCellStyles, {
                [nonSelectableCellStyles]: state.selected !== null && (!isSelectable && !isSelected),
                [selectableCellStyles]: isSelectable,
              })}
              style={{
                backgroundColor: symbolColors[symbol],
                // left: "10px", // For animation
                // top: "10px", // For animation
                gridRow: rowIndex + 1,
                gridColumn: cellIndex + 1,
              }}
              onClick={() => dispatch({ type: "select", point: [rowIndex, cellIndex] })}
            />
          );
        }))}
      </div>
    </div>
  );
}

export default App;
