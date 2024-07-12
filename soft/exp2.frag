#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926538
#define BLACK vec3(0.0)
#define WHITE vec3(1.0)
#define GREEN vec3(9, 158, 86)/255.0
#define ORANGE vec3(255, 128, 59)/255.0
#define PINK vec3(	255, 147, 142)/255.0
#define BLUE vec3(2, 8, 135)/255.0
#define YELLOW vec3(251/255.0,209/255.0,100/255.0)
#define RED vec3(255, 62, 65)/255.0

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

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/1.0;

  float move = cnoise(st)*0.1;
  vec2 st2 = vec2(st.x, st.y);

  float r1 = pnoise(st, st+random(floor(st*5.0+floor(t)))*1.0)*5.0;

  st = st*12.0;
  


  // vec2 n = mix(vec2(random(i)), vec2(random(i+1.0)), smoothstep(0.0, 1.0, f));
  float n = gnoise((st.x)+gnoise((st2.y*2.0)+t));
  float n1 = gnoise((st.y)+t);
  // n += move;

  vec2 st1 = vec2(n, n1);

  float r = mix(n, n1, smoothstep(0., 1., n1));
  r = smoothstep(st2.x, st2.y, n1);


  vec3 color = mix(BLUE, WHITE, r);
  // color = mix(color, ORANGE, r);

  gl_FragColor = vec4(color, 1.0);
}