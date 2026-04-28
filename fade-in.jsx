var compo2 = app.project.activeItem;
for(var i = 0; i < compo2.selectedLayers.length; i++) {
    var layer = compo2.selectedLayers[i];
            layer.opacity.setValueAtTime(layer.inPoint, 0);
        layer.opacity.setValueAtTime(layer.inPoint+1, 100);
}



