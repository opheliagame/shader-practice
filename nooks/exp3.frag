#ifdef GL_ES
precision mediump float;
#endif

#define WHITE     vec3(0.8196, 0.8196, 0.8196)
#define GREY      vec3(0.3608, 0.3608, 0.3608)
#define RED       vec3(1.0, 0.0, 0.0)

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/space/ratio.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/generative/fbm.glsl";
#include "../lygia/math/map.glsl";

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/10.0;
  t = fract(t);
  t = 0.0;

  vec2 size = vec2(3.0, 13.0)*2.0;
  vec2 st1 = st;
  st1.y += 0.15;
  st1.y /= (1.0-st.x)*1.5+3.0;
  st1.x *= st.x*0.5+0.25;
  st1 *= size;
  st1 += vec2(random(floor(st1.y)), 0.0);

  vec2 move = vec2(t, 0.0);
  st1 += move;
  float win1 = fill(rectSDF(fract(st1), vec2(0.9)), 
                1.0, map(st.y*st.x, 0.0, 1.0, 0.02, 0.05));

  float mod1 = floor(st1.y)*0.05 + 0.0;
  float mod2 = (size.x-floor(size.x-st1.x))*0.05 + 0.00;
  float win2 = fill(rectSDF(fract(st1)+fract(vec2(mod2, mod1)), vec2(0.8)), 
                1.0, map(st.x, 0.0, 1.0, 0.04, 0.02));

  float horizon = 1.0-smoothstep(10.0-0.01, 10.0+0.01, st1.y);
  float cloud = fbm(st*2.0+vec2(t/10.0, 0.0))*cnoise(st*0.5+t);

  float shadow1 = 1.0-pow((1.0-st.x)*0.5, 0.5);
  float shadow2 = max(pow(fract(st1.x), mod1*mod1), 
                  pow(fract(st1.y), 1.0-mod2));
  float shadow3 = min(pow(fract(st1.x), mod1*mod1), 
                  pow(fract(st1.y), mod2));

  vec3 c = mix(GREY*1.5, WHITE, horizon);
  c = mix(c, WHITE*1.2, shadow1*horizon);
  c = mix(c, GREY*1.2, (win1-win1*win2)*horizon*shadow2);
  c = mix(c, WHITE*0.8, (win1*win2)*horizon*(1.0-shadow1)*(1.0-st.y));
  c = mix(c, 1.0-WHITE, cloud*(1.0-horizon));

  // c = mix(c, RED, win2);

  gl_FragColor = vec4(WHITE, 1.0);
  gl_FragColor = vec4(c, 1.0);
  // gl_FragColor = vec4(vec3(floor(st1.y)/size.y), 1.0);
}