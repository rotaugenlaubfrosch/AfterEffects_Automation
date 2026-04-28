var name = "comp_";
var compo = app.project.items.addComp(name, 1920 * 2, 1080 * 2, 1, 40, 60);

function importFilesFromFolder() {
    app.beginUndoGroup("Import files from folder");
    var files = File.openDialog("aussuchen", "*.mp4;*.mov;", true);
	files = shuffle(files);
    var starttime = 0;
    var endtime = 0;
    var toggle = false;

    if (!files) {
        alert("No files selected.");
        return;
    }

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        try {
            var footage = app.project.importFile(new ImportOptions(file));
        } catch (e) {
            continue;
        }

        var layerr = compo.layers.add(footage);
        var heightt = layerr.height;
        var widthh = layerr.width;
        var verhaltnis = heightt / widthh;

        var faktor;
        if (verhaltnis < 0.5625) {
            faktor = (100 * 1080 * 2) / heightt;
        } else {
            faktor = (100 * 1920 * 2) / widthh;
        }

        layerr.scale.setValue([faktor, faktor]);

        var length = Math.round(Math.random() * 5 + 13);
        if ((layerr.startTime + layerr.source.duration) < length) {
            length = layerr.startTime + layerr.source.duration;
            toggle = true;
            var deduct = true;
        } else {
            var deduct = false;
            layerr.opacity.setValueAtTime(0, 0);
            layerr.opacity.setValueAtTime(3, 100);
        }
        toggle = false;

        layerr.timeRemapEnabled = true;
        var timeRemapProp = layerr.property("ADBE Time Remapping");
        var times = [0, length];
        var values = [0, layerr.source.duration];
        timeRemapProp.setValuesAtTimes(times, values);

        layerr.startTime = starttime;
        starttime = starttime + length - 3;
        endtime += length - 3;

        if (deduct) {
            starttime += 3;
            endtime += 3;
		layerr.startTime = layerr.startTime + 3;

        }
    }
    compo.duration = endtime;
    app.endUndoGroup();
}

function shuffle(array) {
    var shuffledArray = [];
    var usedIndexes = [];

    var i = 0;
    while (i < array.length) {
        var randomNumber = Math.floor(Math.random() * array.length);
        if (usedIndexes.indexOf(randomNumber) === -1) {
            shuffledArray.push(array[randomNumber]);
            usedIndexes.push(randomNumber);
            i++;
        }
    }
    return shuffledArray;
}

importFilesFromFolder();

var compo2 = app.project.activeItem;

if (compo2 && compo2.selectedLayers.length > 0) {
    var index = compo2.selectedLayers[0].index;
    var o = compo2.layers.add(compo);
    o.startTime = compo2.time;

    if (index < compo2.layers.length - 1) {
        o.moveBefore(compo2.layers[index + 1]);
    }
} else {
    alert("No layers selected in the active composition.");
}

