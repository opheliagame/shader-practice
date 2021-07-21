#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define BLACK      vec3(0.0, 0.0, 0.0)
#define WHITE      vec3(0.7608, 0.7608, 0.7608)
// #define RED        vec3(1.0, 0.3, 0.3)
#define RED        vec3(1.0, 0.1, 0.1)

#include "../lygia/sdf/raysSDF.glsl";
#include "../lygia/sdf/triSDF.glsl";
#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/draw/stroke.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/space/cart2polar.glsl";

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  float t = u_time/2.0;

  // vec2 mod_st = st + vec2(0.0, pow(abs(st.x-0.5)*5.0, 6.0));
  // vec2 mod_st = st * vec2(1.0, pow((1.0-abs(st.x-0.5)*2.0)*0.8, 1.7));
  vec2 mod_st = st * vec2(1.0, 1.0-tan(abs(0.5-st.x))*2.2);  // * sin(u_time)
  mod_st.y += 0.25;

  float r1 = fill(triSDF(mod_st), 0.8, 0.01);
  float r3 = stroke(triSDF(mod_st), 0.8, 0.006, 0.005);
  float r2 = 1.0-fill(triSDF(mod_st), 0.6, 0.01);
  float r4 = stroke(triSDF(mod_st), 0.6, 0.006, 0.005);
  float r = r1*r2;



  vec2 st2 = vec2(distance(st*2.0-1.0, vec2(0.0)), atan(st.y/st.x));
  float n = cnoise(vec2(mod_st+st)*10.0+t);
  // n = smoothstep(r-0.05, r+0.05, n);


  float hill = smoothstep(0.18-0.01, 0.18+0.01, cnoise(st+5.65));
  float hill_s = smoothstep(0.18-0.003, 0.18, cnoise(st+5.65)) - smoothstep(0.18, 0.18+0.003, cnoise(st+5.65));
  vec2 moon_p = st + vec2(-0.38, -0.4);
  hill_s *= sin(distance(st, moon_p) + t + st.x);
  r3 *= sin(distance(st, moon_p) +  t + st.x);
  r4 *= sin(distance(st, moon_p) +  t + st.x);

  float moon = fill(circleSDF(moon_p), 0.16, 0.05);
  float moon_s = stroke(circleSDF(moon_p), 0.16, 0.1, 0.3);
  vec3 c = mix(RED, BLACK, hill);

  vec3 c1 = mix(BLACK, RED, abs(sin(t+mod_st.y)));
  vec3 a = mix(c, BLACK, 1.0-n);

  // c = mix(c, BLACK, r);
  // c = mix(c1, c, 1.0-r);
  // vec3 b = mix(BLACK, c, cnoise(vec2(st.y, st.x*0.25)*5.0 + t)*st.x);
  c = mix(c, BLACK, 1.0-n);
  c = mix(c, RED, moon);
  c = mix(c, WHITE, r+hill_s - ((r)*hill_s)*2.0);
  // c = mix(c, WHITE, hill_s);
  c = mix(c, BLACK, r);
  // c = mix(c, RED, r4+hill_s - (r4*hill_s)*2.0);
  // c = mix(c, RED, r4) + mix(c, RED, r3) + mix(c, RED, hill_s);
  c = mix(c, WHITE, moon_s);
  c = mix(c, WHITE, r3 + r4);
  // c = mix(c, RED, hill_s);


  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  gl_FragColor = vec4(c, 1.0);
}