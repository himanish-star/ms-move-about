import floor_16_json from "../floor_plans/floor_16/floor.json";

const floorPlansJson = {
    16: floor_16_json
}

function convertIdToCoords(ids, floor, bh, bw, mapHeight) {
    return ids.map(id => {
        if(id[0]==="p") {
            return [floorPlansJson[floor].green_nodes[id].coords[0]*bw, mapHeight - floorPlansJson[floor].green_nodes[id].coords[1]*bh]
        } else if(id.split(".").length===2) {
            return [floorPlansJson[floor].blue_nodes[id].coords[0]*bw, mapHeight - floorPlansJson[floor].blue_nodes[id].coords[1]*bh]
        }
    });
}

export function getShortestPath(sourceRoomId, destinationRoomId, floor, bh, bw, mapHeight) {
    // dummy path is being returned
    return (convertIdToCoords([
        "16.3H", "p25", "p24", "p23", "p22", "p21", "p20", "p19",
        "p18", "p17", "p13", "p14", "p15", "16.LIFT"
    ], floor, bh, bw, mapHeight).join(" ").toString());
}