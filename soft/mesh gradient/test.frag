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
uniform float u_gNoiseSpeed;
uniform vec2 u_gNoiseFreq;

#include "../../lygia/generative/random.glsl";
#include "../../lygia/generative/cnoise.glsl";
#include "../../lygia/generative/snoise.glsl";
#include "../../lygia/generative/gnoise.glsl";
#include "../../lygia/generative/pnoise.glsl";
#include "../../lygia/generative/fbm.glsl";
#include "../../lygia/space/cart2polar.glsl";
#include "../../lygia/space/rotate.glsl";
#include "../../lygia/space/ratio.glsl";
#include "../../lygia/sdf/lineSDF.glsl";
#include "../../lygia/draw/stroke.glsl";
#include "../../lygia/color/blend/difference.glsl";
#include "../../lygia/color/blend/glow.glsl";
#include "../../lygia/color/blend/add.glsl";


void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st = ratio(st, u_resolution);
  
  float time = u_time * u_gNoiseSpeed;
  vec2 noiseCoord = u_resolution * st * u_gNoiseFreq;
  st = 1.0-st;

  float tilt = u_resolution.y / 2.0 * st.y;

  vec3 color = PINK;


  gl_FragColor = vec4(color, 1.0);
}