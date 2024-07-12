#version 330 core


in vec4 v_color;

void main()
{

    gl_FragColor = vec4(vec3(v_color.xyz), 1.0);
}       