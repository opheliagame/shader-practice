#version 330
#ifdef GL_ES
precision mediump float;
#endif

// recreating day 1 
// https://i.pinimg.com/564x/46/8c/79/468c79cbcd25a95634822eb3fecc1b44.jpg
// STRONG for further explorations!!

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


void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/2.0;
  

  float res = 4.0;
  vec2 i = floor(st*res);

  st = fract(st*res);
  float ra = mod(i.x+i.y, 2.0) == 0 ? radians(45) : radians(-45);
  st = rotate(st, ra);
  st = st * 2.0-1.0;

  vec2 pos = vec2(0.0)-st;
  float r = length(pos)*2.0;
  float a = atan(pos.y, pos.x);  
  
  // r = sin(pos.x*10.0);

  // float s = ((1.0-abs(sin(a*0.2)*2.0))*0.3)+0.1;
  // float s = pow((1.0/pos.x)*4.0 , 2.0)*0.01 + 0.5;
  float s1 = pow(abs(sin(PI * pos.x / 2.0)), 1.0)*1.0;
  float s2 = pow(abs(sin(PI * pos.x / 2.0)), 2.0)*1.0;
  float sf1 = pow((s1)*1.0+(s2)*2.0, 4.0)*2.0;
  sf1 = 1.0-s1;
  float sf2 = pow((1.0-s1)*1.0-(1.0-s2)*1.2, 2.0)*1.0;
  float sf3 = pow((1.0-s1)/(1.0-s2), 2.0)*1.0;

  // s = smoothstep(-0.5, 0.5, pow(a*2.0, 7.0)*0.6) + 0.1;

  sf1 = 1.-smoothstep(sf1,sf1+0.01,abs(pos.y));
  sf2 = 1.-smoothstep(sf2,sf2+0.01,abs(pos.y));
  sf3 = 1.-smoothstep(sf3,sf3+0.01,abs(pos.y));



  vec3 color = YELLOW;
  color = mix(color, WHITE, sf1);
  // color = mix(color, YELLOW, sf2);




  gl_FragColor = vec4(color, 1.0);


}