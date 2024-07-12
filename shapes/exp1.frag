#version 330
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926538
#define BLACK vec3(0.0)
#define WHITE vec3(1.0)
#define PINK vec3(249/255.0,188/255.0,207/255.0)
#define BLUE vec3(101/255.0,153/255.0,229/255.0)
#define YELLOW vec3(248/255.0,233/255.0,8/255.0)
#define ORANGE vec3(255/255.0, 163/255.0, 51/255.0)

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/space/ratio.glsl";
#include "../lygia/space/cart2polar.glsl";
#include "../lygia/space/rotate.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/draw/stroke.glsl";
#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/sdf/raysSDF.glsl";
#include "../lygia/sdf/flowerSDF.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/generative/gnoise.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/generative/fbm.glsl";
#include "../lygia/generative/snoise.glsl";


float sdfLeaf(vec2 st, int N) {
  st = st * 2.0 - 1.0;
  vec2 p1 = vec2(-1.0, 0.0);
  vec2 p2 = vec2(1.0, 0.0);
  float c = (length(st + p1) * 0.8 + length(st + p2 + vec2(-0.2, 0.0)) * 1.0) / 1.8;

  // float a = atan(st.y, st.x);
  // float v = float(N) * 0.5;
  // return 1.0 - (abs(cos(a * v)) *  0.5 + 0.5) / (c*1.0);

  return c;
 
}

float parabola( float x, float k ){
    return pow( 4.0*x*(1.0-x), k );
}

float parabolaSDF(vec2 st) {
  float y = pow( 4.0*st.x*(1.0-st.x), 2.0 );

  return y - 4.0*(1.0-st.x)*st.x;
}

void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/2.0;
  
  // st = st * 2. - 1.;
  
  // st = cart2polar(st);

  vec2 st1 = floor(st * 4.0)/4.0;
  float r1 = cnoise(st1 + t);

  // st = fract(st * 4.0);
  // st = rotate(st, radians(r1*180.0));

  float c = sdfLeaf(st, 15);

  float f = fill(c, 1.0, 0.1);
  float s = stroke(c, 1.0, 0.05, 0.01);
  float f1 = fill(c, 1.0, 0.01);
  float f2 = stroke(circleSDF(st + vec2(0.2, 0.0)), 0.5, 0.1, 0.1);
  float f3 = fill(raysSDF(st, 9), 1.0, 0.1);
  float f4 = fill(parabolaSDF(st), 1.0, 0.1);

  vec3 color = mix(ORANGE, ORANGE, s);
  // color = mix(color, PINK, f);
  // color = mix(color, ORANGE, f2);

  color = mix(color, PINK, f1);


  gl_FragColor = vec4(color, 1.0);


}