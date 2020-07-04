const fs = require('fs');

const floorData = fs.readFileSync('../floor_plans/floor_16/floor.json');
const floor = JSON.parse(floorData);
const pathNodes = floor["green_nodes"];
const pathNodeNames = Object.keys(pathNodes);

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
  };  isEmpty() {
    return (this.collection.length === 0) 
  };
}

const Dijkstra = (source, destination) => {
	let distance = {};
	let backtrace = {};
	let pq = new PriorityQueue();
	distance[source] = 0;

	pathNodeNames.forEach(node => {
		if (node != source) {
			distance[node] = Infinity;
		}
	});

	pq.enqueue([source, 0]);

	while (!pq.isEmpty()) {
		let next = pq.dequeue();
		let currentNode = next[0];

		pathNodes[currentNode]["green_adjacent"].forEach(node => {
			let newDistance = distance[currentNode] + get_distance(pathNodes[currentNode]["coords"], pathNodes[node]["coords"]);
			if (newDistance < distance[node]) {
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
	return floor["blue_nodes"][node]["green_adjacent"];
};

const getPath = (source, destination) => {
	let sourceDoorNode = getDoorNode(source), destinationDoorNode = getDoorNode(destination);
	let sourcePathNode = getPathNode(sourceDoorNode), destinationPathNode = getPathNode(destinationDoorNode);
	let path = Dijkstra(sourcePathNode, destinationPathNode);
	path.unshift(sourceDoorNode);
	path.unshift(source);
	path.push(destinationDoorNode);
	path.push(destination);
	return path;
};

console.log(getPath("16.3H.1", "16.3B.1"));