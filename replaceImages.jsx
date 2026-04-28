function replaceSelectedLayersWithImages() {
    app.beginUndoGroup("Replace Selected Layers with Imported Images");

    var comp = app.project.activeItem;
    
    // Check if a composition is active
    if (!comp || !(comp instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }

    // Get selected layers
    var selectedLayers = comp.selectedLayers;

    // If no layers are selected, exit
    if (selectedLayers.length === 0) {
        alert("No layers selected. Please select layers to replace.");
        return;
    }

    // Open file dialog to select multiple images
    var files = File.openDialog("Select images to replace layers", "*.jpg;*.png;*.jpeg;*.tiff;*.tga;*.bmp", true);

    // If user cancels or selects nothing, exit
    if (!files || files.length === 0) {
        return;
    }

    // Ensure files is an array
    if (!(files instanceof Array)) {
        files = [files];
    }

    var importedItems = [];
    for (var i = 0; i < files.length; i++) {
        try {
            var importedFile = app.project.importFile(new ImportOptions(files[i]));
            if (importedFile) {
                importedItems.push(importedFile);
            }
        } catch (e) {
            alert("Error importing file: " + files[i].name + "\n" + e.message);
        }
    }

    // Ensure we have imported files before proceeding
    if (importedItems.length === 0) {
        alert("No valid images were imported.");
        return;
    }

    // Replace layers with imported images
    var layerCount = Math.min(selectedLayers.length, importedItems.length);
    for (var i = 0; i < layerCount; i++) {
        var oldLayer = selectedLayers[i];
        var newItem = importedItems[i];

        if (oldLayer && newItem) {
            oldLayer.replaceSource(newItem, false);
        }
    }

    app.endUndoGroup();
}

// Run the script
replaceSelectedLayersWithImages();

