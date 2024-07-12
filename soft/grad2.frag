#version 330
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926538
#define BLACK vec3(0.0)
#define WHITE vec3(1.0)
#define GREEN vec3(142, 255, 174)/255.0
#define ORANGE vec3(244, 215, 189)/255.0
// #define PINK vec3(243, 147, 230)/255.0
// #define BLUE vec3(2, 8, 135)/255.0
// #define YELLOW vec3(251, 244, 168)/255.0
#define RED vec3(255, 62, 65)/255.0
#define PURPLE vec3(172, 142, 255)/255.0

#define PINK vec3(249/255.0,188/255.0,207/255.0)
#define BLUE vec3(101/255.0,153/255.0,229/255.0)
#define YELLOW vec3(248/255.0,233/255.0,8/255.0)

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/generative/random.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/generative/snoise.glsl";
#include "../lygia/generative/gnoise.glsl";
#include "../lygia/generative/pnoise.glsl";
#include "../lygia/generative/fbm.glsl";
#include "../lygia/space/cart2polar.glsl";
#include "../lygia/space/rotate.glsl";
#include "../lygia/space/ratio.glsl";
#include "../lygia/sdf/lineSDF.glsl";
#include "../lygia/draw/stroke.glsl";
#include "../lygia/color/blend/difference.glsl";


void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st = ratio(st, u_resolution);
  st = st * 2.0-1.0;
  float t = u_time/10.0;


  vec3 color = WHITE;
  for(int i = 0; i < 20; i++) {
    vec2 p = vec2(
      random(i+3)*2.0-1.0, 
      random(i+30)*2.0-1.0);

    float r1 = length(st-p);

    vec3 c1 = p.x < 0.5
            ? mix(PINK, GREEN, r1)
            : mix(YELLOW, BLUE, r1); 

    // c1 = mix(GREEN, BLACK, r1);
    // c1 = mix(PURPLE, ORANGE, r1);


    color = blendDifference(color, c1);  
  }

  // color = blendDifference(PINK, GREEN, length(st));


  gl_FragColor = vec4(color, 1.0);
}