$(() => {
    const canvas = $('#Canvas');
    const context = canvas[0].getContext("2d");
    context.font = "12px Arial";
    context.textAlign = "center";

    const markerInput = $('#m_type');
    let markerType = markerInput.val();

    const infoDiv = document.getElementById('m_input');
    const submitBtn = $('#submitBtn');
    const cancelBtn = $('#cancelBtn');
    const nameInputDiv = $('#name_inp');
    const typeInputDiv = $('#type_inp');
    const xInputDiv = $('#x_inp');
    const yInputDiv = $('#y_inp');

    const mapSprite = new Image();
    mapSprite.src = "./floor_plans/floor_16/floor_bg.png";
    /*mapSprite.style.display = "block";
    mapSprite.style.maxWidth = "700px";
    mapSprite.style.height = "auto";
    mapSprite.style.width = "auto";
    mapSprite.style.maxHeight = "600px";*/
    /*
    * display: block;
    * max-width:230px;
    * max-height:95px;
    * width: auto;
    * height: auto;
    * */

    let divOpen = false;

    const Marker = function (type) {
        this.name = '';
        this.Sprite = new Image();
        this.Sprite.src = `./images/${type}_marker.jpg`;
        this.Width = 22;
        this.Height = 22;
        this.XPos = 0;
        this.YPos = 0;
    }

    let Markers = new Map();
    Markers['red'] = new Array();
    Markers['yellow'] = new Array();
    Markers['blue'] = new Array();
    Markers['green'] = new Array();

    const moveDiv = (el, x, y) => {
        el.style.position = 'absolute';
        el.style.left = x + 'px';
        el.style.top = y + 'px';
    };

    const addNameToMarkers = (type, x, y, name) => {
        Markers[type][Markers[type].length - 1].name = name;
    };

    const hideDiv = () => {
        infoDiv.style.display = "none";
    };
    hideDiv();

    const showDiv = () => {
        infoDiv.style.display = "block";
    };

    submitBtn.click(() => {
        addNameToMarkers(typeInputDiv.val(), xInputDiv.val(), yInputDiv.val(), nameInputDiv.val());
        hideDiv();
        divOpen = false;
        nameInputDiv.val('');
    });

    cancelBtn.click(() => {
        Markers[typeInputDiv.val()].pop();
        hideDiv();
        divOpen = false;
    });

    function download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    $('#save_json').click(() => {
        let output_json = {};
        for (let type in Markers) {
            let keyString = type + "_nodes";
            if (!(keyString in output_json)) {
                output_json[keyString] = {};
            }
            for (let i=0 ; i<Markers[type].length ; i++) {
                let marker_i = Markers[type][i];
                if (!(marker_i.name in output_json[keyString])) {
                    output_json[keyString][marker_i.name] = {};
                }
                output_json[keyString][marker_i.name]["coords"] = [
                    ((marker_i.XPos/canvas.width())*31.2).toFixed(1),
                    (26.5 - ((marker_i.YPos/canvas.height())*26.5)).toFixed(1)];
            }
        }
        localStorage.setItem('json', JSON.stringify(output_json));
        download(JSON.stringify(output_json), 'floor.json', 'application/json');
    });

    canvas.click((mouse) => {
        if (!divOpen) {
            divOpen = true;
            mouse = mouse.originalEvent;
            const rect = canvas[0].getBoundingClientRect();
            let mouseXPos = (mouse.clientX - rect.left);
            let mouseYPos = (mouse.clientY - rect.top);

            markerType = markerInput.val();
            let marker = new Marker(markerType);
            marker.XPos = mouseXPos - (marker.Width / 2);
            marker.YPos = mouseYPos - marker.Height;

            // Entering values to Div
            typeInputDiv.val(markerType);
            xInputDiv.val(((marker.XPos/canvas.width())*31.2).toFixed(1));
            yInputDiv.val((26.5 - ((marker.YPos/canvas.height())*26.5)).toFixed(1));

            moveDiv(infoDiv, marker.XPos + 30, marker.YPos + 40);
            showDiv();
            Markers[markerType].push(marker);
        }
    });

    const draw = () => {
        context.fillStyle = "#000";
        context.fillRect(0, 0, canvas.width(), canvas.height());
        context.drawImage(mapSprite, 0, 0, mapSprite.width, mapSprite.height,     // source rectangle
            0, 0, canvas.width(), canvas.height())

        for (let type in Markers) {
            for (let i = 0; i < Markers[type].length; i++) {
                let tempMarker = Markers[type][i];
                context.drawImage(tempMarker.Sprite, tempMarker.XPos, tempMarker.YPos, tempMarker.Width, tempMarker.Height);

                let markerText = tempMarker.name + "-(X:" + ((tempMarker.XPos/canvas.width())*31.2).toFixed(1).toString() + ", Y:" + ((26.5 - ((tempMarker.YPos/canvas.height())*26.5)).toFixed(1)).toString() + ")";

                let textMeasurements = context.measureText(markerText);
                context.fillStyle = "#888";
                context.font = "15px BangersRegular";
                context.globalAlpha = 0.7;
                context.fillRect(tempMarker.XPos - (textMeasurements.width / 2), tempMarker.YPos - 15, textMeasurements.width, 20);
                context.globalAlpha = 1;

                context.fillStyle = "#000";
                context.fillText(markerText, tempMarker.XPos, tempMarker.YPos);
            }
        }
    };

    setInterval(draw, (1000 / 60)); // Refresh 60 times a second
});