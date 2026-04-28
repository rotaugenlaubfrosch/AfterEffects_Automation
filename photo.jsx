var compo = app.project.activeItem;
if (!compo || !(compo instanceof CompItem)) {
    alert("Please select a composition.");
} else if (compo.selectedLayers.length === 0) {
    alert("Please select at least one layer before running the script.");
} else {
    var selectedLayers = [];
    for (var i = 0; i < compo.selectedLayers.length; i++) {
        selectedLayers.push(compo.selectedLayers[i]);
    }
    // Loop through all selected layers
    for (var j = 0; j < selectedLayers.length; j++) {
        var layer = selectedLayers[j]; // Get the current layer
    	var time = layer.inPoint;

        // Apply opacity keyframes to the selected layer
        layer.opacity.addKey(time + 0);
        layer.opacity.addKey(time + 0.01);
        layer.opacity.addKey(time + 0.05);
        layer.opacity.addKey(time + 0.06);
        layer.opacity.addKey(time + 0.1);
        layer.opacity.addKey(time + 0.11);
        layer.opacity.addKey(time + 0.15);
        layer.opacity.addKey(time + 0.16);
        layer.opacity.addKey(time + 0.2);
        layer.opacity.addKey(time + 0.21);

        //layer.opacity.addKey(time + 4);
        //layer.opacity.addKey(time + 4.01);
        //layer.opacity.addKey(time + 4.05);
        //layer.opacity.addKey(time + 4.06);
        //layer.opacity.addKey(time + 4.1);
        //layer.opacity.addKey(time + 4.11);
        //layer.opacity.addKey(time + 4.15);
        //layer.opacity.addKey(time + 4.16);
        //layer.opacity.addKey(time + 4.2);
        //layer.opacity.addKey(time + 4.21);

        // Set opacity values at the corresponding keyframes
        var values = [0, 100, 100, 0, 0, 50, 50, 0, 0, 100, 100, 0, 0, 50, 50, 0, 0, 100, 100, 0];
        for (var i = 0; i < values.length-10; i++) {
            layer.opacity.setValueAtKey(i + 1, values[i]);
        }

        // Ensure the selected layer has motion blur enabled
        layer.motionBlur = true;

        // Apply the audio file
        var filePath1 = "/c/Users/franz/Meine Ablage/296k/camera_double.mp3";
        var filePath2 = "/c/Users/franz/Google Drive/296k/camera_double.mp3";

        var file = File(filePath1);
        if (!file.exists) {
            file = File(filePath2);
        }

        if (file.exists) {
            var item = app.project.importFile(new ImportOptions(file));

            // Add the audio layer **right above** the selected layer
            var layer_audio = compo.layers.add(item);
            layer_audio.moveBefore(layer); // Moves the audio layer above the selected layer

            layer_audio.startTime = time - 0.15; // Offset the audio slightly before the animation
        } else {
            alert("Audio file not found: " + filePath1 + " or " + filePath2);
        }
    }
}

