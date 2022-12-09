#version 330
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926538
#define WHITE vec3(1.0)
#define BLACK vec3(0.0)

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/space/ratio.glsl";
#include "../lygia/space/rotate.glsl";
#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/draw/stroke.glsl";


float pointedArchSDF(vec2 st, vec2 center, float x) {
  vec2 left = vec2(center.x-(1.0-x), center.y);
  vec2 right = vec2(center.x+(1.0-x), center.y);
  
  float a = st.y > center.y ? length(st - left)  * 2.0 : 2.0;
  float b = st.y > center.y ? length(st - right) * 2.0 : 2.0;

  return max(a, b);
}

float pointedArchSDF(vec2 st, float x) {
  return pointedArchSDF(st, vec2(0.5), x);
}

float pointedArchSDF(vec2 st) {
  return pointedArchSDF(st, vec2(0.5), 0.5);
}

void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/10.0;

  st *= 5.0;
  // st.y += mod(floor(st.x), 2.0) == 0.0 ? 0.0 : 0.5;
  st.y += floor(st.y) * 4.5-(1.5/3.0);
  st.x += mod(floor(st.y), 2.0) == 0.0 ? 0.0 : 0.5;
  // st.x += fract(t);
  st = fract(st);

  float x = abs(sin(t))+0.4;
  x = 0.6;
  
  float a1 = pointedArchSDF(st, x);
  float a2 = pointedArchSDF(rotate(st, PI*0.5), x);
  float a3 = pointedArchSDF(rotate(st, PI*1.0), x);
  float a4 = pointedArchSDF(rotate(st, PI*1.5), x);

  // float shape = fill(sdf, 1.0, 0.01);
  float s0 = stroke(circleSDF(st), 1.12, 0.04, 0.01);
  float w = 0.02;
  float s1 = fill(a1, 1.0, w);
  float s2 = fill(a2, 1.0, w);
  float s3 = fill(a3, 1.0, w);
  float s4 = fill(a4, 1.0, w);


  vec3 c = BLACK;
  c = mix(c, WHITE, s0);
  c = mix(c, WHITE, s1);
  c = mix(c, WHITE, s2);
  c = mix(c, WHITE, s3);
  c = mix(c, WHITE, s4);

  gl_FragColor = vec4(vec3(c), 1.0);


}