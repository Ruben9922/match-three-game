using System;
using System.Collections.Generic;
using System.Linq;

namespace MatchThreeGame
{
    internal static class Program
    {
        private static readonly Random Random = new Random(1234);

        // TODO: Allow inputting number of symbols then selecting the specified number of symbols from an alphabet
        // TODO: Remove "colour data" from the grid itself
        private static readonly CellType[] CellTypes =
        {
            new CellType('A', ConsoleColor.White),
            new CellType('B', ConsoleColor.Cyan),
            new CellType('C', ConsoleColor.Magenta),
            new CellType('D', ConsoleColor.Green),
        };
        
        private static readonly CellType EmptyCellType = new CellType(' ', Console.ForegroundColor);

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
            
            Console.WriteLine();
        }

        private static void RefreshGrid()
        {
            ((int, int) point, (int, int) direction)? match;
            do
            {
                match = FindMatch();
                
                if (!match.HasValue) continue;
                
                Console.WriteLine($"Point: {match.Value.Item1.Item1}, {match.Value.Item1.Item2}");
                Console.WriteLine($"Direction: {match.Value.Item2.Item1}, {match.Value.Item2.Item2}");
                
                // Find cluster
                ISet<(int, int)> cellsToRemove = FindCluster(match.Value.point);
                cellsToRemove.ToList().ForEach(cell => Console.WriteLine($"({cell.Item1}, {cell.Item2})"));
                cellsToRemove.ToList().ForEach(cell => grid[cell.Item1, cell.Item2] = EmptyCellType);
                WriteGrid();
                ISet<(int, int)> blankCells = cellsToRemove;
                while (blankCells.Count > 0)
                {
                    Shift(blankCells);
                    // TODO: Blank cells are cells in the grid where there's no symbol
                    // blankCells = 
                }
                WriteGrid();
                break; // this is temporary
                // FillEmptyCells();
            } while (match.HasValue);
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

        private static ISet<(int, int)> FindCluster((int, int) point)
        {
            // Implementation of a simple iterative graph search algorithm
            ISet<(int, int)> fringe = new HashSet<(int, int)>();
            ISet<(int, int)> visited = new HashSet<(int, int)>();
            (int, int) currentPoint = point;

            List<(int, int)> GetNeighboursWithSameSymbol() =>
                // Add neighbouring cells with same symbol to the fringe set
                GetNeighbours(currentPoint)
                    .Where(p => grid[p.Item1, p.Item2].Symbol == grid[currentPoint.Item1, currentPoint.Item2].Symbol)
                    .ToList();

            List<(int, int)> neighbours = GetNeighboursWithSameSymbol();
            fringe.UnionWith(neighbours);

            while (fringe.Count != 0)
            {
                // Get arbitrary item from fringe set
                using var enumerator = fringe.GetEnumerator();
                enumerator.MoveNext();
                currentPoint = enumerator.Current;
                
                visited.Add(currentPoint);
                neighbours = GetNeighboursWithSameSymbol();
                fringe.UnionWith(neighbours);
                fringe.ExceptWith(visited);
            }

            return visited;
        }

        private static void Shift(ISet<(int, int)> removedPoints)
        {
            foreach ((int, int) point in removedPoints)
            {
                for (int j = point.Item2; j > 0; j--)
                {
                    grid[point.Item1, j] = grid[point.Item1, j - 1];
                }
                Fill((point.Item1, 0));
            }
        }

        private static List<(int, int)> GetNeighbours((int, int) point)
        {
            const int radius = 1;
            List<(int, int)> neighbours = new List<(int, int)>((int) Math.Pow((radius * 2) + 1, 2) - 1);
            
            // Generate all neighbouring points that are within the grid boundaries
            for (int i = point.Item1 - radius; i <= point.Item1 + radius; i++)
            {
                for (int j = point.Item2 - radius; j <= point.Item2 + radius; j++)
                {
                    if (i >= 0 && i < grid.GetLength(0) && j >= 0 && j < grid.GetLength(1) && (i, j) != point)
                    {
                        neighbours.Add((i, j));
                    }
                }
            }

            return neighbours;
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