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

function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function addHochcommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + "'" + '$2');
	}
	return x1 + x2;
}

var text = prompt("0: Text; 1:Celsius to Fahrenheit; 2:KM to Miles; 3:M to feet; 4:KM2 to sqm | exp: 1,16")
var textarray = text.split(",")
switch(parseInt(textarray[0])) {
   case 0:
    var output = textarray[1];
    break;
  case 1:
    var fahrenheit = (parseInt(textarray[1]) * (9/5)) + 32
    var output = addHochcommas(textarray[1]) + " °C = " + addCommas(Math.round(fahrenheit*10)/10) + " °F"
    break;
  case 2:
    var miles = (parseInt(textarray[1])) / 1.609
    var output = addHochcommas(textarray[1]) + " km = " + addCommas(Math.round(miles*10)/10) + " mi"
    break;
  case 3:
    var feet = (parseInt(textarray[1])) *  3.281
    var output = addHochcommas(textarray[1]) + " m = " + addCommas(Math.round(feet*10)/10) + " ft"
    break;
  case 4:
    var sqm = (parseInt(textarray[1])) / 2.59
    var output = addHochcommas(textarray[1]) + " km2 = " + addCommas(Math.round(sqm*10)/10) + " sq mi"
    break;
} 
var layer = compo.layers.addText(output);
centerAnchorPoint(layer)
layer.property("Effects").addProperty("Schlagschatten");
layer.property("Effects")("Schlagschatten")("Entfernung").setValue(0);
layer.property("Effects")("Schlagschatten")("Glättung").setValue(49);
layer.property("Effects")("Schlagschatten")("Deckkraft").setValue(255);
layer.scale.setValue([105,105])
layer.fontSize = 200;
layer.fillColor = [0, 1, (155/255)];
layer.position.addKey(0)
layer.position.addKey(1)
layer.position.addKey(4)
layer.position.addKey(5)
layer.position.setValueAtKey(1, [1920, 2300])
layer.position.setValueAtKey(2, [1920, 2075])
layer.position.setValueAtKey(3, [1920, 2075])
layer.position.setValueAtKey(4, [1920, 2300])
var easeIn = new KeyframeEase(0, 50);
var easeOut = new KeyframeEase(0.75, 85);
var myPositionProperty = layer.property("Position")
myPositionProperty.setTemporalEaseAtKey(1, [easeIn], [easeOut]);
myPositionProperty.setTemporalEaseAtKey(2, [easeIn], [easeOut]);
myPositionProperty.setTemporalEaseAtKey(3, [easeIn], [easeOut]);
myPositionProperty.setTemporalEaseAtKey(4, [easeIn], [easeOut]);
layer.outPoint = layer.inPoint + 5;
layer.startTime = time
layer.motionBlur = true
