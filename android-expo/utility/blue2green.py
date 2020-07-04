import json

f = open('../floor_plans/floor_16/floor.json')
floor = json.load(f)

blue2green = {}

green = floor["green_nodes"]

for ix in green:	
	for iy in green[ix]["blue_adjacent"]:
		if iy not in blue2green.keys():
			blue2green[iy] = []
		blue2green[iy].append(ix)
		
blue = floor["blue_nodes"]

for ix in blue:
	print(blue[ix]["green_adjacent"] in blue2green[ix])