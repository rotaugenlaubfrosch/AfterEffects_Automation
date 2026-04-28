(function() {
    // Create the main UI window
    var window = new Window("palette", "Select Script", undefined);
    window.orientation = "row";

    // Define the script dire
    var scriptPath = new File($.fileName).parent.fsName + "/";

    // List of buttons with corresponding script names
    var buttons = [
        { label: "Schlagschatten (1)", script: "schlagschatten.jsx", key: "1" },
        { label: "Fade-In (2)", script: "fade-in.jsx", key: "2" },
        { label: "Fade-Out (3)", script: "fade-out.jsx", key: "3" },
        //{ label: "Insert Image", script: "insertImage.jsx" },
        { label: "Align Footage", script: "align_footage.jsx" },
        //{ label: "Quelle 4k", script: "Quelle1-4k.jsx" },
        { label: "Photo", script: "photo.jsx" },
        { label: "Put", script: "put.jsx" },
        { label: "Photo-Text", script: "photo_text.jsx" },
        { label: "Digit", script: "digit.jsx" },
        { label: "Comparison", script: "flags.jsx" },
        { label: "MapMarker", script: "mapMarker.jsx" },
        { label: "Population", script: "population.jsx" },
        { label: "insertImage", script: "insertImage.jsx", key: "Slash"},
        { label: "replaceImages", script: "replaceImages.jsx"},
        { label: "replaceMusic", script: "replaceMusic.jsx"},
        { label: "makeSHORT", script: "shorts.jsx"},
        { label: "Projekt reduzieren", command: 2735 },
        { label: "EXPORT", command: 3800 }
    ];

    // Function to load and execute a script
    function runScript(filename) {
        try {
            var file = new File(scriptPath + filename);
            if (file.exists) {
                file.open("r");
                eval(file.read());
                file.close();
                window.close();
            } else {
                alert("Script not found: " + filename);
            }
        } catch (err) {
            alert("Error running script: " + err.message);
        }
    }

    // Function to execute AE built-in commands
    function runCommand(commandId) {
        app.executeCommand(commandId);
        window.close();
    }

    // Create buttons dynamically
	for (var i = 0; i < buttons.length; i++) {
	    (function(btn) {
		var button = window.add("button", undefined, btn.label);
		button.onClick = function() {
		    if (btn.script) {
			runScript(btn.script);
		    } else if (btn.command) {
			runCommand(btn.command);
		    }
		};
	    })(buttons[i]);
	}


    // Keyboard shortcuts
    window.addEventListener("keydown", function(event) {
		for (var i = 0; i < buttons.length; i++) {
			var btn = buttons[i];
        
			if (btn.key && event.keyName === btn.key) {
				runScript(btn.script);
			}
		}
	});

    // Display the window
    window.center();
    window.show();
})();

