#version 330
#ifdef GL_ES
precision mediump float;
#endif

// recreating day 4
// https://i.pinimg.com/564x/c3/26/ec/c326ecd44a974a2f63f52c9aab87b0a1.jpg
// https://i.pinimg.com/564x/7a/98/24/7a9824b875c40f518d21b246db05c642.jpg

// STRONG for further explorations!!
// https://archive.org/details/traditionalmetho00chririch/page/128/mode/2up?view=theater SEE THIS!!!!!!!!

#define PI 3.1415926538
#define BLACK vec3(0.0)
#define WHITE vec3(1.0)
#define GREEN vec3(9, 158, 86)/255.0
#define ORANGE vec3(255, 128, 59)/255.0
#define PINK vec3(	255, 147, 142)/255.0
#define BLUE vec3(23,81,144)/255.0
#define YELLOW vec3(251/255.0,209/255.0,100/255.0)
#define RED vec3(255, 62, 65)/255.0
#define GREY1 vec3(222,223,224)/255.0
#define GREY2 vec3(230,230,231)/255.0
#define GREY3 vec3(186,185,177)/255.0
#define GREY4 vec3(216,217,216)/255.0
// #define GREEN vec3(1, 32, 15)/255.0

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/space/ratio.glsl";
#include "../lygia/space/cart2polar.glsl";
#include "../lygia/space/rotate.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/draw/stroke.glsl";
#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/sdf/starSDF.glsl";
#include "../lygia/sdf/polySDF.glsl";
#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/sdf/raysSDF.glsl";
#include "../lygia/sdf/rhombSDF.glsl";
#include "../lygia/sdf/flowerSDF.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/generative/gnoise.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/generative/pnoise.glsl";
#include "../lygia/generative/fbm.glsl";
#include "../lygia/generative/snoise.glsl";
#include "../lygia/math/map.glsl";


void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/2.0;
  

  float res = 6.0;
  vec2 i = floor(st*res);

  st = fract(st*res);
  float angle1 = atan(st.y+0.5, st.x+1.0);
  st = mod(i.x+i.y, 2.0) == 0 ? rotate(st, radians(90)) : rotate(st, radians(0));
  // st = mod(i.x+i.y, 2.0) == 0 ? rotate(st, radians(60)) : rotate(st, radians(-60));
  // st1 = fract(st1*res);
  vec2 st1 = fract(st-0.5);
  st = st * 2.0-1.0;
  st1 = st1 * 2.0-1.0;


  float rn = cnoise(i*2.0);

  vec2 pos = st;
  float r = length(pos);

  float angle = atan(st.y, st.x);
  // float s  = abs(sin(angle * 2.0))*1.0 + 0.5;
  float s  = abs(sin(angle *  6.0))*sin(t*3.0)*1.0 + abs(sin(t+PI))*1.0;
  float s1 = abs(sin(angle *  4.0))*sin(t*1.0)*1.0 + abs(sin(t+PI))*1.0 + 1.0;


  s = map(s, 0.0, 2.0, 0.8, 2.0);

  float a1 = ((sin(angle*2.0)) * sin(angle*4.0)) + 0.1;
  float a2 = (cos(angle*4.0))+0.7;

  float s3 = 1.0-smoothstep(s-0.1, s+0.01, r);
  float s2 = 1.0-smoothstep(s-0.1, s+0.01, r*2.0);
  s1 = 1.0-smoothstep(s1-0.05, s1+0.01, r*2.0);

  r = ((length(sin(pos* 4.0* 1.0) * cos(pos * 3.0))));

  vec3 color = WHITE;
  // color = mix(color, WHITE, smoothstep(a1-0.01, a1+0.01, r*-0.9));
  // color = mix(color, PINK, stroke(s, 1.0, 0.01, 0.01));
  color = mix(color, YELLOW, 1.0-smoothstep(a2-0.01, a2+0.01, r));
  // color = mix(color, GREEN, 1.0-smoothstep(a1-0.01, a1+0.01, r));


  // color = mix(color, BLUE, s3);
  // color = mix(color, GREEN, s1);
  // color = mix(color, BLUE, rn);
  // color = mix(color, YELLOW, 1.0-smoothstep(s-0.1, s+0.01, r*3.0));


  gl_FragColor = vec4(color, 1.0);


}