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

  
  st = (st)*4.0;
  // st = abs(st);
  
  float b = max(dot(st, vec2(1.0, 1.73)*0.5), st.x);

  b = stroke(b, 1.0, 0.1, 0.01);
  // b = fill(circleSDF(st), 1.0, 0.1);

  // b = b+ step(0.5, st.x);

  vec2 s = vec2(1.0, 1.73);
  vec4 hexIndex = round(vec4(st, st - vec2(0.5, 1.0)) / s.xyxy);
  vec4 offset = vec4(st - hexIndex.xy*s, st - (hexIndex.zw + 0.5)*s);
  vec4 res = dot(offset.xy, offset.xy) < dot(offset.zw, offset.zw) 
    ? vec4(offset.xy, hexIndex.xy) 
    : vec4(offset.zw, hexIndex.zw);


  float c = fill(polySDF(((res.xy+0.5)), 6), 0.865, 0.01);
  float c4 = stroke(polySDF(((res.xy+0.5)), 6), 0.865, 0.01, 0.01);
  float c1 = stroke(starSDF((rotate(res.xy+0.5, radians(30))), 6, 0.335), 1.0, 0.1, 0.01);
  float c2 = fill(starSDF((rotate(res.xy+0.5, radians(30))), 6, 0.335), 1.0, 0.01);
  float c3 = fill(starSDF((rotate(res.xy+0.5, radians(0))), 6, 0.335), 0.6, 0.01);


  // 8 point 
  float d11 = fill(starSDF(rotate(fract(st*4.0), radians(45)), 4, 1.0), 1.0, 0.01);
  float d1 = stroke(rectSDF(rotate(fract(st*4.0), radians(0)), vec2(1.0)), 1.0, 0.1, 0.01);
  float d2 = fill(starSDF(rotate(fract(st*4.0)+vec2(0.1, 0.0), radians(45/2)), 8, 0.38), 1.1,  0.01);
  float d21 = fill(starSDF(rotate(fract(st*4.0)-vec2(0.37, 0.0), radians(45)), 4, 0.0), 0.5,  0.01);

  // 10 point
  // this doesnt work!
  // s = vec2(1.0, 0.95);
  // hexIndex = round(vec4(st, st - vec2(0.5, 1.0)) / s.xyxy);
  // offset = vec4(st - hexIndex.xy*s, st - (hexIndex.zw + 0.5)*s);
  // res = dot(offset.xy, offset.xy) < dot(offset.zw, offset.zw) 
  //   ? vec4(offset.xy, hexIndex.xy) 
  //   : vec4(offset.zw, hexIndex.zw);
  // float d3 = fill(polySDF(rotate(fract(st*4.0), radians(0)), 10), 1.0, 0.01);
  
  // float d4 = fill(starSDF(rotate(fract(st*4.0), radians(0)), 10, 0.33), 0.4, 0.01);
  // float d5 = fill(starSDF(rotate(fract(st*4.0), radians(36/2)), 10, 0.815), 0.6, 0.01);
  // float d7 = fill(starSDF(rotate(fract(st*4.0), radians(0)), 10, 0.8), 1.0, 0.01);

  // float d9 = stroke(starSDF(rotate(fract(st*4.0), radians(0)), 10, 0.33), 0.4, 0.1, 0.01);
  // float d10 = stroke(starSDF(rotate(fract(st*4.0), radians(36/2)), 10, 0.815), 0.6, 0.1, 0.01);
  // float d6 = stroke(starSDF(rotate(fract(st*4.0), radians(0)), 10, 0.8), 1.0, 0.1, 0.01);


  // float s1 = smoothstep(0.5-0.01, 0.5+0.01, s);
  // float s2 = stroke(s, 1.0, 0.5, 0.2);
  // float s3 = stroke(s, 0.8, 0.5, 0.2);
  // float s4 = stroke(s, 0.6, 0.5, 0.2);

  vec3 color = mix(PINK, ORANGE, random(res.zw)*3.0);
  // color = GREEN;
  // color = mix(color, YELLOW, c1);
  // color = mix(color, YELLOW, d21);

  // color = mix(color, YELLOW, d3);
  // color = mix(color, BLUE, (1.0-d7));
  // color = mix(color, RED, d5);
  // color = mix(color, YELLOW, d4);

  // color = mix(color, WHITE, d6);
  // color = mix(color, WHITE, d10);
  // color = mix(color, WHITE, d9);


  gl_FragColor = vec4(color, 1.0);


}