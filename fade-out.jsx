var compo2 = app.project.activeItem;
var time = compo2.time;
for(var i = 0; i < compo2.selectedLayers.length; i++) {
    var layer = compo2.selectedLayers[i];
        layer.opacity.setValueAtTime(time, 100);
        layer.opacity.setValueAtTime(time+1, 0);
}


