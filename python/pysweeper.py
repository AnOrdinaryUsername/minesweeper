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
cell_mine = 9	# It rhymes

# The data structure for the playfield/grid gamestate.
# It's full of integers. Each number tells the cell's contents.
grid = [[0 for _ in range(grid_rows)] for _ in range(grid_cols)]

# Show grid contents
def print_grid(grid):
    for row in grid:
        print(row)

def dig(x, y):
	# Unimplemented
	print("Dug...")

# Move around cursor with WASD, pick a cell to dig with space.
def handle_input():
	global cursor_x, cursor_y # Global variables this function modifies

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


# Game loop -------------------------------------------------------------
while True:
    move_counter += 1
    handle_input()
    display_game_state()
