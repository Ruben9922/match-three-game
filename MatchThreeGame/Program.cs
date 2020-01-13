using System;
using System.Collections.Generic;
using System.Linq;

namespace MatchThreeGame
{
    internal static class Program
    {
        private static readonly Random Random = new Random();

        // TODO: Allow inputting number of symbols then selecting the specified number of symbols from an alphabet
        // TODO: Remove "colour data" from the grid itself
        private static readonly CellType[] CellTypes =
        {
            new CellType('A', ConsoleColor.White),
            new CellType('B', ConsoleColor.Cyan),
            new CellType('C', ConsoleColor.Magenta),
            new CellType('D', ConsoleColor.Green),
        };

        private static CellType[,] grid = new CellType[10, 10];

        private static void Main()
        {
            FillGrid();
            WriteGrid();
            
            RefreshGrid();
            WriteGrid();
        }

        private static void FillGrid()
        {
            // Fill grid randomly
            for (int i = 0; i < grid.GetLength(0); i++)
            {
                for (int j = 0; j < grid.GetLength(1); j++)
                {
                    Fill((i, j));
                }
            }
        }

        private static void Fill((int x, int y) point)
        {
            int index = Random.Next(CellTypes.Length);
            CellType cellType = CellTypes[index];
            grid[point.x, point.y] = cellType;
        }

        private static void WriteGrid()
        {
            for (int j = 0; j < grid.GetLength(1); j++)
            {
                for (int i = 0; i < grid.GetLength(0); i++)
                {
                    CellType cellType = grid[i, j];
                    Console.ForegroundColor = cellType.Color;
                    Console.Write(cellType.Symbol);
                    Console.ResetColor();

                    if (i < grid.GetLength(0) - 1)
                    {
                        Console.Write(' ');
                    }
                }

                Console.WriteLine();
            }
        }

        private static void RefreshGrid()
        {
            ((int, int), (int, int))? points;
            do
            {
                points = FindMatch();
                
                if (!points.HasValue) continue;
                
                Console.WriteLine($"Point: {points.Value.Item1.Item1}, {points.Value.Item1.Item2}");
                Console.WriteLine($"Direction: {points.Value.Item2.Item1}, {points.Value.Item2.Item2}");
                break; // this is temporary
                // LinkedList<Tuple<int, int>> removedPoints = RemoveMatch(point.Value, direction);
                // Shift(removedPoints);
                // FillEmptyCells();
            } while (points.HasValue);
        }

        private static ((int x, int y) point, (int x, int y) direction)? FindMatch()
        {
            for (int i = 0; i < grid.GetLength(0) - 2; i++)
            {
                for (int j = 0; j < grid.GetLength(1) - 2; j++)
                {
                    bool isVerticalMatch = AllEqual(grid[i, j].Symbol, grid[i + 1, j].Symbol, grid[i + 2, j].Symbol);
                    if (isVerticalMatch)
                    {
                        return ((i, j), (1, 0));
                    }
                    
                    bool isHorizontalMatch = AllEqual(grid[i, j].Symbol, grid[i, j + 1].Symbol, grid[i, j + 2].Symbol);
                    if (isHorizontalMatch)
                    {
                        return ((i, j), (0, 1));
                    }
                    
                    bool isDiagonalMatch = AllEqual(grid[i, j].Symbol, grid[i + 1, j + 1].Symbol, grid[i + 2, j + 2].Symbol);
                    if (isDiagonalMatch)
                    {
                        return ((i, j), (1, 1));
                    }
                }
            }

            return null;
        }

        private static bool AllEqual(char c1, char c2, char c3)
        {
            return c1 == c2 && c2 == c3; // TODO: Generalise to more than 3 items
        }
    }

    internal class CellType
    {
        public CellType(char symbol, ConsoleColor color)
        {
            Symbol = symbol;
            Color = color;
        }

        public char Symbol { get; }
        public ConsoleColor Color { get; }
    }
}