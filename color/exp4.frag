#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define BLACK     vec3(0.0, 0.0, 0.0)
#define WHITE     vec3(1.0, 1.0, 1.0)

#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/draw/rect.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/draw/aastep.glsl";
#include "../lygia/animation/easing.glsl";

float gate(in vec2 st, float size, float i) {
  vec2 props = vec2(2.0, 3.0);

  vec2 s = props*(0.6-size*0.01, 0.5-size);
  s = props*(0.8-size);
  float r1 = fill(rectSDF(st+vec2(size*0.4, size*0.3), s), 0.6, 0.001);
  float r1_mod = smoothstep(0.4, 0.6, r1);
  return r1;
}

float gates(in vec2 st, float size, float diff) {

  float g = 0.0;
  for(float i = 0.0; i < 24.0; i+=2.0) {
    float g1 =     gate(st, diff*(i), i);
    float g2 = 1.0-gate(st, diff*(i+1.0), (i+1.0));

    g += (g1*g2);
  }

  return g;
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  float t = (u_time/2.0);

  vec2 mod_st = st*vec2(1.2, 1.0);
  // mod_st.y -= fract(mod_st.x*0.2+t);

  // vec2 mod_st2 = vec2(st.x/22.0, st.y);
  vec2 mod_st2 = st;
  mod_st2.y *= 0.5;
  mod_st2.y += 0.25+0.125;
  mod_st2.x *= (1.0-st.y)*0.5;
  mod_st2.x *= 5.0;
  // mod_st2.x = st.y*1.01; 
  // mod_st2.x = clamp(st.x, (1.0-st.y)*0.09, mod_st2.y*0.2);
  // mod_st2.x += 1.0;

  // mod_st2.y *= 5.0;
  // if(st.x < 3.0/22.0) mod_st2.x += (1.0-mod_st2.y)*0.2;
  // else if (st.x < 0.5) mod_st2.x -= mod_st2.y*0.5;
  // mod_st2.y += 0.25;
  // mod_st2.x = clamp(st.x, 0.1, 0.5); 
  // mod_st2.y = clamp(st.y, 0.5, 1.0);
  // mod_st2.x += mod_st2.x * 2.0;
  // mod_st2 *= 5.0;
  // mod_st2 = fract(mod_st2);
  float d2 = fill(rectSDF(mod_st2, vec2(0.5)), 0.6, 0.01);

  vec2 mod_st3 = st + vec2(0.0, st.x*0.8);
  mod_st3 *= 10.0;
  mod_st3 = fract(mod_st3);


  float g = gates(mod_st, 0.01, 0.05);

  // float r = fill(rectSDF(st, vec2(0.5)), 1.0, 0.01);
  vec3 a = mix(WHITE, BLACK, g);
  vec3 b = mix(BLACK, WHITE, g);
  float flip = step(0.5, fract(t*0.5));
  vec3 c = mix(b, a, flip);
  // c = fract(c);
  // c *= d1;
  vec3 c1 = mix(WHITE, BLACK, smoothstep(0.45, 0.5, mod_st3.y));
  vec3 c2 = mix(WHITE, BLACK, smoothstep(0.5, 0.5001, fract(st*16.0).y));


  // if (st.x+0.08 > (1.0-st.y*2.4)*0.6) c2 = BLACK;
  // if (st.x-0.08 < (st.y*2.4)*0.1) c2 = BLACK;

  c2 *= 1.0-aastep((1.0-st.y*2.4)*0.6, st.x+0.08);
  c2 *= aastep((st.y*2.4)*0.1, st.x-0.081);

  // c2 = mix(c, WHITE, fract(t));

  // c = mix(c, BLACK, c2.x);
  // c -= (1.0-c-c2);


  float d1 = mod_st2.y;
  // c = vec3(mod_st.x, mod_st2.y, 0.0);
  // c = vec3(d1);
  // c = mix(WHITE, BLACK, mod_st3.y);
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  gl_FragColor = vec4(c, 1.0);
}