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

        // Ensure the selected layer has motion blur enabled
        layer.motionBlur = true;
	    
	// Generate a random number between 1 and 3
	var randomNumber = Math.floor(Math.random() * 3) + 1;

        // Apply the audio file
        var filepath = "/c/Users/franz/Meine Ablage/YouTube/Automatisierung/Images/Ressources/Put" + randomNumber + ".mp3";
	var file = new File(filepath);
	
        if (file.exists) {
            var item = app.project.importFile(new ImportOptions(file));

            // Add the audio layer **right above** the selected layer
            var layer_audio = compo.layers.add(item);
            layer_audio.moveBefore(layer); // Moves the audio layer above the selected layer
	    layer_audio.startTime = layer.inPoint;

            //layer_audio.startTime = time - 0.15; // Offset the audio slightly before the animation
        } else {
            alert("Audio file not found: " + filepath);
        }
    }
}

