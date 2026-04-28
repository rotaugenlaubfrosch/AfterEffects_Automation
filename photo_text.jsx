var compo = app.project.activeItem
var time = compo.time

function centerAnchorPoint( layer ){
    var comp = layer.containingComp;
    var curTime = comp.time;
    var layerAnchor = layer.anchorPoint.value;
    var x;
    var y;
    try{
        x = layer.sourceText.value.boxTextSize[0]/2;
        y = layer.sourceText.value.boxTextSize[1]/2;
        x += layer.sourceText.value.boxTextPos[0];
        y += layer.sourceText.value.boxTextPos[1];
    }catch(e){
        x = layer.sourceRectAtTime(curTime, false).width/2;
        y = layer.sourceRectAtTime(curTime, false).height/2;
        x += layer.sourceRectAtTime(curTime, false).left;
        y += layer.sourceRectAtTime(curTime, false).top;
    }
    var xAdd = (x-layerAnchor[0]) * (layer.scale.value[0]/100);
    var yAdd = (y-layerAnchor[1]) * (layer.scale.value[1]/100);
    layer.anchorPoint.setValue([ x, y ]);
    var layerPosition = layer.position.value ;
    layer.position.setValue([ layerPosition[0] + xAdd, layerPosition[1] + yAdd, layerPosition[2] ]);
};

var text = prompt("Text")
var layer = compo.layers.addText(text);
centerAnchorPoint(layer)
layer.property("Effects").addProperty("Drop Shadow");
layer.property("Effects")("Drop Shadow")("Distance").setValue(0);
layer.property("Effects")("Drop Shadow")("Softness").setValue(49);
layer.property("Effects")("Drop Shadow")("Opacity").setValue(255);
layer.scale.setValue([180,180])
layer.fontSize = 200;
layer.fillColor = [0, 1, (155/255)];

layer.position.addKey(0)
layer.position.setValueAtKey(1, [1920, 1080])

layer.opacity.addKey(0)
layer.opacity.addKey(0.01)
layer.opacity.addKey(0.05)
layer.opacity.addKey(0.06)
layer.opacity.addKey(0.1)
layer.opacity.addKey(0.11)
layer.opacity.addKey(0.15)
layer.opacity.addKey(0.16)
layer.opacity.addKey(0.2)
layer.opacity.addKey(0.21)

layer.opacity.addKey(4)
layer.opacity.addKey(4.01)
layer.opacity.addKey(4.05)
layer.opacity.addKey(4.06)
layer.opacity.addKey(4.1)
layer.opacity.addKey(4.11)
layer.opacity.addKey(4.15)
layer.opacity.addKey(4.16)
layer.opacity.addKey(4.2)
layer.opacity.addKey(4.21)

layer.opacity.setValueAtKey(1, 0)
layer.opacity.setValueAtKey(2, 100)
layer.opacity.setValueAtKey(3, 100)
layer.opacity.setValueAtKey(4, 0)
layer.opacity.setValueAtKey(5, 0)
layer.opacity.setValueAtKey(6, 50)
layer.opacity.setValueAtKey(7, 50)
layer.opacity.setValueAtKey(8, 0)
layer.opacity.setValueAtKey(9, 0)
layer.opacity.setValueAtKey(10, 100)

layer.opacity.setValueAtKey(11, 100)
layer.opacity.setValueAtKey(12, 0)
layer.opacity.setValueAtKey(13, 0)
layer.opacity.setValueAtKey(14, 50)
layer.opacity.setValueAtKey(15, 50)
layer.opacity.setValueAtKey(16, 0)
layer.opacity.setValueAtKey(17, 0)
layer.opacity.setValueAtKey(18, 100)
layer.opacity.setValueAtKey(19, 100)
layer.opacity.setValueAtKey(20, 0)

layer.startTime = time
layer.motionBlur = true

var file = File("/c/Users/franz/Meine Ablage/296k/camera_double.mp3");

file = File("/c/Users/franz/Meine\ Ablage/296k/camera_double.mp3");

item = app.project.importFile(new ImportOptions(file));
var layer_audio = compo.layers.add(item);
layer_audio.startTime = time-0.15;


