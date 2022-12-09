#version 330
#ifdef GL_ES
precision mediump float;
#endif

#define BLACK vec3(0.0)
#define WHITE vec3(1.0)
#define COL1  vec3(151/255.0, 204/255.0, 4/255.0)
#define COL2  vec3(255/255.0, 200/255.0, 212/255.0)
#define COL3  vec3(167/255.0, 226/255.0, 227/255.0)


uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/space/ratio.glsl";
#include "../lygia/space/cart2polar.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/generative/cnoise.glsl";

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
  // st = fract(st);
  vec2 center = vec2(0.5);
  vec2 left  = vec2(0.0, 0.0);
  vec2 right = vec2(1.0, 0.0);
  
  float a = distance(st, left)  * 1.0;
  float b = distance(st, right) * 1.0;

  float mod1 = st.x > 0.5 ? a*3.0 : b*3.0;

  return st + vec2(0.0, mod1);
}

vec2 get_st(vec2 st, vec2 res, vec2 res2) {
  // st += vec2(0.0, 0.5);
  // st = cart2polar(st*2.0-1.0);

  st = st_pointedArch(st);
  st *= res;
  st = fract(st);
  st = st_pointedArch(st);
  st *= res2;
  st = fract(st);
  // st.y = (step(5.0, st.y) - step(6.0, st.y)) * st.y;
  return st;
} 

void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/10.0;

  float a = fill(pointedArchSDF(get_st(st, vec2(11.0, 4.0), vec2(cnoise(st*5.0+t)*10.0, 0.5))), 
    1.0, 0.01);
  
  float c = fill(circleSDF(get_st(st, vec2(1.0), vec2(1.0))), 1.0, 0.05);

  // float a = fill(pointedArchSDF(
  //   get_st(st, vec2(8.0, 2.0), vec2(10.0, 3.0))), 
  //   1.0, 0.05);
  float b = fill(pointedArchSDF(
    get_st(st, vec2(6.0, 4.0), vec2(12.0, 2.0))), 
    1.0, 0.05);

  vec3 color = COL1;
  color = mix(WHITE, BLACK, a);
  // color = mix(color, COL3, 1.0-b);
  // color = mix(color, COL1, 1.0-a);

  gl_FragColor = vec4(color, 1.0);


}