function scalee(size, layer) {
    if((layer.height/layer.width) > (size[1]/size[0])) {
        var scale = ((size[1]*size[2])/layer.height)*100
    } else {
         var scale = ((size[0]*size[2])/layer.width)*100
    }
    return scale
}

var scriptPath = new File($.fileName).parent.fsName + "/insertImage.py";
var googleApiKey = "XXX";
var googleCxKey = "XXX";

var fileTypes = ["jpg", "png"]; // Download both JPG and PNG

// Generate timestamp-based filename
var now = new Date();
var fileName = now.getFullYear() + "-" +
               ("0" + (now.getMonth() + 1)).slice(-2) + "-" +
               ("0" + now.getDate()).slice(-2) + "-" +
               ("0" + now.getHours()).slice(-2) + "-" +
               ("0" + now.getMinutes()).slice(-2) + "-" +
               ("0" + now.getSeconds()).slice(-2);

// Prompt the user for the search term
var searchQuery = prompt("Enter the search query:", "");

if (searchQuery) {
    fileTypes.forEach(function(fileType) {
	var randomNumber = Math.floor(100 + Math.random() * 900); // Generates a random three-digit number
	var modifiedFileName = fileName + "_" + randomNumber; // Append it to the filename
        var command = 'python3.exe "' + scriptPath + '" "' + googleApiKey + '" "' + googleCxKey + '" "' + searchQuery + '" "' + fileType + '" "' + modifiedFileName + '"';
        
        try {
            // Execute Python script
            var result = system.callSystem(command);
        } catch (e) {
            alert("Error downloading " + fileType + ": " + e.toString());
        }
    });

    // Determine the newest files in the download directory
    var downloadPath = new Folder("C:/Users/" + $.getenv("USERNAME") + "/Downloads/"); // Adjust if needed
    var downloadFolder = new Folder(downloadPath);
    var files = downloadFolder.getFiles("*");
    var insertLeft = true;
    if (files.length > 0) {
        files.sort(function(a, b) { return b.modified.getTime() - a.modified.getTime(); });
        
        var newestFiles = files.slice(0, 2); // Get the two most recent files

        newestFiles.forEach(function(newestFile) {
            // Import the newest images into After Effects
            var importOptions = new ImportOptions(newestFile);
            var importedImage = app.project.importFile(importOptions);
            
            // Get the active composition
            var activeComp = app.project.activeItem;
            if (activeComp && activeComp instanceof CompItem) {
                if(activeComp.selectedLayers.length > 0) {
                        var selected_layers_index = activeComp.selectedLayers[0].index;
                } else {
                        var selected_layers_index = 1;
                }
                var newLayer = activeComp.layers.add(importedImage);
                if (selected_layers_index + 1 <= activeComp.numLayers) {
                        newLayer.moveBefore(activeComp.layers[selected_layers_index + 1]);
                }
                selected_layers_index += 1;

                var solid = activeComp.layers.addSolid([0, 0, 0], "solid", 1920*2, 2*1080, 1.0, 5);
                solid.moveBefore(activeComp.layers[selected_layers_index+1]);
                selected_layers_index = selected_layers_index - 0;
                solid.opacity.addKey(0);
                solid.opacity.addKey(0.5);
                solid.opacity.addKey(4.5);
                solid.opacity.addKey(5);
                solid.opacity.setValueAtKey(1, 0);
                solid.opacity.setValueAtKey(2, 60);
                solid.opacity.setValueAtKey(3, 60);
                solid.opacity.setValueAtKey(4, 0);
                solid.startTime = activeComp.time;
                solid.motionBlur = true;
                newLayer.opacity.addKey(0);
                newLayer.opacity.addKey(1);
                newLayer.opacity.addKey(4);
                newLayer.opacity.addKey(5);
                newLayer.opacity.setValueAtKey(1, 0);
                newLayer.opacity.setValueAtKey(2, 100);
                newLayer.opacity.setValueAtKey(3, 100);
                newLayer.opacity.setValueAtKey(4, 0);
		if(insertLeft) {
			newLayer.property("Position").setValue([960, 1080]);
			insertLeft = false;
		} else {
			newLayer.property("Position").setValue([960*3, 1080]);
		}
                newLayer.scale.addKey(0);
                newLayer.scale.addKey(5);
                var scale = scalee([3840/2, 2160, 0.6], newLayer);
                newLayer.scale.setValueAtKey(1, [scale, scale]);
                newLayer.scale.setValueAtKey(2, [scale+10, scale+10]);
                newLayer.property("Effects").addProperty("Drop Shadow");
                newLayer.property("Effects")("Drop Shadow")("Distance").setValue(0);
                newLayer.property("Effects")("Drop Shadow")("Opacity").setValue(255);
                newLayer.property("Effects")("Drop Shadow").property(5).setValue(300);
                newLayer.outPoint = newLayer.inPoint + 5;
                newLayer.startTime = activeComp.time;
                newLayer.motionBlur = true;
            } else {
                alert("No active composition found.");
            }
        });
    } else {
        alert("No downloaded images found.");
    }
} else {
    alert("Search query cannot be empty.");
}

