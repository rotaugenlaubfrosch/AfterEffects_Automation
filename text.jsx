var compo = app.project.activeItem;
if (!compo || !(compo instanceof CompItem)) {
    alert("Please select a composition.");
    return;
}

// Ensure a layer is selected
if (compo.selectedLayers.length === 0) {
    alert("Please select a layer before running the script.");
    return;
}

var layer = compo.selectedLayers[0]; // Use the currently selected layer
var time = compo.time;

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

layer.opacity.addKey(time + 4);
layer.opacity.addKey(time + 4.01);
layer.opacity.addKey(time + 4.05);
layer.opacity.addKey(time + 4.06);
layer.opacity.addKey(time + 4.1);
layer.opacity.addKey(time + 4.11);
layer.opacity.addKey(time + 4.15);
layer.opacity.addKey(time + 4.16);
layer.opacity.addKey(time + 4.2);
layer.opacity.addKey(time + 4.21);

// Set opacity values at the corresponding keyframes
layer.opacity.setValueAtKey(1, 0);
layer.opacity.setValueAtKey(2, 100);
layer.opacity.setValueAtKey(3, 100);
layer.opacity.setValueAtKey(4, 0);
layer.opacity.setValueAtKey(5, 0);
layer.opacity.setValueAtKey(6, 50);
layer.opacity.setValueAtKey(7, 50);
layer.opacity.setValueAtKey(8, 0);
layer.opacity.setValueAtKey(9, 0);
layer.opacity.setValueAtKey(10, 100);

layer.opacity.setValueAtKey(11, 100);
layer.opacity.setValueAtKey(12, 0);
layer.opacity.setValueAtKey(13, 0);
layer.opacity.setValueAtKey(14, 50);
layer.opacity.setValueAtKey(15, 50);
layer.opacity.setValueAtKey(16, 0);
layer.opacity.setValueAtKey(17, 0);
layer.opacity.setValueAtKey(18, 100);
layer.opacity.setValueAtKey(19, 100);
layer.opacity.setValueAtKey(20, 0);

// Ensure the selected layer has motion blur enabled
layer.motionBlur = true;

// Apply the audio file
var filePath1 = "/c/Users/franz/Meine Ablage/296k/camera_double.mp3";
var filePath2 = "/c/Users/Franz Schwinn/Google Drive/296k/camera_double.mp3";

// Try the first file path, if it fails, use the second one
var file = File(filePath1);
if (!file.exists) {
    file = File(filePath2);
}

if (file.exists) {
    var item = app.project.importFile(new ImportOptions(file));
    var layer_audio = compo.layers.add(item);
    layer_audio.startTime = time - 0.15; // Offset the audio slightly before the animation
} else {
    alert("Audio file not found: " + filePath1 + " or " + filePath2);
}

