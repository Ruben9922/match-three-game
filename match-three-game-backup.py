from random import randrange
import curses
import itertools
import numpy as np
import vectormath as vm


class Game:
    symbols = ["A", "B", "C", "D"]
    empty_symbol = " "
    grid_size = 10

    def __init__(self, stdscr, colors):
        self.stdscr = stdscr
        self.colors = colors
        self.grid = np.full([12] * 2, ' ', dtype=str)
        # self.grid = [[self.get_random_symbol() for _ in range(Game.grid_size)] for _ in range(Game.grid_size)]

    def play(self):
        self.draw()
        self.stdscr.getch()

    def get_random_symbol(self):
        index = randrange(len(self.symbols))
        return self.symbols[index]

    def draw(self):
        for i, row in enumerate(self.grid):
            for j, symbol in enumerate(row):
                try:
                    color_pair_index = self.symbols.index(symbol) + 1
                except ValueError:
                    color_pair_index = 0
                self.stdscr.addstr(i, j * 2, symbol, curses.color_pair(color_pair_index))

                if j < len(row) - 1:
                    self.stdscr.addstr(i, (j * 2) + 1, " ")

    def update(self):
        match = None
        while match is not None:
            match = find_match()

            if match is None:
                break
            (position, direction) = match

            # TODO: Allow option of removing straight lines instead of whole cluster
            # A cluster is a group of adjacent points with the same symbol
            points_to_remove = find_cluster(position)

            # Set points to empty
            for point in points_to_remove:
                self.grid[point.x][point.y] = self.empty_symbol

            empty_points = points_to_remove
            while empty_points:
                shift(empty_points)
                empty_points = find_empty_points()

    def find_match(self):
        for i in range(Game.grid_size - 2):
            for j in range(Game.grid_size - 2):
                is_vertical_match = Game.all_equal(self)

    @staticmethod
    def all_equal(lst):
        return all(x == lst[0] for x in lst)

    def find_empty_points(self):
        return filter(lambda p: self.grid[p[0]][p[1]] == self.empty_symbol,
                      itertools.product(range(Game.grid_size), repeat=2))


def main(stdscr):
    # Initialise colours
    colors = [
        curses.COLOR_WHITE,
        curses.COLOR_CYAN,
        curses.COLOR_MAGENTA,
        curses.COLOR_GREEN
    ]
    for i, color in enumerate(colors):
        curses.init_pair(i + 1, color, curses.COLOR_BLACK)

    # Show cursor
    curses.curs_set(1)

    # TODO: Title screen

    # Hide cursor
    curses.curs_set(0)
    game = Game(stdscr, colors)
    game.play()

    # Show cursor
    curses.curs_set(1)

    # TODO: "Game over" screen


if __name__ == "__main__":
    curses.wrapper(main)
