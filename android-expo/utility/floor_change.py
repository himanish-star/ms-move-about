import json
import copy

f = open('../floor_plans/floor_17/floor.json')
floor = json.load(f)

green = floor["green_nodes"]
green_new = copy.deepcopy(green)

for ix in green:	
	new_blue_adjacent = []
	for iy in green[ix]["blue_adjacent"]:
		if iy.startswith("16"):
			new_iy = "17" + iy[2:]
			new_blue_adjacent.append(new_iy)
	green_new[ix]["blue_adjacent"] = new_blue_adjacent

blue = floor["blue_nodes"]
blue_new = {}

for ix in blue:
	blue_new["17" + ix[2:]] = blue[ix]

red = floor["red_nodes"]
red_new = {}

for ix in red:
	red_new["17" + ix[2:]] = red[ix]

floor_new = {
	"green_nodes": green_new,
	"red_nodes": red_new,
	"blue_nodes": blue_new
}

with open('../floor_plans/floor_17/floor.json', 'w') as outf:
	json.dump(floor_new, outf)

