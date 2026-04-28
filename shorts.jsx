function importFilesToActiveComp() {
    app.beginUndoGroup("Import and Insert Videos into Active Comp");

    var compo = app.project.activeItem;

    if (!(compo && compo instanceof CompItem)) {
        alert("No active composition selected.");
        return;
    }

    var compWidth = compo.width;
    var compHeight = compo.height;

    if (compWidth !== 1080 || compHeight !== 1920) {
        alert("Active comp must be 1080x1920 (vertical).");
        return;
    }

    var files = File.openDialog("Select Video Files", "*.mp4;*.mov;", true);
    files = shuffle(files);

    if (!files || files.length === 0) {
        alert("No files selected.");
        return;
    }

    var startTime = 0;

    for (var i = 0; i < files.length; i++) {
        var file = files[i];

        var footage;
        try {
            footage = app.project.importFile(new ImportOptions(file));
        } catch (e) {
            continue;
        }

        var layer = compo.layers.add(footage);
        var srcWidth = layer.width;
        var srcHeight = layer.height;
        var scaleFactor;

        // Fit vertically with cropping or pillarboxing
        var compAspect = compWidth / compHeight;
        var srcAspect = srcWidth / srcHeight;

        if (srcAspect > compAspect) {
            // Source is wider -> match height
            scaleFactor = (compHeight / srcHeight) * 100;
        } else {
            // Source is taller -> match width
            scaleFactor = (compWidth / srcWidth) * 100;
        }

        layer.scale.setValue([scaleFactor, scaleFactor]);

        // Center the layer
        layer.property("Position").setValue([compWidth / 2, compHeight / 2]);

        // Set start time and out point
        layer.startTime = startTime;
        var duration = Math.floor(Math.random() * 1.6) + 1.4; // 1 to 3 econds
        layer.outPoint = layer.startTime + duration;

        // Mute audio
        layer.audioEnabled = false;

        // Enable motion blur
        layer.motionBlur = true;

        // Update start time for next layer
        startTime += duration;
    }

    // Enable motion blur globally for the comp
    compo.motionBlur = true;

    // Extend comp duration if needed
    if (compo.duration < startTime) {
        compo.duration = startTime;
    }

    app.endUndoGroup();
}

function shuffle(array) {
    var shuffled = [];
    var usedIndexes = [];
    while (shuffled.length < array.length) {
        var rand = Math.floor(Math.random() * array.length);
        if (usedIndexes.indexOf(rand) === -1) {
            shuffled.push(array[rand]);
            usedIndexes.push(rand);
        }
    }
    return shuffled;
}

importFilesToActiveComp();

