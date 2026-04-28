function createCityMarkersAndPaths() {
	var proj = app.project;
	if (!proj) {
		alert("Kein aktives Projekt gefunden.");
		return;
	}

	var mainComp = proj.activeItem;
	if (!(mainComp instanceof CompItem)) {
		alert("Bitte wählen Sie eine Komposition als aktives Element aus.");
		return;
	}

	var mapCompName = prompt("Geben Sie den Namen der Kartenkomposition (MapComp) ein. Die MapComp muss Null-Ebenen besitzen 'Null1', 'Null2' etc.:", "Komp 2");
	if (!mapCompName) return;

	var mapComp = mainComp.layer(mapCompName);
	if (!mapComp || !(mapComp.source instanceof CompItem)) {
		alert(mapCompName + " wurde in der Hauptkomposition nicht gefunden.");
		return;
	}

	var cityNames = prompt("Geben Sie Städtenamen durch Kommas getrennt ein (max. 6):", "");
	if (!cityNames) return;

	var cityList = cityNames.split(",");
	for (var i = 0; i < cityList.length; i++) {
		cityList[i] = cityList[i].replace(/^\s+|\s+$/g, ""); // Manuelles Trimmen von Leerzeichen
	}
	cityList = cityList.slice(0, 6);


	var startTime = mapComp.inPoint;
	var endTime = mapComp.outPoint;

	var positions = [
		[684, 396], [684, 1080], [684, 1764],
		[3156, 396], [3156, 1080], [3156, 1764]
	];

	app.beginUndoGroup("Städtemarkierungen und Pfade erstellen");

	var helperNulls = [];
	var mainNulls = [];
	for (var i = 0; i < cityList.length; i++) {
		var cityName = cityList[i];

		var mainNull = mainComp.layers.addNull();
		mainNull.name = "Main_" + cityName;
		mainNull.label = 1;
		mainNull.transform.position.setValue(positions[i]);
		mainNull.inPoint = startTime;
		mainNull.outPoint = endTime;
		mainNulls.push(mainNull);

		var mapNull = mapComp.source.layer("Null" + (i+1));
		if (!mapNull) {
			alert("Null" + (i+1) + " nicht in " + mapCompName + " gefunden.");
			continue;
		}

		var helperNull = mainComp.layers.addNull();
		helperNull.name = "Tracker_" + cityName;
		helperNull.label = 2;
		helperNull.threeDLayer = false;
		helperNull.transform.position.expression = "thisComp.layer('" + mapCompName + "').source.layer('" + mapNull.name + "').toComp([0,0,0]);";
		helperNull.inPoint = startTime;
		helperNull.outPoint = endTime;
		helperNulls.push(helperNull);
	}

	for (var i = 0; i < helperNulls.length; i++) {
		var shapeLayer = mainComp.layers.addShape();
		shapeLayer.name = "Pfad_" + cityList[i];
		var shapeGroup = shapeLayer.property("Contents").addProperty("ADBE Vector Group");
		var path = shapeGroup.property("Contents").addProperty("ADBE Vector Shape - Group");

		var pathExpression = "var pts = [\n" +
			"    thisComp.layer('" + mainNulls[i].name + "').toComp([0, 0]),\n" +
			"    thisComp.layer('" + helperNulls[i].name + "').toComp([0, 0])\n" +
			"];\n" +
			"createPath(pts, [], [], true);";
		path.property("Path").expression = pathExpression;

		var stroke = shapeGroup.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
		stroke.property("Color").setValue([1, 1, 1, 1]); // White color
		stroke.property("Stroke Width").setValue(15);
		stroke.property("Taper").property("Start Length").setValue(100);

		shapeLayer.transform.position.setValue([0, 0]);
		shapeLayer.transform.anchorPoint.setValue([0, 0]);
		shapeLayer.inPoint = startTime;
		shapeLayer.outPoint = endTime;
	}

	downloadImages(cityList);
	importImages(mainComp, cityList.length, startTime, endTime);
	app.endUndoGroup();
}

function importImages(comp, n, inPoint, outPoint) {
	// Get the default Downloads folder
	var downloadsFolder = Folder("~/Downloads");
	if (!downloadsFolder.exists) {
		alert("Downloads folder not found.");
		return;
	}

	// Allowed image file extensions
	var imageExtensions = ["jpg", "jpeg", "png"];

	// Get image files from the Downloads folder
	var imageFiles = downloadsFolder.getFiles(function (file) {
		if (file instanceof File) {
			var ext = file.name.split('.').pop().toLowerCase();
			return imageExtensions.indexOf(ext) !== -1; // Fix: Use indexOf instead of includes
		}
		return false;
	});

	// If no images found, exit
	if (imageFiles.length === 0) {
		alert("No image files found in the Downloads folder.");
		return;
	}

	// Sort images by modification date (newest first)
	imageFiles.sort(function (a, b) {
		return b.modified.getTime() - a.modified.getTime();
	});

	// Select the `n` most recent images
	var selectedImages = imageFiles.slice(0, Math.min(n, imageFiles.length));
	selectedImages.reverse();

	var targetPositions = [
		[396, 396], [396, 1080], [396, 1764],
		[3444, 396], [3444, 1080], [3444, 1764]
	];


	for (var i = 0; i < selectedImages.length; i++) {
		var imageFile = selectedImages[i]; // Use the already retrieved file reference

		if (!imageFile.exists) {
			alert("File does not exist: " + imageFile.fsName);
			continue;
		}

		var importOptions = new ImportOptions();
		importOptions.file = imageFile; // Explicitly set the file property

		// Import the image into After Effects
		var importedImage = app.project.importFile(importOptions);
		var imageLayer = comp.layers.add(importedImage);

		// Get original dimensions of the image
		var imgWidth = importedImage.width;
		var imgHeight = importedImage.height;

		// Determine scaling factor to fill 576x576
		var scaleFactor = Math.max(576 / imgWidth, 576 / imgHeight);
		var horizontalPadding = 0;
		var verticalPadding = 0;
		if(imgWidth > imgHeight) {
			horizontalPadding = (imgWidth-imgHeight)/2*scaleFactor;	
		} else {
			verticalPadding = (imgHeight-imgWidth)/2*scaleFactor;	
		}

		imageLayer.property("ADBE Transform Group").property("ADBE Scale").setValue([scaleFactor * 100, scaleFactor * 100]);

		// Adjust position to keep center
		imageLayer.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([imgWidth / 2, imgHeight / 2]);
		imageLayer.property("ADBE Transform Group").property("ADBE Position").setValue([comp.width / 2, comp.height / 2]);

		// Apply a mask centered at the image center to strictly crop to 576x576
		var mask = imageLayer.Masks.addProperty("ADBE Mask Atom");
		var maskShape = new Shape();
		maskShape.vertices = [[(0+horizontalPadding)/scaleFactor, (0+verticalPadding)/scaleFactor], [(576+horizontalPadding)/scaleFactor, (0+verticalPadding)/scaleFactor], [(576+horizontalPadding)/scaleFactor, (576+verticalPadding)/scaleFactor], [(0+horizontalPadding)/scaleFactor, (576+verticalPadding)/scaleFactor]]; // Ensure the mask is centered
		maskShape.closed = true;
		mask.property("ADBE Mask Shape").setValue(maskShape);

		if (i < targetPositions.length) {
			imageLayer.property("ADBE Transform Group").property("ADBE Position").setValue(targetPositions[i]);
		}

		// Enable Layer Styles
		app.executeCommand(9008);

		// Get the Layer Styles group
		var layerStyles = imageLayer.property("ADBE Layer Styles");
		var stroke = layerStyles.property("Stroke");

		stroke.property("Color").setValue([1, 1, 1]); // Set to white
		stroke.property("Size").setValue(15); // Set stroke width to 15px

		imageLayer.inPoint = inPoint;
		imageLayer.outPoint = outPoint;
	}
}

function downloadImages(cityList) {

	var googleApiKey = "XXX";
	var googleCxKey = "XXX";
	var fileType = "jpg";
	var scriptPath = new File($.fileName).parent.fsName;
	var scriptPath = scriptPath + "/insertImage.py"

	for(var a = 0; a < cityList.length; a++) {
		// Generate timestamp-based filename
		$.sleep(1500); // Sleep for 1 second
		var now = new Date();
		var fileName = now.getFullYear() + "-" +
			("0" + (now.getMonth() + 1)).slice(-2) + "-" +
			("0" + now.getDate()).slice(-2) + "-" +
			("0" + now.getHours()).slice(-2) + "-" +
			("0" + now.getMinutes()).slice(-2) + "-" +
			("0" + now.getSeconds()).slice(-2);
		var randomNumber = Math.floor(100 + Math.random() * 900); // Generates a random three-digit number
		var modifiedFileName = fileName + "_" + randomNumber; // Append it to the filename
		var command = 'python3.exe "' + scriptPath + '" "' + googleApiKey + '" "' + googleCxKey + '" "' + cityList[a] + '" "' + fileType + '" "' + modifiedFileName + '"';
		try {
			// Execute Python script
			var result = system.callSystem(command);
		} catch (e) {
			alert("Error downloading " + fileType + ": " + e.toString());
		}
	} 
}

createCityMarkersAndPaths();

