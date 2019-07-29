"use strict";

var canvas, gl, program;

var NumVertices = 36; //(6 faces)(2 triangles/face)(3 vertices/triangle)

var points = [];
var colors = [];

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5, -0.5, -0.5, 1.0 )
];

// RGBA colors
var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.1, 0.7, 0, 1.0 ),  // white
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];


// Parameters controlling the size of the Robot's arm

var BASE_HEIGHT      = 2.0;
var BASE_WIDTH       = 5.0;
var LOWER_ARM_HEIGHT = 5.0;
var LOWER_ARM_WIDTH  = 0.5;
var UPPER_ARM_HEIGHT = 5.0;
var UPPER_ARM_WIDTH  = 0.5;

// Shader transformation matrices

var modelViewMatrix=mat4();
var ballMVM= mat4();
var projectionMatrix;

// Array of rotation angles (in degrees) for each rotation axis

var Base = 0;
var LowerArm = 1;
var UpperArm = 2;


var theta= [ 0, 0, 0];

var angle = 0;

var modelViewMatrixLoc;

var vBuffer, cBuffer, bBuffer;

//----------------------------------------------------------------------------

function quad(  a,  b,  c,  d ) {
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[b]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[d]);
}


function colorCube() {
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

//-------------------------------------------------------------------
//recursive traversals
var baseId=0;
var lowerArmId=1;
var upperArmId=2;
var robotFigure= [];
var mvStack= [];


function createNode(transform, render, sibling, child) {
		var node={
			transform: transform,
			render: render,
			sibling: sibling,
			child: child,
		}

		return node;
}



for(var i=0; i<3;i++){
	robotFigure[i]= createNode(null,null,null,null);
}

function initNodes(id){
	var m=mat4();
	switch(id){
		case baseId:
			m=rotate(theta[Base],0,1,0);
			robotFigure[baseId]=createNode(m,base,null,lowerArmId)
			break;

		case lowerArmId:
			m = translate(0.0, BASE_HEIGHT, 0.0);
			m = mult(m, rotate(theta[LowerArm], 0, 0, 1 ));
			robotFigure[lowerArmId]=createNode(m,lowerArm,null,upperArmId)
			break;

		case upperArmId:
			m=translate(0.0, LOWER_ARM_HEIGHT, 0.0);
			m=mult(m, rotate(theta[UpperArm], 0, 0, 1) );
			robotFigure[upperArmId]=createNode(m,upperArm,null,null);
			break;

	}
}

function traverse(id){
	if(id==null){
		return;
	}

	mvStack.push(modelViewMatrix);
	modelViewMatrix= mult(modelViewMatrix, robotFigure[id].transform);
	robotFigure[id].render();

	if( robotFigure[id].child != null){
		traverse(robotFigure[id].child)
	}

	modelViewMatrix= mvStack.pop();

}




//___________________________________________________________

// Remove when scale in MV.js supports scale matrices

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}


//--------------------------------------------------


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );
    gl.enable( gl.DEPTH_TEST );

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );

    gl.useProgram( program );

    colorCube();

    // Load shaders and use the resulting shader program

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Create and initialize  buffer objects

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    document.getElementById("slider1").onchange = function(event) {
        theta[baseId] = event.target.value;
				initNodes(baseId);
    };
    document.getElementById("slider2").onchange = function(event) {
         theta[lowerArmId] = event.target.value;
				 initNodes(lowerArmId);
    };
    document.getElementById("slider3").onchange = function(event) {
         theta[upperArmId] =  event.target.value;
				 initNodes(upperArmId);
    };

		for(var i=0; i<3;i++){
			initNodes(i);
		}

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    projectionMatrix = ortho(-10, 10, -10, 10, -10, 10);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(projectionMatrix) );


		bBuffer= gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, bBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, flatten(ballVertices), gl.STATIC_DRAW );

		var vPositionBall= gl.getAttribLocation( program, "vPosition" );
		gl.vertexAttribPointer( vPositionBall, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPositionBall );

    render();
}

//----------------------------------------------------------------------------


function base() {
    var s = scale4(BASE_WIDTH, BASE_HEIGHT, BASE_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * BASE_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------


function upperArm() {
    var s = scale4(UPPER_ARM_WIDTH, UPPER_ARM_HEIGHT, UPPER_ARM_WIDTH);
    var instanceMatrix = mult(translate( 0.0, 0.5 * UPPER_ARM_HEIGHT, 0.0 ),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------


function lowerArm()
{
    var s = scale4(LOWER_ARM_WIDTH, LOWER_ARM_HEIGHT, LOWER_ARM_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * LOWER_ARM_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------

var render = function() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

		gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    traverse(baseId);

		//drawing the ball
		gl.bindBuffer(gl.ARRAY_BUFFER,bBuffer);
		gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(projectionMatrix))
		var ballmodelViewMatrix= mult(translate(0,0,0),ballMVM);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ballmodelViewMatrix) );
		gl.drawArrays(gl.LINE_STRIP, 0, ballVertices.length );

    requestAnimFrame(render);
}
