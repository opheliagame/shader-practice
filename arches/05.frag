#version 330
#ifdef GL_ES
precision mediump float;
#endif

#define BLACK vec3(0.0)
#define WHITE vec3(1.0)

uniform vec2 u_resolution;
uniform float u_time;

float pointedArchSDF(vec2 st, vec2 center) {
  vec2 left  = vec2(center.x-0.5, center.y-0.5);
  vec2 right = vec2(center.x+0.5, center.y-0.5);
  
  float a = length(st - left)  * 1.0;
  float b = length(st - right) * 1.0;

  // return a+b-(a*b);
  return max(a, b);
}

float pointedArchSDF(vec2 st) {
  return pointedArchSDF(st, vec2(0.5));
}

vec2 st_pointedArch(vec2 st) {
  
  vec2 left  = vec2(0.9, 0.0);
  vec2 right = vec2(0.1, 0.0);

  float a = distance(st, left)  * 1.0;
  float b = distance(st, right) * 1.0;


  return mod(st + vec2(0.0, max(a, b)), 1.0);
}

vec2 get_st(vec2 st, vec2 res) {
  // st += vec2(0.0, 0.5);
  // st = cart2polar(st*2.0-1.0);

  st = vec2(st.x, pointedArchSDF(st));
  st *= res;
  st = fract(st);
  st = vec2(st.x, pointedArchSDF(st));
  st *= res;
  st = fract(st);
  
  // st.y = (step(5.0, st.y) - step(6.0, st.y)) * st.y;
  return st;
} 

#include "../lygia/space/ratio.glsl";
#include "../lygia/space/cart2polar.glsl";
#include "../lygia/space/rotate.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/draw/stroke.glsl";
#include "../lygia/sdf/circleSDF.glsl";

void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/10.0;

  vec2 st_1 = st;


  // st = rotate(st, abs(sin(t)) < 0.5 ? -t : t);
  st = st * 2.0-1.0;
  st = cart2polar(st);
  // st.y += t/10.0;
  // st.t += t/2.0;
  // st.y /= abs(st.x) * 3.0 ;

  st *= 2.38;
  st = fract(st);
  
  float a1 = stroke(pointedArchSDF(st), 1.0, 0.05);
  float a2 = fill(pointedArchSDF(st), 0.8, 0.01);
  float a3 = fill(pointedArchSDF(st), 0.6, 0.01);

  vec2 archst = get_st(st, vec2(1.0));
  float a = fill(pointedArchSDF(
    get_st(st, vec2(4.0, abs(sin(t)*4.0)+2.0))), 
    1.0, 0.01);

  vec2 st1 = get_st(st, vec2(1.0));
  // st1.y += ;
  st1 *= vec2(1.0, 1.0);
  float x = fill(st1.y, 1.0, 0.01);
  
  float c = fill(pointedArchSDF((st1)), 1.0, 0.01);

  vec3 color = BLACK;
  // color = mix(color, BLACK, fill(circleSDF(st), 1.0, 0.01));
  color = mix(color, WHITE, a3);
  color = mix(color, WHITE, a1);
  color = mix(color, WHITE, a2);
  color = mix(color, WHITE, stroke(circleSDF(st_1), 0.4, 0.01));
  color = mix(color, WHITE, fill(circleSDF(st_1), 0.36, 0.01));
  color = mix(color, BLACK, a);
  color = mix(color, BLACK, fract(st.y+sin(t)));
  color = mix(color, BLACK, fill(circleSDF(st_1), 0.2*abs(sin(t))+0.1, 0.01));


  // color = mix(color, WHITE, st1.x);

  gl_FragColor = vec4(color, 1.0);
}