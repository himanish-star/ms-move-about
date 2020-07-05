import floor16 from "../floor_plans/floor_16/floor.json";
import floor17 from "../floor_plans/floor_17/floor.json";

const penalty = 0;
const PI = 3.1415926;

const floors = {
	'16': floor16,
	'17': floor17
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
	      	for (let i = 1; i <= this.collection.length; i++) {
	        	if (element[1] < this.collection[i-1][1]) { 
	         		this.collection.splice(i-1, 0, element);
	          		added = true;
	          		break;
	        	}
	      	}
	      	if (!added) {
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

const getDistance = (p1, p2) => {
	return Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2);
};

const getAngle = (p1, p2, p3) => {
	let p21 = [p2[0] - p1[0], p2[1] - p1[1]];
	let p23 = [p2[0] - p3[0], p2[1] - p3[1]];
	let dotProduct = p21[0] * p23[0] + p21[1] * p23[1];
	let crossProduct = p21[0] * p23[1] - p21[1] * p23[0];
	let angle = Math.atan2(crossProduct, dotProduct);
	return Math.floor(angle * 180 / PI + 0.5);
};

const Dijkstra = (source, destination, floorNumber) => {
	let distance = {};
	let parent = {};
	let pq = new PriorityQueue();
	let visited = {};
	distance[source] = 0;

	const pathNodes = floors[floorNumber]["green_nodes"];
	Object.keys(pathNodes).forEach(node => {
		if (node != source) {
			distance[node] = Infinity;
		}
		parent[node] = -1;
	});

	pq.enqueue([source, 0]);

	while (!pq.isEmpty()) {
		let next = pq.dequeue();
		let currentNode = next[0];
		visited[currentNode] = true;

		pathNodes[currentNode]["green_adjacent"].forEach(node => {
			let newDistance = distance[currentNode] + getDistance(pathNodes[currentNode]["coords"], pathNodes[node]["coords"]);
			if (parent[currentNode] != -1) {
				let angle = getAngle(pathNodes[parent[currentNode]]["coords"], pathNodes[currentNode]["coords"], pathNodes[node]["coords"]);
				angle = 180 - Math.abs(angle);
				newDistance += angle * penalty;
			}

			if (!visited[node] && newDistance < distance[node]) {
				distance[node] = newDistance;
				pq.enqueue([node, distance[node]]);
				parent[node] = currentNode;
			}
		}); 
	}

	let path = [destination];
	let lastNode = destination;

	while (lastNode !== source) {
		path.unshift(parent[lastNode]);
		lastNode = parent[lastNode];
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

export const getPath = (source, destination) => {
	let sourceFloor = source.split('.')[0], destinationFloor = destination.split('.')[0];
	if (sourceFloor === destinationFloor) {
		return getPathSameFloor(source, destination);
	} else {
		let pathToLift = getPathSameFloor(source, sourceFloor + ".LIFT");
		return pathToLift.concat(getPathSameFloor(destinationFloor + ".LIFT", destination));
	}	
};

export const getPathInfo = (path) => {
	let coordinates = [];
	let floorNumber = path[0].split('.')[0];
	for (let i=0 ; i<path.length ; i++) {
		let node = path[i];
		let nodeArray = node.split('.');
		if (nodeArray[nodeArray.length - 1] == 'LIFT') {
			floorNumber = nodeArray[0];
		}
		if (node in floors[floorNumber]["green_nodes"]) {
			coordinates.push(floors[floorNumber]["green_nodes"][node]["coords"]);
		} else if (node in floors[floorNumber]["blue_nodes"]) {
			coordinates.push(floors[floorNumber]["blue_nodes"][node]["coords"]);
		} else {
			coordinates.push(floors[floorNumber]["red_nodes"][node]["coords"]);
		}
	}

	let distance = [];
	for (let i=1 ; i<coordinates.length ; i++) {
		distance.push(getDistance(coordinates[i], coordinates[i-1]));
	}

	let time = [];
	for (let i=0 ; i<distance.length ; i++) {
		time.push(distance[i] / 3);
	}
	for (let i=1 ; i<distance.length ; i++) {
		distance[i] += distance[i-1];
		time[i] += time[i-1];
	}

	let deviation = [];
	for (let i=2 ; i<coordinates.length ; i++) {
		let angle = getAngle(coordinates[i-2], coordinates[i-1], coordinates[i]);
		let dev = (180 - Math.abs(angle)) * (angle / Math.abs(angle));
		if (isNaN(dev)) dev = 0;
		deviation.push(dev);
	}

	return [ distance, time, deviation ];
};
