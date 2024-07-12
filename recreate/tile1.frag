#version 330
#ifdef GL_ES
precision mediump float;
#endif

// recreating day 1 
// https://i.pinimg.com/564x/de/6c/5c/de6c5c0122e00fe4ebabb75f37e9d5ee.jpg


#define PI 3.1415926538
#define BLACK vec3(0.0)
#define WHITE vec3(1.0)
#define GREEN vec3(9, 158, 86)/255.0
#define ORANGE vec3(255, 128, 59)/255.0
#define PINK vec3(	255, 147, 142)/255.0
#define BLUE vec3(2, 8, 135)/255.0
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

vec2 random21( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

float voronoi(vec2 st, vec2 center, float scale) {
  st *= scale;

  // find coords of own and neighbour center 
  // vec2 i = center;


  vec2 i = floor(st);
  vec2 f = fract(st);

  float d = 1;

  for(int y = -1; y <= 1; y++) {
    for(int x = -1; x <= 1; x++) {
      vec2 neighbour = vec2(float(x), float(y));
      // vec2 point = fract(center);
      vec2 point = random21(i + neighbour);

      vec2 diff = neighbour + point - f;
      
      d = min(d, length(diff));
    }
  }
  return d;
}

void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/2.0;

  
  st = rotate(st, radians(30));
  st = (st)*3.0;
  // st = abs(st);
  


  vec2 s = vec2(1.0, 1.73);
  vec4 hexIndex = round(vec4(st, st - vec2(0.5, 1.0)) / s.xyxy);
  vec4 offset = vec4(st - hexIndex.xy*s, st - (hexIndex.zw + 0.5)*s);
  vec4 res = dot(offset.xy, offset.xy) < dot(offset.zw, offset.zw) 
    ? vec4(offset.xy, hexIndex.xy) 
    : vec4(offset.zw, hexIndex.zw);

  vec2 uv = res.xy+0.5;
  // float s = 0.8;
  float r1 = rhombSDF(rotate(uv+vec2(0.0, -(1/1.73)/2), radians(90)));
  float r2 = rhombSDF(rotate(uv+vec2(0.25, (1/1.73)/4), radians(30)));
  float r3 = rhombSDF(rotate(uv+vec2(-0.25, (1/1.73)/4), radians(150)));
  float t1 = triSDF(rotate(uv, radians(30))+vec2(0.0, (1/1.73)/2));
  float t2 = triSDF(rotate(uv, radians(90))+vec2(0.0, (1/1.73)/2));
  float t3 = triSDF(rotate(uv, radians(150))+vec2(0.0, (1/1.73)/2));
  float t4 = triSDF(rotate(uv, radians(210))+vec2(0.0, (1/1.73)/2));
  float t5 = triSDF(rotate(uv, radians(270))+vec2(0.0, (1/1.73)/2));
  float t6 = triSDF(rotate(uv, radians(330))+vec2(0.0, (1/1.73)/2));

  // float v = smoothstep(0.3, 1.0, voronoi(res.xy, res.zw, 2.0));  

  float b = 0.01;
  float s1 = stroke(r1, 1.0, 0.05, b) + stroke(r2, 1.0, 0.05, b) + stroke(r3, 1.0, 0.05, b);
  float s2 = stroke(r1, 0.6, 0.05, b) + stroke(r2, 0.6, 0.05, b) + stroke(r3, 0.6, 0.05, b);
  float s3 = stroke(r1, 0.2, 0.05, b) + stroke(r2, 0.2, 0.05, b) + stroke(r3, 0.2, 0.05, b);
  float f1 = fill(r1, 0.6, 0.01) + fill(r2, 0.6, 0.01) + fill(r3, 0.6, 0.01);
  float f2 = fill(r1, 0.2, 0.01) + fill(r2, 0.2, 0.01) + fill(r3, 0.2, 0.01);


  float s4 = stroke(t1, (1/1.73), 0.05, b)
           + stroke(t2, (1/1.73), 0.05, b) 
           + stroke(t3, (1/1.73), 0.05, b) 
           + stroke(t4, (1/1.73), 0.05, b) 
           + stroke(t5, (1/1.73), 0.05, b) 
           + stroke(t6, (1/1.73), 0.05, b)
           ;

  float n = fbm(st*0.5)*1.0;

  vec3 color = GREY1;
  color = mix(color, WHITE, fbm(st*0.5));
  color = mix(color, GREY2, f1);
  color = mix(color, WHITE, fbm(st*0.5+0.1));
  color = mix(color, GREY3, f2);
  color = mix(color, WHITE, fbm(st*0.5+0.5));
  color = mix(color, GREY1*0.95, s1);
  color = mix(color, GREY2*0.95, s2);
  color = mix(color, GREY3*0.95, s3);

  // color = mix(color, GREY1, stroke(t2, 1/1.73, 0.05, b));
  color = mix(color, GREY1, s4);


  gl_FragColor = vec4(color, 1.0);


}