import React, {useEffect} from "react";
import {useImmer} from "use-immer";
import {generateGrid, refreshGrid, symbolCount} from "./game";
import * as R from "ramda";
import { motion } from "framer-motion";
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
    <motion.svg width="1000" height="1000">
      {grid.map((row, rowIndex) => row.map((symbol, cellIndex) => symbol !== null && (
        <motion.circle
          key={`${rowIndex},${cellIndex}`}
          cx={(cellIndex * 70) + 25}
          cy={(rowIndex * 70)+25}
          r={25}
          fill={symbolColors[symbol]}
        />
      )))}
    </motion.svg>
  );
}

export default App;
