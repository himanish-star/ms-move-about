const canvas = document.getElementById('Canvas');
const context = canvas.getContext("2d");

const mapSprite = new Image();
mapSprite.src = "../android-expo/floor_plans/floor_16/floor_bg.png";

const Marker = function () {
    this.Sprite = new Image();
    this.Sprite.src = "./marker_image.jpg";
    this.Width = 14;
    this.Height = 22;
    this.XPos = 0;
    this.YPos = 0;
}

let Markers = new Array();

const mouseClicked = (mouse) => {
    const rect = canvas.getBoundingClientRect();
    let mouseXPos = (mouse.x - rect.left);
    let mouseYPos = (mouse.y - rect.top);

    console.log("Marker added");

    // Move the marker when placed to a better location
    let marker = new Marker();
    marker.XPos = mouseXPos - (marker.Width / 2);
    marker.YPos = mouseYPos - marker.Height;

    Markers.push(marker);
};

canvas.addEventListener("mousedown", mouseClicked, false);

const firstLoad = () => {
    context.font = "15px Arial";
    context.textAlign = "center";
};

firstLoad();

const main = () => {
    draw();
};

const draw = () => {
    // Clear Canvas
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw map
    // Sprite, X location, Y location, Image width, Image height
    // You can leave the image height and width off, if you do it will draw the image at default size
    context.drawImage(mapSprite, 0, 0, 700, 600);

    // Draw markers
    for (let i = 0; i < Markers.length; i++) {
        let tempMarker = Markers[i];
        // Draw marker
        context.drawImage(tempMarker.Sprite, tempMarker.XPos, tempMarker.YPos, tempMarker.Width, tempMarker.Height);

        // Calculate postion text
        let markerText = "(X:" + tempMarker.XPos + ", Y:" + tempMarker.YPos + ")";

        // Draw a simple box so you can see the position
        let textMeasurements = context.measureText(markerText);
        context.fillStyle = "#888";
        context.globalAlpha = 0.7;
        context.fillRect(tempMarker.XPos - (textMeasurements.width / 2), tempMarker.YPos - 15, textMeasurements.width, 20);
        context.globalAlpha = 1;

        // Draw position above
        context.fillStyle = "#000";
        context.fillText(markerText, tempMarker.XPos, tempMarker.YPos);
    }
};

setInterval(main, (1000 / 60)); // Refresh 60 times a second