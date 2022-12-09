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
#include "../lygia/space/rotate.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/draw/stroke.glsl";
#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/sdf/crossSDF.glsl";

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

float arch02(vec2 st) {
  st = abs(st * 2.0 - 1.0);
  // st.x = abs(st.x);
  vec2 center = vec2(0.5);

  float mod1 = tan((st.x+u_time)*4.0);
  float mod2 = tan((st.y)*4.0);
  
  float l1 = 1.0-smoothstep(mod1-0.5, mod1+0.5, st.y);

  float final = mod1+mod2;

  return final;
}

void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/15.0;

  st = st*2.0-1.0 + vec2(0.0, 1.0);
  vec2 res = vec2(3.0);
  // st = st*res;
  st = cart2polar(st);

  st = step(fract(st.y), 0.5) == 0.0 ? rotate(st, -t) : rotate(st, t);
  vec2 mod1 = step(fract(st.y), 0.5) == 0.0 ? vec2(0.0, -t*2.0) : vec2(0.0, t*2.0);
  st = st*res;
  st = fract(st);  


  float a = fill(circleSDF(fract(st*10.0)), 1.0, 0.01);
  float b1 = fill(pointedArchSDF(st), 1.0, 0.2);
  float b2 = fill(pointedArchSDF(st), 0.8, 0.2);
  float b3 = fill(pointedArchSDF(st), 0.6, 0.2);
  float b4 = fill(pointedArchSDF(st), 0.2, 0.2);
  // float b = fill(pointedArchSDF(st), 1.0, 0.005);
  float p1 = fill(arch02(fract(st*10.0)), 0.5, 0.05);

  vec3 color = COL1; 
  // color = mix(color, COL1, a);
  color = mix(color, COL2, b1);
  color = mix(color, COL3, b2);
  color = mix(color, COL1, b3);
  // color = mix(color, COL2, b);

  gl_FragColor = vec4(color, 1.0);


}