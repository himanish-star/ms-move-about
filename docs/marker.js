$(() => {
    const canvas = $('#Canvas');
    const context = canvas[0].getContext("2d");
    context.font = "12px Arial";
    context.textAlign = "center";
    const toggleGridBtn = $("#toggle_grid");
    let toggleState = false;

    toggleGridBtn.click(() => {
        toggleState = !toggleState;
    });

    let markerType = "red";

    const infoDiv = document.getElementById('m_input');
    const markerSelect = document.getElementById('marker_select');
    const submitBtn = $('#submitBtn');
    const cancelBtn = $('#cancelBtn');
    const nameInputDiv = $('#name_inp');
    const typeInputDiv = $('#type_inp');
    const xInputDiv = $('#x_inp');
    const yInputDiv = $('#y_inp');
    const redM = $('#m_red'), blueM = $('#m_blue'), greenM = $('#m_green'), yellowM = $('#m_yellow');

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
    moveDiv(markerSelect, 1100, 200);
    moveDiv(document.getElementById('marker_info'), 80, 220);

    function drawBoard(displayOn){
        const context = canvas[0].getContext("2d");
        const bw = canvas.width()/31.2;
        const bh = canvas.height()/26.5;
        for (let x = 0; x <= canvas.width(); x += bw) {
            context.moveTo(x, 0);
            context.lineTo(x, canvas.height());
        }

        for (let x = canvas.height(); x >= 0; x -= bh) {
            context.moveTo(0, x);
            context.lineTo(canvas.width(), x);
        }
        context.strokeStyle = displayOn ? "rgba(136,136,136,0.52)" : "rgba(136,136,136,0)";
        context.stroke();
    }

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

    redM.click(() => {
        markerType = "red";
        redM.text("Red *");
        blueM.text("Blue");
        greenM.text("Green");
        yellowM.text("Yellow");
    });

    blueM.click(() => {
        markerType = "blue";
        redM.text("Red");
        blueM.text("Blue *");
        greenM.text("Green");
        yellowM.text("Yellow");
    });

    greenM.click(() => {
        markerType = "green";
        redM.text("Red");
        blueM.text("Blue");
        greenM.text("Green *");
        yellowM.text("Yellow");
    });

    yellowM.click(() => {
        markerType = "yellow";
        redM.text("Red");
        blueM.text("Blue");
        greenM.text("Green");
        yellowM.text("Yellow *");
    });

    redM.hover(() => {
        redM.css('background-color', '#f26565');
    }, () => {
        redM.css('background-color', '#f93535');
    });

    blueM.hover(() => {
        blueM.css('background-color', '#6694ea');
    }, () => {
        blueM.css('background-color', '#355fae');
    });

    greenM.hover(() => {
        greenM.css('background-color', '#93d973');
    }, () => {
        greenM.css('background-color', '#64c13a');
    });

    yellowM.hover(() => {
        yellowM.css('background-color', '#f4d26a');
    }, () => {
        yellowM.css('background-color', '#f9c835');
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

            // markerType = markerInput.val();
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
        drawBoard(toggleState);
    };
    setInterval(draw, (1000)); // Refresh once a second
});