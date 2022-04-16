import React, {useEffect} from "react";
import {Layer, Rect, Stage} from "react-konva";
import {useImmer} from "use-immer";
import {generateGrid, refreshGrid, symbolCount} from "./game";
import * as R from "ramda";
import Konva from "konva";

const symbolColors: string[] = R.times(Konva.Util.getRandomColor, symbolCount);

function App() {
  const [grid, setGrid] = useImmer(generateGrid);

  useEffect(() => {
    const intervalId = setInterval(() => setGrid(draft => {
      refreshGrid(draft);
    }), 100);

    return () => clearInterval(intervalId);
  }, [setGrid]);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {grid.map((row, rowIndex) => row.map((symbol, cellIndex) => symbol !== null && (
          <Rect
            key={`${rowIndex},${cellIndex}`}
            x={cellIndex * 70}
            y={rowIndex * 70}
            width={50}
            height={50}
            fill={symbolColors[symbol]}
          />
        )))}
      </Layer>
    </Stage>
  );
}

export default App;
