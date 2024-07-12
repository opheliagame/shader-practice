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

attribute vec2 uvNorm;
attribute vec2 uv;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_gNoiseSpeed;
uniform vec2 u_gNoiseFreq;
uniform float u_vIncline;
uniform float u_vOffsetBottom;
uniform float u_vOffsetTop;
uniform float u_vNoiseAmp;
uniform vec2 u_vNoiseFreq;
uniform float u_vNoiseFlow;
uniform float u_vNoiseSpeed;
uniform float u_vNoiseSeed;


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
  
  float time = u_time * u_gNoiseSpeed;
  vec2 noiseCoord = u_resolution * uvNorm * u_gNoiseFreq;
  vec2 st = 1.0-uvNorm;

  float tilt = u_resolution.y / 2.0 * uvNorm.y;

  float incline = u_resolution.x * uvNorm.x / 2.0 * u_vIncline;

  float offset = u_resolution.x / 2.0 * u_vIncline * mix(u_vOffsetBottom, u_vOffsetTop, uv.y);

  float noise = snoise(
    vec3(
      noiseCoord.x * u_vNoiseFreq.x + time * u_vNoiseFlow,
      noiseCoord.y * u_vNoiseFreq.y,
      time * u_vNoiseSpeed + u_vNoiseSeed
    )
  ) * u_vNoiseAmp;

  noise *= 1.0-pow(abs(uvNorm.y), 2.0);

  noise = max(0.0, noise);

  vec3 pos = vec3(position.x, position.y + tilt + incline + noise - offset, position.z);

  

  gl_Position = vec4(pos, 1.0);
}