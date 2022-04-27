import React, {useEffect} from "react";
import {useImmer} from "use-immer";
import {generateGrid, refreshGrid, symbolCount} from "./game";
import * as R from "ramda";
import randomColor from "randomcolor";

const symbolColors: string[] = R.times(() => randomColor({ luminosity: "bright" }), symbolCount);

function App() {
  const [grid, setGrid] = useImmer(generateGrid);

  useEffect(() => {
    const intervalId = setInterval(() => setGrid(draft => {
      refreshGrid(draft);
    }), 100);

    return () => clearInterval(intervalId);
  }, [setGrid]);

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
            }}
          />
        )))}
      </div>
    </div>
  );
}

export default App;
