(function replaceAudioSources() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }

    var selectedLayers = comp.selectedLayers;
    if (selectedLayers.length === 0) {
        alert("Please select at least one audio layer.");
        return;
    }

    var folder = "/c/Users/franz/Meine Ablage/YouTube/Automatisierung/Music";
    if (!folder) return;

    var categories = ["Epic", "Funky", "Funny", "Calm", "Minecraft"];
    var usedFiles = {}; // Store used files per category

    app.beginUndoGroup("Replace Audio Sources");

    for (var i = 0; i < selectedLayers.length; i++) {
        var layer = selectedLayers[i];

        if (!layer.hasAudio || !layer.source || !(layer.source instanceof FootageItem)) {
            alert("Skipping non-audio layer: " + layer.name);
            continue;
        }

        var layerName = layer.name;
        if (categories.indexOf(layerName) === -1) {
            alert("Skipping: No matching folder for " + layerName);
            continue;
        }

        var categoryFolder = new Folder(folder + "/" + layerName);
        if (!categoryFolder.exists) {
            alert("Skipping: No '" + layerName + "' folder found.");
            continue;
        }

        var audioFiles = categoryFolder.getFiles(function (file) {
            return file instanceof File && /\.(wav|mp3|aif|aiff|flac)$/i.test(file.name);
        });

        if (audioFiles.length === 0) {
            alert("Skipping: No audio files found in " + layerName);
            continue;
        }

        // Ensure unique selection by tracking used files per category
        if (!usedFiles[layerName]) {
            usedFiles[layerName] = [];
        }

        var availableFiles = audioFiles.filter(function (file) {
            return usedFiles[layerName].indexOf(file.name) === -1;
        });

        if (availableFiles.length === 0) {
            alert("Skipping: No unused audio files left in " + layerName);
            continue;
        }

        var randomFile = availableFiles[Math.floor(Math.random() * availableFiles.length)];
        usedFiles[layerName].push(randomFile.name);

        var importedFile = app.project.importFile(new ImportOptions(randomFile));
        layer.replaceSource(importedFile, true);
    }

    app.endUndoGroup();
})();

