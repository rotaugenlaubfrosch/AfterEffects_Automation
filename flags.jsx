function replaceImageSources(comp, newSources, numbers, headerText) {
    var layers = comp.layers;
    var targetNames = ["1.png", "2.png", "3.png", "4.png", "5.png"]; // Expected image names

    for (var i = 1; i <= layers.length; i++) {
        var layer = layers[i];

        if (layer instanceof AVLayer && layer.source instanceof FootageItem && layer.source.mainSource.isStill) {
            var layerName = layer.source.name;

            // Check if this layer is one of the target images (1.png - 5.png)
            var targetIndex = targetNames.indexOf(layerName);
            if (targetIndex !== -1 && newSources[targetIndex]) {
                layer.replaceSource(newSources[targetIndex], false);
            }
        }
    }

    // Find the "Header" text layer and update its content
    var headerLayer = comp.layer("Header");
    if (headerLayer && headerLayer.property("Source Text")) {
        headerLayer.property("Source Text").setValue(headerText);
    } else {
        alert("Header text layer not found in the imported composition.");
    }

    // Find the highest value in numbers array
    var maxValue = Math.max.apply(null, numbers);

    // Update the last keyframe of the "End" property under "Pfade trimmen 1" for Slider layers
    for (var i = 0; i < 5; i++) {
        var layerName = "Slider" + (i + 1); // Slider1, Slider2, ..., Slider5
        var layer = comp.layer(layerName);

        if (layer) {
            var contents = layer.property("Contents");
            if (!contents) continue;

            var trimPaths = contents.property("Pfade trimmen 1"); // Locate "Pfade trimmen 1"
            if (trimPaths) {
                var endProperty = trimPaths.property("End");
                if (endProperty && endProperty.numKeys >= 1) {
                    var lastKeyIndex = endProperty.numKeys;
                    var newValue = (100 / maxValue) * numbers[i]; // Adjusted based on numbers array
                    endProperty.setValueAtKey(lastKeyIndex, newValue);
                } else {
                    alert("No keyframes found in 'End' property of " + layerName);
                }
            } else {
                alert("'Pfade trimmen 1' not found in " + layerName);
            }
        } else {
            alert("Layer not found: " + layerName);
        }
    }

    // Update the last X-Position keyframe for each "Text" layer
    for (var i = 0; i < 5; i++) {
        var layerName = "Text" + (i + 1); // Text1, Text2, ..., Text5
        var layer = comp.layer(layerName);

        if (layer) {
            var positionProperty = layer.property("Transform").property("Position");

            if (positionProperty && positionProperty.numKeys >= 1) {
                var lastKeyIndex = positionProperty.numKeys;
                var currentPos = positionProperty.keyValue(lastKeyIndex);
                
                // Apply the formula to the X position
                var newX = (1056 * numbers[i] / maxValue) + 444;

                // Set the updated position value while keeping Y the same
                positionProperty.setValueAtKey(lastKeyIndex, [newX, currentPos[1]]);
            } else {
                alert("No keyframes found for X-Position in " + layerName);
            }
        } else {
            alert("Layer not found: " + layerName);
        }
    }

    // Update the last keyframe of "Effects" -> "Slider Control" -> "Slider" for each "Text" layer
    for (var i = 0; i < 5; i++) {
        var layerName = "Text" + (i + 1);
        var layer = comp.layer(layerName);

        if (layer) {
            var effects = layer.property("Effects");
            if (!effects) {
                alert("Effects not found on " + layerName);
                continue;
            }

            var sliderControl = effects.property("Slider Control");
            if (!sliderControl) {
                alert("'Slider Control' not found in Effects of " + layerName);
                continue;
            }

            var sliderProperty = sliderControl.property("Slider");
            if (sliderProperty && sliderProperty.numKeys >= 1) {
                var lastKeyIndex = sliderProperty.numKeys;
                var newValue = numbers[i]; // Set new value from numbers array
                sliderProperty.setValueAtKey(lastKeyIndex, newValue);
            } else {
                alert("No keyframes found in 'Slider' property of " + layerName);
            }
        } else {
            alert("Layer not found: " + layerName);
        }
    }
}

function main() {
    var scriptPath = new File($.fileName).parent.fsName + "/";
    var flagsProjectPath = scriptPath + "../AE/flags.aep"; // CHANGE THIS TO YOUR ACTUAL FILE PATH
    var autoPath = new File($.fileName).parent.parent.fsName + "/";
    var flagsfolder = new Folder(autoPath + "Images/Flags");
    var importOptions = new ImportOptions(new File(flagsProjectPath));

    if (!importOptions.file.exists) {
        alert("The flags.aep project file does not exist at the specified location.");
        return;
    }

    // Begin undo group
    app.beginUndoGroup("Import and Replace Flags");

    // Import the flags project
    var importedProject = app.project.importFile(importOptions);
    if (!(importedProject instanceof FolderItem)) {
        alert("The imported file is not a valid After Effects project.");
        return;
    }

    // Find the main composition in the imported project
    var importedComp = null;
    for (var i = 1; i <= importedProject.numItems; i++) {
        if (importedProject.item(i) instanceof CompItem) {
            importedComp = importedProject.item(i);
            break;
        }
    }

    if (!importedComp) {
        alert("No composition found in the imported project.");
        return;
    }

    // Get the currently open composition
    var currentComp = app.project.activeItem;
    if (!(currentComp instanceof CompItem)) {
        alert("Please open a composition before running this script.");
        return;
    }

    // Find the currently selected layer
    var selectedLayerIndex = currentComp.selectedLayers.length > 0 ? currentComp.selectedLayers[0].index : null;

    // Insert the imported composition
    var importedLayer = currentComp.layers.add(importedComp);
    importedLayer.startTime = currentComp.time;

    // Move it above the selected layer if there is one
    if (selectedLayerIndex) {
        importedLayer.moveBefore(currentComp.layer(selectedLayerIndex));
    }

    var newSources = {};
    var targetNames = ["1.png", "2.png", "3.png", "4.png", "5.png"];

    // Ask for images one by one
    for (var i = 0; i < 5; i++) {
        var selectedFile = File.openDialog("Select image for " + targetNames[i], "*.png", false);
        if (!selectedFile) {
            alert("You must select all 5 PNG images.");
            return;
        }
        var footageItem = app.project.importFile(new ImportOptions(selectedFile));
        newSources[i] = footageItem;
    }

    // Prompt user for five numbers
    var input = prompt("Enter 5 numbers separated by commas (no spaces):", "");
    var numbers = input.split(",").map(function(item) {
        return parseFloat(item);
    });

    // Prompt user for header text
    var headerText = prompt("Enter header text:", "");
    if (!headerText) {
        alert("No header text entered. Using default value.");
        headerText = "Default Header";
    }

    // Replace sources in the duplicated composition
    replaceImageSources(importedComp, newSources, numbers, headerText);

    // End undo group
    app.endUndoGroup();
}

main();

