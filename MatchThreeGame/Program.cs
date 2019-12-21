using System;

namespace MatchThreeGame
{
    internal static class Program
    {
        private static readonly Random Random = new Random();

        private static CellType[,] grid = new CellType[10, 10];

        private static void Main()
        {
            // Create CellType instances
            // TODO: Allow inputting number of symbols then selecting the specified number of symbols from an alphabet
            CellType[] cellTypes =
            {
                new CellType('A', ConsoleColor.White),
                new CellType('B', ConsoleColor.Cyan),
                new CellType('C', ConsoleColor.Magenta),
                new CellType('D', ConsoleColor.Green),
            };

            // Fill grid randomly
            for (int i = 0; i < grid.GetLength(0); i++)
            {
                for (int j = 0; j < grid.GetLength(1); j++)
                {
                    int index = Random.Next(cellTypes.Length);
                    CellType cellType = cellTypes[index];
                    grid[i, j] = cellType;
                }
            }

            WriteGrid();
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