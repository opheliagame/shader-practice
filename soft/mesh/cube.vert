#version 330 core
layout (location = 0) in vec3 aPos; // the position variable has attribute position 0
in vec3 aColor;
  
varying vec3 vColor; // specify a color output to the fragment shader

void main()
{
    gl_Position = vec4(aPos, 1.0); // see how we directly give a vec3 to vec4's constructor
    vColor = aColor; // set the output variable to a dark-red color
}