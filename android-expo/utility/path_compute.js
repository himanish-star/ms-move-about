import floor_16_json from "../floor_plans/floor_16/floor.json";
import floor_17_json from "../floor_plans/floor_17/floor.json";
import {getPath} from "./Dijkstra";

const floorPlansJson = {
    16: floor_16_json,
    17: floor_17_json
}

function convertIdToCoords(ids, floor, bh, bw, mapHeight) {
    return ids.map(id => {
        if(id[0]==="p") {
            return [floorPlansJson[floor].green_nodes[id].coords[0]*bw, mapHeight - floorPlansJson[floor].green_nodes[id].coords[1]*bh]
        } else if(id.split(".").length===2) {
            return [floorPlansJson[floor].blue_nodes[id].coords[0]*bw, mapHeight - floorPlansJson[floor].blue_nodes[id].coords[1]*bh]
        } else {
            return [floorPlansJson[floor].red_nodes[id].coords[0]*bw, mapHeight - floorPlansJson[floor].red_nodes[id].coords[1]*bh]
        }
    });
}

export function getShortestPath(sourceRoomId, destinationRoomId, floor, bh, bw, mapHeight) {
    // console.log(sourceRoomId, destinationRoomId);
    // console.log(getPath(sourceRoomId, destinationRoomId), )
    const pathAsStringId = getPath(sourceRoomId, destinationRoomId);
    return [convertIdToCoords(pathAsStringId, floor, bh, bw, mapHeight).join(" ").toString(),pathAsStringId];
}