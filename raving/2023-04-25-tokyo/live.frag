#version 330
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926538
#define BLACK vec3(0.0)
#define WHITE vec3(1.0)
// #define GREEN vec3(75/255.0,148/255.0,90/255.0)
#define GREEN vec3(9, 158, 86)/255.0
#define ORANGE vec3(255, 128, 59)/255.0
#define PINK vec3(	255, 147, 142)/255.0
#define BLUE vec3(101/255.0,153/255.0,229/255.0)
#define YELLOW vec3(251/255.0,209/255.0,100/255.0)


uniform vec2 u_resolution;
uniform float u_time;

#include "../../lygia/space/ratio.glsl";
#include "../../lygia/space/cart2polar.glsl";
#include "../../lygia/space/rotate.glsl";
#include "../../lygia/draw/fill.glsl";
#include "../../lygia/draw/stroke.glsl";
#include "../../lygia/sdf/circleSDF.glsl";
#include "../../lygia/sdf/rectSDF.glsl";
#include "../../lygia/sdf/triSDF.glsl";
#include "../../lygia/sdf/starSDF.glsl";
#include "../../lygia/generative/random.glsl";
#include "../../lygia/generative/gnoise.glsl";
#include "../../lygia/generative/pnoise.glsl";
#include "../../lygia/generative/cnoise.glsl";
#include "../../lygia/generative/fbm.glsl";
#include "./lib.frag";

// HUGE SHOUTOUT TO THE LIBRARY IM USING : LYGIA BY Patricio Gonzalvez Vivo!!!

void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/2.0;

  st.x += cnoise(st)*0.001;

  vec2 st4 = cart2polar(st*2.0-1.0);
  

  vec2 st3 = floor(st4*6.0)/12.0;
  float a = pnoise((st3+t), vec2(2.0));
  vec2 st2 = floor(st*a);
  st4 += a;
  float m2a = random(st2)*12.0+2.0;

  vec2 st1 = get_st(fract(st4), vec2(4.0));
  // st = st1;


  float m = pnoise((st*6.0)*10.0, vec2(1.0));
  vec2 mod_st = (st*4.0+m);

  float res = gnoise(random(floor(mod_st))+t)*4.0+2.0;

  float p = pattern1((st*4.0*m), vec2(1.0));


  float shapes[4] = float[4](
    circleSDF(fract(mod_st)), 
    rectSDF(fract(mod_st)), 
    triSDF(fract(mod_st)),
    circleSDF(fract(mod_st)));
  int rindex = int(floor(random(floor(mod_st) + floor(t)) * 4));
  float c = fill(shapes[rindex], 0.5, 0.2);

  int sides = int(floor(random(st) + gnoise(st.y+t)*2)*2)+2;
  float s1 = starSDF(fract(st1), sides, 0.3);
  float c1 = stroke(s1, 1.0, 0.3, 0.5);
  float c2 = stroke(s1, 1.0, 0.5, 0.5);

  vec3 color = mix(ORANGE, PINK, s1);
  color = mix(color, BLUE, c2);

  // color = mix(color, GREEN, p);

  // color = mix(PINK, YELLOW, p);

  gl_FragColor = vec4(color, 1.0);


}