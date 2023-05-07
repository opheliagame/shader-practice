#version 330
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926538
#define BLACK vec3(0.0)
#define WHITE vec3(1.0)
#define BLUE vec3(125, 249, 255)/255.0
#define PINK vec3(246, 91, 227)/255.0
#define GREEN vec3(204, 255, 102)/255.
#define PURPLE vec3(191, 0, 255)/255.0

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/space/ratio.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/generative/gnoise.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/generative/fbm.glsl";
#include "../lygia/generative/snoise.glsl";

void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  st = ratio(st, u_resolution);
  st.y = st.y * 2. - 1.;
  float t = u_time/5.0;
  
  vec2 st3 = floor(st*5.0)/5.0;


  vec2 st1 = st + vec2(0.0, 0.0);
  st1.y /= (1.0-st.x+0.2);
  // st1.y += 0.2;

  vec2 st2 = floor(st1*4.0)/4.0;

  // float r3 = gnoise(st2.x + random(st2.x) + (t));

  vec2 st4 = st + vec2(0.0, 0.0);
  bool b1 = (st.x+st.y-0.2) < 1.0 && (-st.x+st.y+0.2) > -1.0;

  st4.y /= b1 ? (1.0-st.x+0.2) : (st.x+0.2);
  float m4 = random(floor(vec2(st4.x * 2.0, st4.y*2.0))/2.0 );

  vec2 st7 = st + vec2(0.0, 0.0);
  st7.y /= (st.x+st.y-0.2) < 1.0 && (-st.x+st.y+0.2) > -1.0 ? (1.0-st.x+m4) : (st.x+m4);

  vec2 st6 = floor(st4 * 30.0)/30.0;
  float m1 = random(floor(st4));
  
  float r1 = random(st6.y) < 0.5 ? -t : t;
  float r2 = b1 ? -t : t;
  vec2 st5 = floor(vec2(st4.x+r1+t, st4.y) * 20.0)/20.0;
  float m3 = random(st5.y) ;
  float m2 = gnoise( st5.x + m3 + r2) + r2;
  // float m2 = gnoise( st4.x + st4.y + r1 + m3  );
  

  // m1 = gnoise(st4.y+t);

  // st4.x += m1;

  float s = fill(rectSDF((st1 + vec2(0.0, 0.4)), vec2(1.0, 0.75)), 1.0, 0.01);

  float s1 = gnoise(st4.y*50.0);
  float s2 = random(st5.y);

  vec3 color = WHITE;
  color = mix(GREEN, PINK*1.2, fract(  (m2)));
  color = mix(color, BLUE, s1 );

  // color = mix(BLUE, PURPLE, random(floor(vec2(st4.x * 10.0, st4.y*10.0))/10.0));



  gl_FragColor = vec4(WHITE, 1.0);
  gl_FragColor = vec4(color, 1.0);

}