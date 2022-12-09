#version 330
#ifdef GL_ES
precision mediump float;
#endif

#define WHITE vec3(1.0)
#define BLACK vec3(0.0)

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/space/ratio.glsl";
#include "../lygia/draw/fill.glsl";


float arch02(vec2 st) {
  st = abs(st * 2.0 - 1.0);
  // st.x = abs(st.x);
  vec2 center = vec2(0.5);

  float mod1 = tan((st.x+u_time)*4.0);
  float mod2 = tan((st.y)*4.0);
  
  float l1 = 1.0-smoothstep(mod1-0.5, mod1+0.5, st.y);

  float final = mod1+mod2;

  return final;
}

void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/10.0;

  st *= 3.0;
  st = fract(st);
  
  float a = arch02(st);
  float shape = fill(a, 1.0, 0.1);

  vec3 c = BLACK;
  // c = mix(c, WHITE, a);
    c = mix(c, WHITE, shape);


  gl_FragColor = vec4(vec3(c), 1.0);


}