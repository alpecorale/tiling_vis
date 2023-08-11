
// we would need to make the gradients (based of the objects current color)
// also need to make gradients for the reverse directions

// then assign all objects of that class the fill


var svg = d3.select("body").append("svg")
.attr("width", 300)
.attr("height", 300);

var defs = svg.append("defs");

// grey
var gradientGreyFwd = defs.append("linearGradient")
.attr("id", "greyGradientFwd")
.attr("x1", "20%")
.attr("x2", "100%")
.attr("y1", "0%")
.attr("y2", "0%"); // change to 100 if want gradient on angle

gradientGreyFwd.append("stop")
.attr("class", "start")
.attr("offset", "0%")
.attr("stop-color", "grey")
.attr("stop-opacity", 1);

gradientGreyFwd.append("stop")
.attr("class", "end")
.attr("offset", "100%")
.attr("stop-color", "grey")
.attr("stop-opacity", .5);

var gradientGreyRev = defs.append("linearGradient")
.attr("id", "greyGradientRev")
.attr("x1", "20%")
.attr("x2", "100%")
.attr("y1", "0%")
.attr("y2", "0%"); // change to 100 if want gradient on angle

gradientGreyRev.append("stop")
.attr("class", "start")
.attr("offset", "0%")
.attr("stop-color", "grey")
.attr("stop-opacity", .5);

gradientGreyRev.append("stop")
.attr("class", "end")
.attr("offset", "100%")
.attr("stop-color", "grey")
.attr("stop-opacity", 1);


// blue

var gradientBlueFwd = defs.append("linearGradient")
.attr("id", "blueGradientFwd")
.attr("x1", "20%")
.attr("x2", "100%")
.attr("y1", "0%")
.attr("y2", "0%"); // change to 100 if want gradient on angle

gradientBlueFwd.append("stop")
.attr("class", "start")
.attr("offset", "0%")
.attr("stop-color", "blue")
.attr("stop-opacity", 1);

gradientBlueFwd.append("stop")
.attr("class", "end")
.attr("offset", "100%")
.attr("stop-color", "blue")
.attr("stop-opacity", .5);

var gradientBlueRev = defs.append("linearGradient")
.attr("id", "blueGradientRev")
.attr("x1", "20%")
.attr("x2", "100%")
.attr("y1", "0%")
.attr("y2", "0%"); // change to 100 if want gradient on angle

gradientBlueRev.append("stop")
.attr("class", "start")
.attr("offset", "0%")
.attr("stop-color", "blue")
.attr("stop-opacity", .5);

gradientBlueRev.append("stop")
.attr("class", "end")
.attr("offset", "100%")
.attr("stop-color", "blue")
.attr("stop-opacity", 1);


// orange

var gradientOrangeFwd = defs.append("linearGradient")
.attr("id", "orangeGradientFwd")
.attr("x1", "20%")
.attr("x2", "100%")
.attr("y1", "0%")
.attr("y2", "0%"); // change to 100 if want gradient on angle

gradientOrangeFwd.append("stop")
.attr("class", "start")
.attr("offset", "0%")
.attr("stop-color", "orange")
.attr("stop-opacity", 1);

gradientOrangeFwd.append("stop")
.attr("class", "end")
.attr("offset", "100%")
.attr("stop-color", "orange")
.attr("stop-opacity", .5);

var gradientOrangeRev = defs.append("linearGradient")
.attr("id", "orangeGradientRev")
.attr("x1", "20%")
.attr("x2", "100%")
.attr("y1", "0%")
.attr("y2", "0%"); // change to 100 if want gradient on angle

gradientOrangeRev.append("stop")
.attr("class", "start")
.attr("offset", "0%")
.attr("stop-color", "orange")
.attr("stop-opacity", .5);

gradientOrangeRev.append("stop")
.attr("class", "end")
.attr("offset", "100%")
.attr("stop-color", "orange")
.attr("stop-opacity", 1);

// red

var gradientRedFwd = defs.append("linearGradient")
.attr("id", "redGradientFwd")
.attr("x1", "20%")
.attr("x2", "100%")
.attr("y1", "0%")
.attr("y2", "0%"); // change to 100 if want gradient on angle

gradientRedFwd.append("stop")
.attr("class", "start")
.attr("offset", "0%")
.attr("stop-color", "red")
.attr("stop-opacity", 1);

gradientRedFwd.append("stop")
.attr("class", "end")
.attr("offset", "100%")
.attr("stop-color", "red")
.attr("stop-opacity", .5);

var gradientRedRev = defs.append("linearGradient")
.attr("id", "redGradientRev")
.attr("x1", "20%")
.attr("x2", "100%")
.attr("y1", "0%")
.attr("y2", "0%"); // change to 100 if want gradient on angle

gradientRedRev.append("stop")
.attr("class", "start")
.attr("offset", "0%")
.attr("stop-color", "red")
.attr("stop-opacity", .5);

gradientRedRev.append("stop")
.attr("class", "end")
.attr("offset", "100%")
.attr("stop-color", "red")
.attr("stop-opacity", 1);

// green

var gradientGreenFwd = defs.append("linearGradient")
.attr("id", "greenGradientFwd")
.attr("x1", "20%")
.attr("x2", "100%")
.attr("y1", "0%")
.attr("y2", "0%"); // change to 100 if want gradient on angle

gradientGreenFwd.append("stop")
.attr("class", "start")
.attr("offset", "0%")
.attr("stop-color", "green")
.attr("stop-opacity", 1);

gradientGreenFwd.append("stop")
.attr("class", "end")
.attr("offset", "100%")
.attr("stop-color", "green")
.attr("stop-opacity", .5);

var gradientGreenRev = defs.append("linearGradient")
.attr("id", "greenGradientRev")
.attr("x1", "20%")
.attr("x2", "100%")
.attr("y1", "0%")
.attr("y2", "0%"); // change to 100 if want gradient on angle

gradientGreenRev.append("stop")
.attr("class", "start")
.attr("offset", "0%")
.attr("stop-color", "green")
.attr("stop-opacity", .5);

gradientGreenRev.append("stop")
.attr("class", "end")
.attr("offset", "100%")
.attr("stop-color", "green")
.attr("stop-opacity", 1);

// black

var gradientBlackFwd = defs.append("linearGradient")
.attr("id", "blackGradientFwd")
.attr("x1", "20%")
.attr("x2", "100%")
.attr("y1", "0%")
.attr("y2", "0%"); // change to 100 if want gradient on angle

gradientBlackFwd.append("stop")
.attr("class", "start")
.attr("offset", "0%")
.attr("stop-color", "black")
.attr("stop-opacity", 1);

gradientBlackFwd.append("stop")
.attr("class", "end")
.attr("offset", "100%")
.attr("stop-color", "black")
.attr("stop-opacity", .5);

var gradientBlackRev = defs.append("linearGradient")
.attr("id", "blackGradientRev")
.attr("x1", "20%")
.attr("x2", "100%")
.attr("y1", "0%")
.attr("y2", "0%"); // change to 100 if want gradient on angle

gradientBlackRev.append("stop")
.attr("class", "start")
.attr("offset", "0%")
.attr("stop-color", "black")
.attr("stop-opacity", .5);

gradientBlackRev.append("stop")
.attr("class", "end")
.attr("offset", "100%")
.attr("stop-color", "black")
.attr("stop-opacity", 1);

// purple

var gradientPurpleFwd = defs.append("linearGradient")
.attr("id", "purpleGradientFwd")
.attr("x1", "20%")
.attr("x2", "100%")
.attr("y1", "0%")
.attr("y2", "0%"); // change to 100 if want gradient on angle

gradientPurpleFwd.append("stop")
.attr("class", "start")
.attr("offset", "0%")
.attr("stop-color", "purple")
.attr("stop-opacity", 1);

gradientPurpleFwd.append("stop")
.attr("class", "end")
.attr("offset", "100%")
.attr("stop-color", "purple")
.attr("stop-opacity", .5);

var gradientPurpleRev = defs.append("linearGradient")
.attr("id", "purpleGradientRev")
.attr("x1", "20%")
.attr("x2", "100%")
.attr("y1", "0%")
.attr("y2", "0%"); // change to 100 if want gradient on angle

gradientPurpleRev.append("stop")
.attr("class", "start")
.attr("offset", "0%")
.attr("stop-color", "purple")
.attr("stop-opacity", .5);

gradientPurpleRev.append("stop")
.attr("class", "end")
.attr("offset", "100%")
.attr("stop-color", "purple")
.attr("stop-opacity", 1);

// brown

var gradientBrownFwd = defs.append("linearGradient")
.attr("id", "brownGradientFwd")
.attr("x1", "20%")
.attr("x2", "100%")
.attr("y1", "0%")
.attr("y2", "0%"); // change to 100 if want gradient on angle

gradientBrownFwd.append("stop")
.attr("class", "start")
.attr("offset", "0%")
.attr("stop-color", "brown")
.attr("stop-opacity", 1);

gradientBrownFwd.append("stop")
.attr("class", "end")
.attr("offset", "100%")
.attr("stop-color", "brown")
.attr("stop-opacity", .5);

var gradientBrownRev = defs.append("linearGradient")
.attr("id", "brownGradientRev")
.attr("x1", "20%")
.attr("x2", "100%")
.attr("y1", "0%")
.attr("y2", "0%"); // change to 100 if want gradient on angle

gradientBrownRev.append("stop")
.attr("class", "start")
.attr("offset", "0%")
.attr("stop-color", "brown")
.attr("stop-opacity", .5);

gradientBrownRev.append("stop")
.attr("class", "end")
.attr("offset", "100%")
.attr("stop-color", "brown")
.attr("stop-opacity", 1);

// pink

var gradientPinkFwd = defs.append("linearGradient")
.attr("id", "pinkGradientFwd")
.attr("x1", "20%")
.attr("x2", "100%")
.attr("y1", "0%")
.attr("y2", "0%"); // change to 100 if want gradient on angle

gradientPinkFwd.append("stop")
.attr("class", "start")
.attr("offset", "0%")
.attr("stop-color", "pink")
.attr("stop-opacity", 1);

gradientPinkFwd.append("stop")
.attr("class", "end")
.attr("offset", "100%")
.attr("stop-color", "pink")
.attr("stop-opacity", .5);

var gradientPinkRev = defs.append("linearGradient")
.attr("id", "pinkGradientRev")
.attr("x1", "20%")
.attr("x2", "100%")
.attr("y1", "0%")
.attr("y2", "0%"); // change to 100 if want gradient on angle

gradientPinkRev.append("stop")
.attr("class", "start")
.attr("offset", "0%")
.attr("stop-color", "pink")
.attr("stop-opacity", .5);

gradientPinkRev.append("stop")
.attr("class", "end")
.attr("offset", "100%")
.attr("stop-color", "pink")
.attr("stop-opacity", 1);

// gold

var gradientGoldFwd = defs.append("linearGradient")
.attr("id", "goldGradientFwd")
.attr("x1", "20%")
.attr("x2", "100%")
.attr("y1", "0%")
.attr("y2", "0%"); // change to 100 if want gradient on angle

gradientGoldFwd.append("stop")
.attr("class", "start")
.attr("offset", "0%")
.attr("stop-color", "gold")
.attr("stop-opacity", 1);

gradientGoldFwd.append("stop")
.attr("class", "end")
.attr("offset", "100%")
.attr("stop-color", "gold")
.attr("stop-opacity", .5);

var gradientGoldRev = defs.append("linearGradient")
.attr("id", "goldGradientRev")
.attr("x1", "20%")
.attr("x2", "100%")
.attr("y1", "0%")
.attr("y2", "0%"); // change to 100 if want gradient on angle

gradientGoldRev.append("stop")
.attr("class", "start")
.attr("offset", "0%")
.attr("stop-color", "gold")
.attr("stop-opacity", .5);

gradientGoldRev.append("stop")
.attr("class", "end")
.attr("offset", "100%")
.attr("stop-color", "gold")
.attr("stop-opacity", 1);

// turquoise

var gradientTurquoiseFwd = defs.append("linearGradient")
.attr("id", "turquoiseGradientFwd")
.attr("x1", "20%")
.attr("x2", "100%")
.attr("y1", "0%")
.attr("y2", "0%"); // change to 100 if want gradient on angle

gradientTurquoiseFwd.append("stop")
.attr("class", "start")
.attr("offset", "0%")
.attr("stop-color", "turquoise")
.attr("stop-opacity", 1);

gradientTurquoiseFwd.append("stop")
.attr("class", "end")
.attr("offset", "100%")
.attr("stop-color", "turquoise")
.attr("stop-opacity", .5);

var gradientTurquoiseRev = defs.append("linearGradient")
.attr("id", "turquoiseGradientRev")
.attr("x1", "20%")
.attr("x2", "100%")
.attr("y1", "0%")
.attr("y2", "0%"); // change to 100 if want gradient on angle

gradientTurquoiseRev.append("stop")
.attr("class", "start")
.attr("offset", "0%")
.attr("stop-color", "turquoise")
.attr("stop-opacity", .5);

gradientTurquoiseRev.append("stop")
.attr("class", "end")
.attr("offset", "100%")
.attr("stop-color", "turquoise")
.attr("stop-opacity", 1);