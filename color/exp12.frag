#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define YELLOW     vec3(0.96, 0.87, 0.58)
#define BLUE       vec3(0.72, 0.80, 0.90)     
#define WHITE      vec3(1.00, 1.00, 1.00)

#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/sdf/triSDF.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/generative/cnoise.glsl";

float getDoor(vec2 mod_st, vec2 dsize, float blur) {
  float diffy = (dsize.y)/2.0;
  diffy = 0.5-dsize.y;
  float diffx = (dsize.x);
  float sdf1 = rectSDF(mod_st+vec2(0.0, diffy), dsize);
  float sdf2 = circleSDF(mod_st+vec2(0.0, diffy), 
              // vec2(0.5, (1.0-dsize.y)/2.0));
              vec2(0.5, 0.5+dsize.y/2.0));
  float sdf = sdf1+sdf2;
  float door1 = fill(sdf1, 1.0, blur*5.0);
  float door2 = fill(sdf2, dsize.x, blur);
  // float door3 = fill(circleSDF(mod_st, vec2(0.5, 0.0)), dsize.x, 0.01);
  float door = door1 + door2 - door1*door2;
  // door = smoothstep(0.0, 1.0, door);
  return door;
}


void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  float t = u_time/10.0;

  // float door1 = fill(rectSDF(st+vec2(0.0, 0.05), vec2(0.45, 0.5)), 1.0, 0.001);
  // float door2 = fill(circleSDF(st+vec2(0.0, -0.45/2.0+0.05), vec2(0.5)), 0.45, 0.005);
  // float door = door1 + door2 - door1*door2;

  float door = getDoor(st, vec2(0.45, 0.4), 0.001);
  float d2 = getDoor(st+vec2(0.1, 0.0), vec2(0.45, 0.4), 0.001);
  door = door - (door*d2);
  // float d1 = getDoor(st, vec2(0.45*1.5, 0.4*1.0), 0.1);
  // float d2 = getDoor(st, vec2(0.45*1.5, 0.4*1.0), 0.2);
  // float d3 = getDoor(st, vec2(0.45, 0.4), 0.3);
  // float d = d1+d2;

  float slope = 1.0;
  vec2 mod_st = vec2(st.x, st.y);
  if (st.y > 0.5) mod_st.y = 0.0;
  // mod_st.x = min(max(st.x, abs(0.5-st.y)), st.y);
  mod_st.x += st.y*slope - slope/2.0;
  // mod_st.y = fract(mod_st.y+0.5);
  // float shadow = fill(triSDF(mod_st), 1.0, 0.01);
  float shadow1 = fill(rectSDF(mod_st, vec2(0.5)), 1.0, 0.01);
  float shadow2 = fill(rectSDF(vec2(st.x+1.0-st.y*slope - slope/2.0, mod_st.y), 
                  vec2(0.5)), 1.0, 0.01);
  float shadow = shadow1 + shadow2 - shadow1*shadow2;
  float circ1 = fill(circleSDF(mod_st, vec2(0.5)), 1.0, 0.01);

  float flip = step(0.5, st.y) == 0.0 ? 0.0 : 1.0;
  float mod1 = max(abs(st.x+st.y*flip + (1.0-st.y)*(1.0-flip)), st.x);
  float mod2 = max(abs(st.x+st.y*(1.0-flip) + (1.0-st.y)*(flip)), st.x);
  vec2 mod_st2 = vec2(mod1 - 0.5, st.y);
  mod_st2 = vec2( mod1 - 0.5, st.y);
  shadow = fill(rectSDF(mod_st2, vec2(0.5)), 1.0, 0.01);
  shadow = fill(triSDF(vec2(st.x, st.y*2.05+0.2)), 1.0, 0.01);

  vec2 st4 = vec2((st.y+mix(1.0, -1.0, st.x*3.0)), st.y);
  float rows = step(0.5, fract(st4.y*5.0)) == 0.0 ? 0.5 : 0.0;
  // shadow *= step(0.5, fract(st4.x*2.0+rows));
  // shadow = fract(shadow);

  float shear = (st.y)*1.0*(sin(t*10.0));
  float s = 2.6;
  vec2 st3 = vec2(st.x*s - 0.8, (1.0-st.y*5.0)*0.5);
  // st3 = st;
  st3.x += st3.y*1.8*sin(t*1.0);
  float shadow3 = fill(triSDF(st3), 1.0, 0.01);

  vec3 c = mix(YELLOW, BLUE, shadow);
  c = YELLOW;
  c = mix(c, WHITE, door);
  c = mix(c, YELLOW*2.0, cnoise(vec2(st.y*2.0)+t));
  // c = mix(c, WHITE, d1);
  c = mix(c, YELLOW, d2*door);
  c = mix(c, WHITE, shadow3*shadow);

  gl_FragColor = vec4(YELLOW, 1.0);
  gl_FragColor = vec4(c, 1.0);
}