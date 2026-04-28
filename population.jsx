// After Effects ExtendScript to visualize a population pyramid
(function() {
    var csvFile = File.openDialog("Select CSV File");
    if (!csvFile) {
        alert("No file selected. Exiting script.");
        return;
    }
    
    csvFile.open("r");
    var csvData = [];
    var totalPopulation = 0;
    var barWidth = 4000;
    var barHeight = 30;
    var startY = 900;
    var frameDelay = 5;
    var animationDuration = 180;
    
    var firstLine = true;
    while (!csvFile.eof) {
        var line = csvFile.readln();
        if (firstLine) { 
            firstLine = false; 
            continue; 
        }
        var values = line.split(",");
        if (values.length === 3) {
            var male = parseInt(values[1], 10);
            var female = parseInt(values[2], 10);
            csvData.push([values[0], male, female]);
            totalPopulation += male + female;
        }
    }
    csvFile.close();
    
    var comp = app.project.items.addComp("Population Pyramid", 1200, 1000, 1, 10, 60);
    
    for (var i = 0; i < csvData.length; i++) {
        var ageLabel = csvData[i][0];
        var malePop = csvData[i][1];
        var femalePop = csvData[i][2];
        
        var yPos = startY - i * (barHeight + 5);
        var startFrame = i * frameDelay;
        
        var malePercentage = malePop / totalPopulation;
        var femalePercentage = femalePop / totalPopulation;
        
        var maleWidth = Math.max(1, Math.round(malePercentage * barWidth * 2));
        var femaleWidth = Math.max(1, Math.round(femalePercentage * barWidth * 2));
        
        var maleColor = (i % 2 === 0) ? [137/255, 168/255, 199/255] : [99/255, 129/255, 165/255];
        var femaleColor = (i % 2 === 0) ? [226/255, 146/255, 147/255] : [186/255, 110/255, 114/255];
        
        // Create Male Bar (Left)
        var maleBar = comp.layers.addSolid(maleColor, "Male " + ageLabel, maleWidth, barHeight, 1);
        maleBar.motionBlur = true;
        maleBar.transform.anchorPoint.setValue([maleWidth, barHeight / 2]);
        maleBar.transform.position.setValue([600, yPos]);
        maleBar.transform.scale.setValueAtTime(startFrame / 60, [0, 100]);
        maleBar.transform.scale.setValueAtTime((startFrame + animationDuration) / 60, [100, 100]);
        maleBar.transform.scale.setInterpolationTypeAtKey(1, KeyframeInterpolationType.BEZIER);
        maleBar.transform.scale.setInterpolationTypeAtKey(2, KeyframeInterpolationType.BEZIER);
        
        // Create Female Bar (Right)
        var femaleBar = comp.layers.addSolid(femaleColor, "Female " + ageLabel, femaleWidth, barHeight, 1);
        femaleBar.motionBlur = true;
        femaleBar.transform.anchorPoint.setValue([0, barHeight / 2]);
        femaleBar.transform.position.setValue([600, yPos]);
        femaleBar.transform.scale.setValueAtTime(startFrame / 60, [0, 100]);
        femaleBar.transform.scale.setValueAtTime((startFrame + animationDuration) / 60, [100, 100]);
        femaleBar.transform.scale.setInterpolationTypeAtKey(1, KeyframeInterpolationType.BEZIER);
        femaleBar.transform.scale.setInterpolationTypeAtKey(2, KeyframeInterpolationType.BEZIER);
        
        // Create Age Label
        var ageTextLayer = comp.layers.addText(ageLabel);
        var ageTextProp = ageTextLayer.property("Source Text").value;
        ageTextProp.justification = ParagraphJustification.CENTER_JUSTIFY;
        ageTextProp.fontSize = 20;
        ageTextLayer.property("Source Text").setValue(ageTextProp);
        ageTextLayer.transform.anchorPoint.setValue([0, -7]);
        ageTextLayer.transform.position.setValue([600, yPos]);
    }
    
    // Add title text below pyramid
    var titleTextLayer = comp.layers.addText("Bevölkerungspyramide 2024");
    var titleTextProp = titleTextLayer.property("Source Text").value;
    titleTextProp.justification = ParagraphJustification.CENTER_JUSTIFY;
    titleTextProp.fontSize = 30;
    titleTextLayer.property("Source Text").setValue(titleTextProp);
    titleTextLayer.transform.position.setValue([600, 966]);
    
    var activeComp = app.project.activeItem;
    if (activeComp && activeComp instanceof CompItem) {
        var newLayer = activeComp.layers.add(comp);
        newLayer.startTime = activeComp.time;
        newLayer.transform.position.setValue([activeComp.width, activeComp.height]);
        newLayer.transform.anchorPoint.setValue([comp.width, comp.height]);
        newLayer.motionBlur = true;
    }
})();

