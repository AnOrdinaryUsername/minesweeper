# This is the Python version of the game logic to make team work easier.
# Game logic is implemented here, and then converted into the main Ink project.

import random

move_counter = 0

# The cursor is controller by arrow keys and is used to select cells.
cursor_x = 0
cursor_y = 0

# Dimensions of the grid
grid_rows = 10
grid_cols = 10

# Cell content meanings:
cell_empty = 0
cell_mine = -1

# The data structure for the playfield/grid gamestate.
# It's full of integers. Each number tells the cell's contents.
grid = [[0 for _ in range(grid_rows)] for _ in range(grid_cols)]

# Show grid contents


def print_grid(grid):
    for row in grid:
        for element in row:
            if element == cell_empty:
                print("-", end="")
            elif element == cell_mine:
                print("X", end="")
            else:
                print(element, end="")
        print()


def dig(x, y):
    # Unimplemented
    print("Dug...")

# Move around cursor with WASD, pick a cell to dig with space.


def handle_input():
    global cursor_x, cursor_y  # Global variables this function modifies

    # Get input
    inp = input()
    inp = inp.upper()

    # Move cursor
    if inp == "W":
        cursor_y -= 1
    elif inp == "S":
        cursor_y += 1
    elif inp == "A":
        cursor_x -= 1
    elif inp == "D":
        cursor_x += 1
        

    # Don't let the cursor go out of bounds
    cursor_x = max(0, min(cursor_x, grid_cols - 1))
    cursor_y = max(0, min(cursor_y, grid_rows - 1))

    # Dig
    if inp == " ":
        dig(cursor_x, cursor_y)


def display_game_state():
    print("Move #" + str(move_counter))
    print_grid(grid)
    print("Cursor is at: " + str(cursor_x) + ", " + str(cursor_y))
    print("--------------------")

# Function for setting up Mines


def create_mines():
    mines_no = 15

    # Track of number of mines already set up
    count = 0
    while count < mines_no:
        # Create random row and column pair
        row = random.randint(0, grid_rows-1)
        col = random.randint(0, grid_cols-1)

        # Place Mine if empty
        if grid[row][col] != cell_mine:
            count = count + 1
            grid[row][col] = cell_mine


def get_num_of_neighboring_mines(row, col):
    # Define the relative positions of the neighboring cells
    neighbors = [
        (-1, -1), (-1, 0), (-1, 1),
        (0, -1),            (0, 1),
        (1, -1),  (1, 0),  (1, 1)
    ]
    num_of_mines = 0
    # Iterate over the neighboring cells
    for dr, dc in neighbors:
        new_row = row + dr
        new_col = col + dc

        # Check if the new position is within the grid boundaries
        if 0 <= new_row < len(grid) and 0 <= new_col < len(grid[0]):
            if grid[new_row][new_col] == -1:
                num_of_mines += 1

    return num_of_mines


# Fill the cells that tell you how many mines neighbor it
def create_number_cells():
    for row in range(grid_rows):
        for col in range(grid_cols):
            if grid[row][col] == cell_empty:
                # Count neighboring mines and write the number
                grid[row][col] = get_num_of_neighboring_mines(row, col)


def initialize_grid():
    create_mines()
    create_number_cells()

# Game loop -------------------------------------------------------------
initialize_grid()
while True:
    move_counter += 1
    handle_input()
    display_game_state()
