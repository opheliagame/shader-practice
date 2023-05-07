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
  // st = st*2.0-1.0;
  float t = u_time/1.0;

  float n1 = gnoise(random(rotate(st, t).x*rotate(st, t*2.0).y));

  // float mod1 = floor(st*5.0);

  int beat_change_index = int(mod(fract(t*7.0/4.0)*5.0, 5.0));

  vec3 colors[] = {PINK, YELLOW, BLUE};
  vec3 c1 = colors[beat_change_index];


  vec2 mod1 = cart2polar(st);
  float s1 = stroke(starSDF(fract(cart2polar(st*2.0-1.0)), int(n1*12.0), gnoise(t)), 1.0, abs(sin(t)), 0.1);
  // float a1 = stroke(pointedArchSDF(fract(rotate(st, beat_change_index*random(mod1.y))*5.0)), 1.0, 0.1);

  vec2 ast = get_st(
    // fract(get_st((mod1*0.5), vec2(1.0)*((gnoise(mod1.y*1.0+t*beat1))))), 
    fract(get_st((mod1*0.5), vec2(1.0))), 
    vec2(sin(st.x+t)*2.0)
  );

  vec2 ast2 = get_st(
    // fract(get_st((mod1*0.5), vec2(1.0)*((gnoise(mod1.y*1.0+t*beat1))))), 
    fract(get_st((cart2polar(st*2.0-1.0)*0.5), vec2(1.0))), 
    vec2(sin(st.x+t)*2.0)
  );

  vec2 ast3 = get_st(
    // fract(get_st((mod1*0.5), vec2(1.0)*((gnoise(mod1.y*1.0+t*beat1))))), 
    fract(get_st((cart2polar(st*2.0-1.0)*0.5), vec2(1.0))), 
    vec2(sin(st.x+t)*2.0)
  );


  float a1 = pointedArchSDF(get_st(ast, vec2(2.0)));
  float a2 = pointedArchSDF(get_st(ast2, vec2(2.0)));
  // float a3 = stroke(pointedArchSDF(get_st(ast3, vec2(2.0))), 1.0, 0.1, 0.1);
  // float a2 = pointedArchSDF(get_st_old(fract(ast2), vec2(2.0)));
  // float a3 = pointedArchSDF(get_st(fract(st*PI), vec2(2.0)));

  


  vec3 color = BLACK;
  // color = mix(color, c1, a2);
  color = mix(color, WHITE, fill(a2, 1.0, 0.01));
  // color = mix(color, WHITE*0.4, st.x);

 
  
  gl_FragColor = vec4(color, 1.0);


}