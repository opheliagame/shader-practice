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
#include "../../lygia/generative/cnoise.glsl";
#include "../../lygia/generative/fbm.glsl";
#include "./lib.frag";

void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/2.0;

  st.x += cnoise(st)*0.001;

  vec2 mod_st = (st*5.0);

  float s1 = starSDF(fract(mod_st), 4, 0.3);

  float shapes[4] = float[4](
    circleSDF(fract(mod_st)), 
    rectSDF(fract(mod_st)), 
    triSDF(fract(mod_st)),
    s1);
  int rindex = int(floor(random(floor(mod_st) + floor(t)) * 4));
  float c = stroke(shapes[rindex], 0.5, 0.2, 0.3);

  // float p = pattern1(mod_st, vec2(1.0));
  st = cart2polar(st*2.0-1.0);
  vec2 st1 = get_st(
    fract(get_st(fract(st*1.0), vec2(1.0))), 
    vec2(sin(st.x)*2.0)
  );

  float p = pattern2(st1, vec2(1.0), 0);
  
  float b1 = step(st.x, 0.5) < 0.0 ? 0 : 1; 
  int sides = int((gnoise(st.x*(1.0-b1)+st.y*b1+t)*4 + random(st) + abs(sin(t))*2))*2+2;
  float p1 = stroke(starSDF(fract(mod_st), sides, 0.3), 1.0, 0.3, 0.4);
  float p2 = stroke(starSDF(fract(mod_st), sides, 0.3), 0.5, 0.3, 0.25);

  float rcolor = cnoise(st+t);
  vec3 colors[3] = vec3[3](YELLOW, GREEN, ORANGE);
  vec3 c1 = colors[int(rcolor * 3)];
  vec3 c2 = colors[int(rcolor * 2)];

  vec3 color = mix(ORANGE, GREEN, p1);

  color = mix(color, WHITE, p);
  // color = mix(color, PINK, p1);

  // color = mix(PINK, YELLOW, p);
  // color = mix(color, RED, p1);

  gl_FragColor = vec4(color, 1.0);


}