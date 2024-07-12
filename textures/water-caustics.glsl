#version 330
#ifdef GL_ES
precision mediump float;
#endif

#define BLACK vec3(0.0)
#define WHITE vec3(1.0)
#define BLUE1 vec3(2, 120, 135)/255.0
#define BLUE2 vec3(2, 8, 80)/255.0

uniform float u_time;
uniform vec2 u_resolution;

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

vec2 random21( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

float voronoi(vec2 st, float scale) {
  st *= scale;

  vec2 i = floor(st);
  vec2 f = fract(st);

  float d = 1;
  for(int y = -1; y <= 1; y++) {
    for(int x = -1; x <= 1; x++) {
      vec2 neighbour = vec2(float(x), float(y));
      vec2 point = random21(i + neighbour);

      vec2 diff = neighbour + point - f;
      
      d = min(d, length(diff));
    }
  }
  return d;
}

float smooth_voronoi(vec2 st, float scale, float smoothness) {
  st *= scale;

  vec2 i = floor(st);
  vec2 f = fract(st);

  float d = 8;
  for(int y = -2; y <= 2; y++) {
    for(int x = -2; x <= 2; x++) {
      vec2 neighbour = vec2(float(x), float(y));
      vec2 point = random21(i + neighbour);

      vec2 diff = neighbour + point - f;

      float h = smoothstep(0.0, 1.0, 0.5 + 0.5 * (d-length(diff))/smoothness);    
      d = mix(d, length(diff), h) - smoothness * h * (1.0-h);
    }
  }
  return d;
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  float t = u_time/10.0;

  st = st * 2.0-1.0;

  // smooth
  st.x /= st.y*4.0 - 1.5;
  st = rotate(st, radians(45));
  st.x += t/2.0;

  st.y += fbm(st+t)*0.08;
  
  float scale = 6.0;
  float smoothness = 0.6;
  float v1 = voronoi(st, scale);
  float v2 = smooth_voronoi(st, scale, smoothness);
  float v = (v1-v2)*6.0;

  vec3 cb = BLUE1;
  cb.y += cnoise((st+vec2(0.2))*scale+t)*0.1;

  vec3 color = mix(cb, WHITE*0.8, v);

  gl_FragColor = vec4(color, 1.0);
}

