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

var canvas= document.getElementById("gl-canvas");
canvas.addEventListener("click",function (e){
	var mousePosition=getMousePosition(canvas,e);
	console.log(mousePosition.x+','+mousePosition.y)
	console.log(theta[lowerArmId])
},false);

function getMousePosition(canvas,e){
	var rect= canvas.getBoundingClientRect();
	return{
		x: e.clientX- rect.left,
		y: e.clientY- rect.top
	}
}

//ball vertices
var ballVertices= [
	vec4(0,0,0,1.0), //origin
	vec4(2,0,0,1.0),
	vec4(1,1,0,1.0),
	vec4(0,0,0,1.0),

]

//ball vertices using triangle fan
// var ballVertices=[
// 	vec4(1,1,0,1.0),
//
// 	vec4(1,2,0,1.0),
// 	vec4(1.2,1.98,0,1.0),
// 	vec4(1.4,1.917,0,1.0),
// 	vec4(1.6,1.8,0,1.0),
// 	vec4(1.8,1.6,0,1.0),
// 	vec4(2,1,0,1.0),
//
// 	vec4(1.8,0.4,0,1.0),
// 	vec4(1.6,0.2,0,1.0),
// 	vec4(1.4,0.083,0,1.0),
// 	vec4(1.2,0.02,0,1.0),
// 	vec4(1,0,0,1.0),
//
// 	vec4(0.8,0.02,0,1.0),
// 	vec4(0.6,0.083,0,1.0),
// 	vec4(0.4,0.2,0,1.0),
// 	vec4(0.2,0.4,0,1.0),
// 	vec4(0,1,0,1.0),
//
// 	vec4(0.2,1.6,0,1.0),
// 	vec4(0.4,1.8,0,1.0),
// 	vec4(0.6,1.917,0,1.0),
// 	vec4(0.8,1.98,0,1.0),
// 	vec4(1,1,0,1.0)
// ]
