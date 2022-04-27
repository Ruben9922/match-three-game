import React, {useEffect, useState} from "react";
import {useImmer} from "use-immer";
import {generateGrid, Point, refreshGrid, symbolCount} from "./game";
import * as R from "ramda";
import randomColor from "randomcolor";

const symbolColors: string[] = R.times(() => randomColor({ luminosity: "bright" }), symbolCount);

function App() {
  const [grid, setGrid] = useImmer(generateGrid);
  const [selected, setSelected] = useState<Point | null>(null);

  // TODO: Refresh grid "on-demand" instead of on an interval
  useEffect(() => {
    const intervalId = setInterval(() => setGrid(draft => {
      refreshGrid(draft);
    }), 100);

    return () => clearInterval(intervalId);
  }, [setGrid]);

  const areAdjacent = (point1: Point, point2: Point) => {
    return (point1[0] === point2[0] && (point1[1] === point2[1] - 1 || point1[1] === point2[1] + 1))
      || (point1[1] === point2[1] && (point1[0] === point2[0] - 1 || point1[0] === point2[0] + 1));
  };

  const handleClick = (point: Point) => {
    // TODO: Only swap if it would form a match
    setSelected(prevSelected => {
      // If a cell was selected previously and the clicked cell is adjacent to the previously
      // selected cell, then swap the two cells
      // If no cell was selected, or if the clicked cell is not adjacent to the previously selected
      // cell, then simply update the selected cell
      if (prevSelected !== null && areAdjacent(point, prevSelected)) {
        setGrid(draft => {
          const temp = draft[point[0]][point[1]];
          draft[point[0]][point[1]] = draft[prevSelected[0]][prevSelected[1]];
          draft[prevSelected[0]][prevSelected[1]] = temp;
        });
        return null;
      } else {
        return point;
      }
    })
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      height: "100vh",
      backgroundColor: "darkslategrey",
    }}>
      <div style={{
        display: "grid",
        gridGap: "10px",
      }}>
        {grid.map((row, rowIndex) => row.map((symbol, cellIndex) => symbol !== null && (
          <div
            key={`${rowIndex},${cellIndex}`}
            style={{
              backgroundColor: symbolColors[symbol],
              borderRadius: "10px",
              position: "relative",
              width: "50px",
              height: "50px",
              // left: "10px",
              gridRow: rowIndex + 1,
              gridColumn: cellIndex + 1,
              cursor: "pointer",
              outline: selected !== null && areAdjacent(selected, [rowIndex, cellIndex])
                ? "2px solid yellow"
                : "none",
            }}
            onClick={() => handleClick([rowIndex, cellIndex])}
          />
        )))}
      </div>
    </div>
  );
}

export default App;
