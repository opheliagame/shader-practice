#version 330
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926538
#define BLACK vec3(0.0)
#define WHITE vec3(1.0)
#define GREEN vec3(9, 158, 86)/255.0
#define ORANGE vec3(255, 128, 59)/255.0
#define PINK vec3(	255, 147, 142)/255.0
#define BLUE vec3(2, 8, 135)/255.0
#define YELLOW vec3(251/255.0,209/255.0,100/255.0)
#define RED vec3(255, 62, 65)/255.0
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
#include "../lygia/sdf/flowerSDF.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/generative/gnoise.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/generative/pnoise.glsl";
#include "../lygia/generative/fbm.glsl";
#include "../lygia/generative/snoise.glsl";

void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/2.0;

  vec2 orig_st = st;
  
  // st = abs(st);
  
  float b = max(dot(st, vec2(1.0, 1.73)*0.5), st.x);

  b = stroke(b, 1.0, 0.1, 0.01);
  // b = fill(circleSDF(st), 1.0, 0.1);

  // b = b+ step(0.5, st.x);

  vec2 s = vec2(1.4, 1.0);
  st = st / s;
  st = (st)*4.0;
  vec4 hexIndex = round(vec4(st, st - vec2(0.5, 1.0)) / s.xyxy);
  vec4 offset = vec4(st - hexIndex.xy*s, st - (hexIndex.zw + 0.5)*s);
  vec2 res = fract(st);


  float c = fill(polySDF((fract(st)), 8), 1.0, 0.01);
  float c4 = stroke(polySDF(((res.xy+0.5)), 6), 0.865, 0.01, 0.01);
  float c1 = stroke(starSDF((rotate(res.xy+0.5, radians(30))), 6, 0.335), 1.0, 0.1, 0.01);
  float c2 = fill(starSDF((rotate(res.xy+0.5, radians(30))), 6, 0.335), 1.0, 0.01);
  float c3 = fill(starSDF((rotate(res.xy+0.5, radians(0))), 6, 0.335), 0.6, 0.01);




  vec3 color = mix(PINK, ORANGE, c);
  // color = GREEN;


  // color = mix(color, YELLOW, c4);
  // color = mix(color, BLUE, (1.0-d7));
  // color = mix(color, RED, d5);
  // color = mix(color, YELLOW, d4);

  // color = mix(color, WHITE, d6);
  // color = mix(color, WHITE, d10);
  // color = mix(color, WHITE, d9);


  gl_FragColor = vec4(color, 1.0);


}