const fs = require('fs');

const floorData16 = fs.readFileSync('../floor_plans/floor_16/floor.json');
const floor16 = JSON.parse(floorData16);

const floorData17 = fs.readFileSync('../floor_plans/floor_17/floor.json');
const floor17 = JSON.parse(floorData17);

const floors = {
	'16': floor16,
	'17': floor17
};

const get_distance = (p1, p2) => {
	return Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2);
};

class PriorityQueue {
  constructor() {
    this.collection = [];
  }

  enqueue(element) {
    if (this.isEmpty()){ 
      this.collection.push(element);
    } else {
      let added = false;
      for (let i = 1; i <= this.collection.length; i++){
        if (element[1] < this.collection[i-1][1]){ 
          this.collection.splice(i-1, 0, element);
          added = true;
          break;
        }
      }
      if (!added){
          this.collection.push(element);
      }
    }
  };

  dequeue() {
    let value = this.collection.shift();
    return value;
  };  

  isEmpty() {
    return (this.collection.length === 0) 
  };
}

const Dijkstra = (source, destination, floorNumber) => {
	let distance = {};
	let backtrace = {};
	let pq = new PriorityQueue();
	let visited = {};
	distance[source] = 0;

	const pathNodes = floors[floorNumber]["green_nodes"];
	Object.keys(pathNodes).forEach(node => {
		if (node != source) {
			distance[node] = Infinity;
		}
	});

	pq.enqueue([source, 0]);

	while (!pq.isEmpty()) {
		let next = pq.dequeue();
		let currentNode = next[0];
		visited[currentNode] = true;

		pathNodes[currentNode]["green_adjacent"].forEach(node => {
			let newDistance = distance[currentNode] + get_distance(pathNodes[currentNode]["coords"], pathNodes[node]["coords"]);

			if (!visited[node] && newDistance < distance[node]) {
				distance[node] = newDistance;
				backtrace[node] = currentNode;
				pq.enqueue([node, distance]);
			}
		}); 
	}

	let path = [destination];
	let lastNode = destination;

	while (lastNode !== source) {
		path.unshift(backtrace[lastNode]);
		lastNode = backtrace[lastNode];
	}
	return path;
};

const getDoorNode = (node) => {
	let nodeArray = node.split('.');
	if (nodeArray.length > 2) {
		nodeArray.pop();
	}
	return nodeArray.join('.');
};

const getPathNode = (node) => {
	return floors[node.split('.')[0]]["blue_nodes"][node]["green_adjacent"];
};

const getPathSameFloor = (source, destination) => {
	let floorNumber = source.split('.')[0];
	let sourceDoorNode = getDoorNode(source), destinationDoorNode = getDoorNode(destination);
	let sourcePathNode = getPathNode(sourceDoorNode), destinationPathNode = getPathNode(destinationDoorNode);
	let path = Dijkstra(sourcePathNode, destinationPathNode, floorNumber);
	if (source !== sourceDoorNode) {
		path.unshift(sourceDoorNode);
	}
	path.unshift(source);
	if (destinationDoorNode !== destination) {
		path.push(destinationDoorNode);
	}
	path.push(destination);
	return path;
};

const getPath = (source, destination) => {
	let sourceFloor = source.split('.')[0], destinationFloor = destination.split('.')[0];
	if (sourceFloor === destinationFloor) {
		return getPathSameFloor(source, destination);
	} else {
		let pathToLift = getPathSameFloor(source, sourceFloor + ".LIFT");
		return pathToLift.concat(getPathSameFloor(destinationFloor + ".LIFT", destination));
	}
};

console.log(getPath("16.3H.1", "17.3B.1"));