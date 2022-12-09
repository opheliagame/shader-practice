#version 330
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926538
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
  return st.y > 0.0 ? max(a, b) : 2.0;
  // return min(max(a, b), -st.y*5.0);
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

  float angle = atan(st.x-0.5, st.y);

  st = vec2(angle, pointedArchSDF(st));
  st *= res;
  st = fract(st);
  
  return st;
} 

#include "../lygia/space/ratio.glsl";
#include "../lygia/space/cart2polar.glsl";
#include "../lygia/space/rotate.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/draw/stroke.glsl";
#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/sdf/triSDF.glsl";
#include "../lygia/space/ratio.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/generative/gnoise.glsl";

float[] time_sig = {
  0.25, 0.5, 0.75, 1.0, 
};

float[] beat = {
  1.0, -1.0, 1.0, 1.0
};



void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  st = ratio(st, u_resolution);
  vec2 uv = st;
  vec2 cst = cart2polar(st*2.0-1.0);
  float t = u_time * 30.5/60.0;
  float circle = fill(circleSDF(uv), 0.1, 0.001);
  float rect = fill(rectSDF(uv), 0.1, 0.001);
  float tri = fill(triSDF(uv), 0.1, 0.001);
  float[] sample_shapes = {circle, tri, rect};

  float mod1 = step(0.5, fract(st.y*2.0)) == 0.0 ? 1.0 : 0.0;

  st = rotate(st, step(0.5, fract(cst.y*PI*0.5)) == 0.0 ? t : -t);
  st = cart2polar(st*2.0-1.0);

  float arch = pointedArchSDF(fract(st*PI*2.0));
  float s1 = fill(arch, 1.0, 0.01);
  float ss1 = stroke(arch, 1.0, 0.05, 0.01);

  float arch2 = pointedArchSDF(get_st(fract(st*PI), vec2(2.0)));
  float s2 = fill(arch2, 1.0, 0.01);
  float ss2 = stroke(arch2, 1.0, 0.1, 0.01);

  float c0 = stroke(circleSDF(uv), 1.0/PI, 0.01, 0.001);
  float c1 = fill(circleSDF(uv), 1.0/PI, 0.001);
  float c2 = fill(circleSDF(uv), 1.0/PI*2.0, 0.001);
  float c20 = stroke(circleSDF(uv), 1.0/PI*2.0, 0.01, 0.001);
  float c3 = fill(circleSDF(uv), 1.0/PI*3.0, 0.001);
  float c30 = stroke(circleSDF(uv), 1.0/PI*3.0, 0.01, 0.001);
  float c4 = fill(circleSDF(uv), 1.0/PI*4.0, 0.001);
  float c40 = stroke(circleSDF(uv), 1.0/PI*4.0, 0.01, 0.001);

  int beat_change_index = int(mod(fract(t*1.0/6.0)*3.0, 3.0));

  float beat = 
    beat_change_index == 0 ? 2.0 :
    beat_change_index == 1 ? 4.0 :
    8.0;
  
  int index = int(mod(fract(t)*beat, beat));
  float[] shapes = {s1, s2, ss1, s2};

  float ts1 = shapes[int(mod(index, 4))];
  float ts2 = shapes[int(mod(index-1, 4))];

  vec3 color = BLACK;
  // color = mix(color, BLACK, s1);
  color = mix(color, WHITE, ts2*(c4-c3));
  color = mix(color, WHITE, ts1*(c3-c2));
  color = mix(color, WHITE, ts2*c2);
  // color = mix(color, index== 0 ? WHITE : BLACK, c1);
  color = mix(color, BLACK, c1);
  // color = mix(color, index== 0 ? BLACK : WHITE, c0);
  color = mix(color, WHITE, c0+c20+c30+c40);
  color = mix(color, WHITE, sample_shapes[beat_change_index]);

  gl_FragColor = vec4(color, 1.0);


}