#ifdef GL_ES
precision mediump float;
#endif

#define WHITE     vec3(0.9451, 0.9451, 0.9451)
#define GREY      vec3(0.5333, 0.5333, 0.5333)

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/space/ratio.glsl";

void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  st = ratio(st, u_resolution);

  vec2 slope = vec2(0.0, 0.3);
  vec2 props = vec2(0.4, 0.5);
  vec2 size = vec2(6.0, 6.0);
  vec2 mod_st = st*size;
  mod_st.y += mod_st.x*slope.y;
  vec2 st2 = st*size;
  st2.y += floor(st2.x)*slope.y;
  st2.y += 0.37;

  vec2 sh_st = vec2(1.0-step(0.2, fract(mod_st.x))*mod_st.x, 
                step(0.5, fract(mod_st.y+0.1))*mod_st.y);
  sh_st = vec2(mod_st.x - 0.1, mod_st.y + 0.1);
  vec2 st3 = vec2(st2.x - 0.1, st2.y);

  float win1 = fill(rectSDF(fract(mod_st), vec2(0.8)), 1.0, 0.01);
  float win2 = fill(rectSDF(fract(st2+vec2(0.0, -0.12)), 
              vec2(0.8, 1.0-fract(mod_st.y)*0.25)), 1.0, 0.01);
  float win3 = fill(rectSDF(fract(st2+vec2(0.0, -0.1)), 
              vec2(0.8, 0.8)), 1.0, 0.01);
  float shadow1 = pow((1.0-fract(st3.x)*0.5), 2.0) + pow(fract(st3.y)*0.8, 2.0);
  shadow1 = pow(shadow1, 4.0);
  shadow1 = smoothstep(-2.0, 4.0, shadow1);
  float shadow2 = pow((1.0-fract(sh_st.x))*1.0, 2.0) + pow(fract(sh_st.y), 2.0);

  float c1 = win1*shadow1*win2*1.0;
  float c2 = (1.0-fract(st3.y))*(win1)-(win2*win3);

  vec3 sc = mix(WHITE, GREY, 0.5);
  vec3 c = mix(WHITE, 1.0-WHITE, win1*(1.0));
  c = WHITE;
  // c = mix(WHITE, 1.0-WHITE, win1*(1.0));
  c = mix(WHITE, WHITE, win1*(1.0));
  // c = mix(c, WHITE, (win2*win1));
  // c = mix(c, sc, step(0.8, fract(mod_st.x))*c1*c2);
  c = mix(c, sc*1.5, smoothstep(0.9-0.1, 0.9+0.1, fract(mod_st.x))*fract(mod_st.x)*(1.0-st.x*0.5));
  // c = mix(c, 1.0-sc*0.2, fract(mod_st.x));
  c = mix(c, GREY*1.1, win1*shadow1*win2*(1.0-st.x*0.3));
  c = mix(c, GREY*1.1, (1.0-fract(st3.x))*1.2*(1.0-st.x*0.5)*(win1)-(win2*win3*win1)*(1.0-st.x*0.2));
  


  gl_FragColor = vec4(WHITE, 1.0);
  gl_FragColor = vec4(c, 0.9);
  // gl_FragColor = vec4(vec3(fract(mod_st.x)), 1.0);
}