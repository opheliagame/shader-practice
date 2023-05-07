#version 330
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926538
#define BLACK vec3(0.0)
#define WHITE vec3(1.0)

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;
uniform sampler2D u_tex1;
uniform vec2 u_tex1Resolution;
uniform sampler2D u_tex2;
uniform vec2 u_tex2Resolution;

#include "../../lygia/space/ratio.glsl";
#include "../../lygia/math/map.glsl";

void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/2.0;
  
  vec2 st_mod00 = vec2(
    st.x < 0.5 ? 1.0-st.x : st.x, 
    st.y + sin(floor(st.x*10.0)*10.0+t));
  vec4 i00 = texture2D(u_tex0, st_mod00);

  vec2 st_mod01 = ratio(st, u_tex1Resolution.yx);
  st_mod01 = st_mod01*0.3 + 0.3 + vec2(0.0, 0.0);
  // st_mod01 = floor(st_mod01*500.0)/500.0;
  st_mod01.x += sin(floor(st.y * map(st.y, 0.0, 2.5, 20.0, 1.0))+t);
  vec4 i01 = texture2D(u_tex1, st_mod01);

  vec2 st_mod02 = ratio(st, u_tex2Resolution.yx);
  // st_mod02.y += (st.x < 0.5 ? 0.33 : 0.0);
  st_mod02.x = st_mod02.x < 0.5 ? 1.0-st_mod02.x : st_mod02.x;
  st_mod02 = st_mod02*0.3 + vec2(0.3, 0.3);
  float w = map(st_mod02.y, -1.0, 1.0, 5.0, 50.0);
  w = 10.1;
  float dx = step(fract(st_mod02.y*w*0.5), 0.5) == 0.0 ? -1.0 : 1.0;
  float dy = step(st.x, 0.5) == 0.0 ? -1.0 : 1.0;
  float d = dx;
  float my = sin(t*5.0) < 0.0 ? 0.0 : 1.0;
  // float 
  st_mod02 = vec2(
    // st_mod02.x + sin(floor(st_mod02.y*w)/w - t*0.2),
    // st_mod02.x + ((sin(t*d)*0.1)),
    st_mod02.x,// + (step(fract(st_mod02.y*w*0.5), 0.5) == 0.0 ? 0.5*my : 0.5*(1.0-my)),
    st_mod02.y + (st.x > 0.5 ? 0.1*my : 0.1*(1.0-my))
  );
 

  vec4 i02 = texture2D(u_tex2, st_mod02);

  gl_FragColor = vec4(i02);

}