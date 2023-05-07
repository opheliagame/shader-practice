#version 330
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926538
#define BLACK vec3(0.0)
#define WHITE vec3(1.0)
#define PINK vec3(249/255.0,188/255.0,207/255.0)
#define BLUE vec3(101/255.0,153/255.0,229/255.0)
#define YELLOW vec3(248/255.0,233/255.0,8/255.0)

uniform vec2 u_resolution;
uniform float u_time;

#include "../../lygia/space/ratio.glsl";
#include "../../lygia/space/cart2polar.glsl";
#include "../../lygia/space/rotate.glsl";
#include "../../lygia/draw/fill.glsl";
#include "../../lygia/draw/stroke.glsl";
#include "../../lygia/sdf/circleSDF.glsl";
#include "../../lygia/generative/random.glsl";
#include "../../lygia/generative/gnoise.glsl";
#include "../../lygia/generative/cnoise.glsl";
#include "./lib.frag";

void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/5.0;
  
  // float a = pointedArchSDF(st);

  float b1 = fill(pointedArchSDF(st), abs(cos(t)), 0.01);

  // float a1 = stroke(pointedArchSDF(st), 1.0, 0.05);

  float a = fill(pointedArchSDF(
    get_st(st, vec2(6.0, abs(sin(t)*4.0)+2.0))), 
    1.0, 0.01);

  // vec3 color = BLACK; 
  // color = mix(color, WHITE, a);

  st = cart2polar(st*2.0-1.0);
  float n1 = cnoise(floor(st*6.0)+ t*0.1 )*2.0+5.0;
  vec2 ast = get_st(
    fract(get_st((st*1.0), vec2(1.0))), 
    vec2(sin(st.x+t)*2.0+3.0)
  );

  float g2 = random(floor(ast*10.0));
  float a1 = fill(pointedArchSDF(ast), 1.0, 0.01);
  float a2 = stroke(pointedArchSDF(ast), 1.0, 0.05, 0.01);

// last 
  float res = 10.0;
  float mt = random(floor(st*res)) < 0.5 ? 1.0 : -1.0;
  vec2 grid = floor(vec2(st.x, st.y)*res)/res;
  float rot1 = floor(random(floor(st*res)) * 4.0) * 90.0;
  vec2 mod_st = st;
  mod_st.y += (mod_st.x-grid.x) * 1.0 * (random(floor(st*res)) < 0.5 ? 0.0 : 1.0); 

  // float a1 = fill(pointedArchSDF(fract(mod_st*res)), 1.0, 0.01) * (cnoise(grid+floor(t)*1.0) < 0.5 ? 1.0 : 0.0);

  float c0 = stroke(circleSDF(st), 1.0/PI, 0.01, 0.001);
  float c1 = fill(circleSDF(st), 1.0/PI, 0.001);
  vec2 cst = cart2polar(st*2.0-1.0);

  // st = rotate(st, step(0.5, fract(cst.y*PI*0.5)) == 0.0 ? t : -t);
  // st = cart2polar(st*2.0-1.0);

   float arch = pointedArchSDF(fract(st*PI*2.0));
  float s1 = fill(arch, 1.0, 0.01);
  float ss1 = stroke(arch, 1.0, 0.05, 0.01);

   float arch2 = pointedArchSDF(get_st(fract(st*PI), vec2(2.0)));
  float s2 = fill(arch2, 1.0, 0.01);
  float ss2 = stroke(arch2, 1.0, 0.1, 0.01);


  vec3 color = rcolor(1.0-(g2));
  color = PINK;
  // color = mix(color, rcolor(st+ast+t), a1);
  // color = mix(color, YELLOW, s2);
  color = mix(color, YELLOW, a1*cnoise(st*ast+t)*1.0);
  color = mix(color, BLUE*2.0, a1*cnoise(ast)*0.5);

  // color = mix(color, COL1*0.5, a1*0.5);
 

  gl_FragColor = vec4(color, 1.0);


}