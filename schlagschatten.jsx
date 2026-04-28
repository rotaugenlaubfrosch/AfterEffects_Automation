var compo2 = app.project.activeItem;
for(var i = 0; i < compo2.selectedLayers.length; i++) {
    var layer = compo2.selectedLayers[i];
            layer.property("Effects").addProperty("Drop Shadow");
        layer.property("Effects")("Drop Shadow")("Distance").setValue(0);
        layer.property("Effects")("Drop Shadow")("Softness").setValue(150);
        layer.property("Effects")("Drop Shadow")("Opacity").setValue(255);

}



