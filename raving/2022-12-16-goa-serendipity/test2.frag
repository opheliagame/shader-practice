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
uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;

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




void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  st = ratio(st, u_resolution);
  // st = st*2.0-1.0;
  float t = u_time/1.0;


  float a = pointedArchSDF(st);
  


  vec4 tex = texture2D(u_tex0, st);
  float n1 = gnoise(tex.x*tex.y+sin(st.x+t));
 
  vec3 color = WHITE;
  color = mix(WHITE, BLACK, n1);

  
  gl_FragColor = vec4(color, 1.0);


}