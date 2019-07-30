// window.onmousedown=function(e,obj){
// 	e = e || window.event; //detecting for if it's left or right click
// 	if (e.keycode||e.which==1){ //if left click
// 		leftmousedown=true;
// 		if(leftmousedown==true){
// 			window.addEventListener("mousemove",mouseMove);
// 			function mouseMove(event){
// 				// if(leftmousedown==true){
// 				// 	console.log(event.clientX);
// 				// }
// 				function getMousePos(canvas, evt) {
// 		    var rect = canvas.getBoundingClientRect();
// 		    return {
// 		      x: evt.clientX - rect.left,
// 		      y: evt.clientY - rect.top
// 		    };
// 				}
// 			}
// 		}
// 	}
//
// }

var BASE_HEIGHT      = 2.0;
var BASE_WIDTH       = 5.0;
var LOWER_ARM_HEIGHT = 5.0;
var LOWER_ARM_WIDTH  = 0.5;
var UPPER_ARM_HEIGHT = 5.0;
var UPPER_ARM_WIDTH  = 0.5;

var canvas= document.getElementById("gl-canvas");
var ballMouseLocation=[];
var ballLive= false;
canvas.addEventListener("click",function (e){
	ballmodelViewMatrix= mult(scalem(0.35,0.35,1),mat4());
	var mousePosition=getMousePosition(canvas,e);
	// console.log(mousePosition.x+','+mousePosition.y)
	// console.log(theta[lowerArmId])
	ballMouseLocation[0]=mousePosition.x;
	ballMouseLocation[1]=mousePosition.y;
	if(ballMouseLocation[0]<=256 && ballMouseLocation[1]<=256){ //top left
		ballMouseLocation[0]=(-10*(256-ballMouseLocation[0])/256)-0.4
		ballMouseLocation[1]=(10*(256-ballMouseLocation[1])/256)-0.5
	}
	else if(ballMouseLocation[0]>256 && ballMouseLocation[1]<=256){ //top right
		ballMouseLocation[0]=(10*(ballMouseLocation[0]-256)/256)-0.2
		ballMouseLocation[1]=(10*(256-ballMouseLocation[1])/256)-0.5
	}
	else if(ballMouseLocation[0]<=256 && ballMouseLocation[1]>256){ //bottom left
		ballMouseLocation[0]=(-10*(256-ballMouseLocation[0])/256)-0.4
		ballMouseLocation[1]=(10*(256-ballMouseLocation[1])/256)-0.5
	}
	else if(ballMouseLocation[0]>256 && ballMouseLocation[1]>256){ //bottom right
		ballMouseLocation[0]=(10*(ballMouseLocation[0]-256)/256)-0.2
		ballMouseLocation[1]=(10*(256-ballMouseLocation[1])/256)-0.5

	}

	//IK calculations-----------------------
	var xe= ballMouseLocation[0]+0.4;
	var ye= ballMouseLocation[1]-1.45;
	var lLower= LOWER_ARM_HEIGHT;
	var lUpper= UPPER_ARM_HEIGHT;
	var thetar= Math.acos((xe/(Math.sqrt((Math.pow(xe,2))+(Math.pow(ye,2))))));
	// console.log(thetar);
	// console.log(ballMouseLocation[0],ballMouseLocation[1]);

	theta[LowerArm]=((thetar-(Math.acos(((Math.pow(lLower,2))+(Math.pow(xe,2))+(Math.pow(ye,2))-(Math.pow(lUpper,2)))/(2*lLower*Math.sqrt((Math.pow(xe,2))+(Math.pow(ye,2)))))))*(180/Math.PI))-90;
	theta[UpperArm]=(Math.PI-(Math.acos(((Math.pow(lLower,2))+(Math.pow(lUpper,2))-(Math.pow(xe,2))-(Math.pow(ye,2)))/(2*lLower*lUpper))))*(180/Math.PI);

	// var thetar= Math.acos((xe/(Math.sqrt((Math.pow(xe,2))+(Math.pow(ye,2))))));
	// // console.log(thetar);
	// console.log(ballMouseLocation[0],ballMouseLocation[1]);
	//
	// theta[LowerArm]=((thetar-(Math.acos(((Math.pow(lLower,2))+(Math.pow(xe,2))+(Math.pow(ye,2))-(Math.pow(lUpper,2)))/(2*lLower))))*(180/Math.PI))-90;
	// theta[UpperArm]=(Math.PI-(Math.acos(((Math.pow(lLower,2))+(Math.pow(lUpper,2)))/(2*lLower*lUpper))))*(180/Math.PI);

	console.log(theta[LowerArm]);
	console.log(theta[UpperArm]);

	initNodes(lowerArmId);
	initNodes(upperArmId);


	ballLive=true;
	ballmodelViewMatrix= mult(translate(ballMouseLocation[0],ballMouseLocation[1],1),ballmodelViewMatrix)

},false);

function getMousePosition(canvas,e){
	var rect= canvas.getBoundingClientRect();
	return{
		x: e.clientX- rect.left,
		y: e.clientY- rect.top
	}
}

//ball vertices
// var ballVertices= [
// 	vec4(0,0,0,1.0), //origin
// 	vec4(3,0,0,1.0),
// 	vec4(1,1,0,1.0),
// 	vec4(0,0,0,1.0),
//
// ]

//ball vertices using triangle fan
var ballVertices=[
	vec4(1,1,0,1.0),

	vec4(1,2,0,1.0),
	vec4(1.2,1.98,0,1.0),
	vec4(1.4,1.917,0,1.0),
	vec4(1.6,1.8,0,1.0),
	vec4(1.8,1.6,0,1.0),
	vec4(2,1,0,1.0),

	vec4(1.8,0.4,0,1.0),
	vec4(1.6,0.2,0,1.0),
	vec4(1.4,0.083,0,1.0),
	vec4(1.2,0.02,0,1.0),
	vec4(1,0,0,1.0),

	vec4(0.8,0.02,0,1.0),
	vec4(0.6,0.083,0,1.0),
	vec4(0.4,0.2,0,1.0),
	vec4(0.2,0.4,0,1.0),
	vec4(0,1,0,1.0),

	vec4(0.2,1.6,0,1.0),
	vec4(0.4,1.8,0,1.0),
	vec4(0.6,1.917,0,1.0),
	vec4(0.8,1.98,0,1.0),
	vec4(1,2,0,1.0),
]
