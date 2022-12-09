#version 330
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926538
#define BLACK vec3(0.0)
#define WHITE vec3(1.0)

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/space/ratio.glsl";

void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/10.0;
  


  gl_FragColor = vec4(WHITE, 1.0);


}