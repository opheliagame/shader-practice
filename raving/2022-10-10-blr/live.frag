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
#include "../../lygia/sdf/rectSDF.glsl";
#include "../../lygia/sdf/triSDF.glsl";
#include "../../lygia/sdf/starSDF.glsl";
// #include "../../lygia/space/ratio.glsl";

#include "./lib.frag";


float[] time_sig = {
  0.0, 0.4, 0.8, 1.0, 
};

float[] beat = {
  1.0, -1.0, 1.0, 1.0
};


void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/1.0;
  st = st*2.0-1.0;

  int beat_change_index = int(mod(fract(t*1.0/6.0)*3.0, 3.0));

  float g1 = starSDF(fract(st*1.0), beat_change_index+1, beat_change_index+1);

  vec2 mod1 = cart2polar(st);
  // vec2 mod1 = cart2polar(st );
  vec2 uv = cart2polar(st*2.0-1.0);

  
   float beat1 = 
    beat_change_index == 0 ? 1.0 :
    beat_change_index == 1 ? 2.0 :
    // random(floor(st*4.0));
    4.0;

  vec2 ast = get_st(
    // fract(get_st((mod1*0.5), vec2(1.0)*((gnoise(mod1.y*1.0+t*beat1))))), 
    fract(get_st((mod1*0.5), vec2(1.0))), 
    vec2(sin(st.x+t)*2.0+beat1)
  );

    vec2 ast2 = get_st(
    fract(st*beat1), 
    // fract(get_st((mod1*0.5), vec2(1.0))), 
    vec2(sin(st.x+t)*2.0+beat1)
  );

// beat
  float beat = 
    beat_change_index == 0 ? random(floor(ast*2.0)) :
    beat_change_index == 1 ? sin(t) :
    random(floor(st*4.0));

  // st = rotate(st, step(0.5, fract(uv.y*PI*2.0)) == 0.0 ? t : -t);

  float circle = fill(circleSDF(fract(st*2.0)), 0.1, 0.001);
  float rect = fill(rectSDF(fract(st))*pointedArchSDF(st, vec2(1.0)), 0.1, 0.001);
  float tri = fill(triSDF(fract(st)), 0.1, 0.001);

  uv = rotate(uv, t*beat);

  float g2 = fill(starSDF(fract(st*2.0), beat_change_index+1, abs(sin(t))), 1.0, 0.01);


  float arch = pointedArchSDF(fract(ast*5.0));
  float a1 = pointedArchSDF(get_st(ast, vec2(1.0)));
  float a2 = pointedArchSDF(get_st_old(fract(ast2), vec2(2.0)));
  float a3 = pointedArchSDF(get_st(fract(st*PI), vec2(2.0)));
  // float arch = pointedArchSDF(fract(st*5.0));

  float f1 = fill(arch, 0.5, 0.2);
  float f2 = fill(a1, 1.0, 0.01);
  float f3 = fill(a2, 0.8, 0.01);

  float s1 = stroke(arch, 1.0, 0.02, 0.01);
  float s2 = stroke(a1, 0.8, 0.02, 0.01)
  *stroke(a1, 1.0, 0.02, 0.01)
  *stroke(a1, 0.4, 0.02, 0.01);

  float s3 = stroke(a1, 1.0, 0.1, 0.01);
  float s4 = stroke(a2, 0.4, 0.1, 0.01);

  float[] sample_shapes = {f2, f2};



  float[] shapes = {s1, s2, f2, s2};
  int index = int(mod(fract(t)*beat, beat));
  float ts1 = shapes[int(mod(index, 4))];
  float ts2 = shapes[int(mod(index-1, 4))];


  vec3 color = PINK;

  // color = mix(color, BLUE, arch);
  // color = mix(color, PINK, f1);
  color = mix(color, YELLOW, f3);
  // color = mix(color, YELLOW, g2);
  color = mix(color, BLUE, sample_shapes[beat_change_index]);
  // color = mix(color, YELLOW, f2);
  // color = mix(color, YELLOW, f2*cnoise(st*ast+t)*7.0);
  // color = mix(color, BLUE, s2*cnoise(uv+t));


  //  color = mix(color, YELLOW, a1*cnoise(st*ast+t)*1.0);
  // color = mix(color, BLUE*2.0, a1*cnoise(ast)*0.5);
  // color = mix(color, YELLOW, g2);

  // color = 
  
  gl_FragColor = vec4(color, 1.0);


}