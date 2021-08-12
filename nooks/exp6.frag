#ifdef GL_ES
precision mediump float;
#endif

#define WHITE     vec3(1.0, 1.0, 1.0)
#define GREY      vec3(0.6745, 0.6745, 0.6745)
#define BLACK      vec3(0.0)
#define RED        vec3(1.0, 0.0, 0.0)

#define grad(x) length(vec2(dFdx(x),dFdy(x)))
#define Nyquist(w,c) mix(.5, c, clamp((.5-BIAS-(w))/.25/SPREAD,0.,1.) )
#define BIAS -.0  // < 0: prefer a bit of aliasing to blur 
#define SPREAD 1. // < 1: transition more brutal 

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/space/ratio.glsl";
#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/generative/fbm.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/math/map.glsl";

float archSDF (vec2 st, vec2 s) {
  float c = 0.0;
  st = st * 2.0 - 1.0;
  float x = min(s.x, max(-st.x, st.x));
  float y = min(s.y, max(-st.y, st.y));
  float p = 1.0;
  c = pow(s.x, 0.5) - min(pow(( x+s.x) * p, 0.5), pow((-x+s.x) * p, 0.5)) + 
      pow(s.y, 0.5) - min(pow(( y+s.y) * p, 0.5), pow((-y+s.y) * p, 0.5));  
  return c;
}

float windowShape (vec2 st, vec2 s, float blur) {
  float arch = fill(archSDF(st, s), 0.5, blur);
  float sx = st.x*2.0-1.0 < 0.0 ? (st.x)-pow(s.x, 0.5) : (st.x)-1.0+pow(s.x, 0.5);
  float rect = fill(rectSDF(st+vec2(0.0, s.y/2.0), vec2(s.x, s.y)), 1.0, blur);
  return arch+rect-arch*rect ;
}


void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st = ratio(st, u_resolution);

  vec2 size = vec2(5.0, 11.5);
  vec2 st1 = st;
  st1.y += 0.15;
  st1.y /= (1.0-st.x)*1.5+3.0;
  st1.x *= st.x*0.5+0.4;
  st1 *= size;

  vec2 norm_st1 = vec2(fract(st1.x), fract(st1.y));

  float r1 = fill(rectSDF(fract(st1), vec2(0.5)), 1.0, 0.01);
  float w1 = windowShape(norm_st1, vec2(0.5, 0.48), 
              map(st1.x*st1.y, 0.0, size.x*size.y, 0.02, 0.05));

  float mod1 = floor(st1.y)*0.05 + 0.0;
  float mod2 = (size.x-floor(size.x-st1.x))*0.05;
  float w2 = windowShape(fract(st1)+fract(vec2(mod2, mod1)), vec2(0.4), 
              map(st1.x*st1.y, 0.0, size.x*size.y, 0.02, 0.05));

  vec2 shadow_st = fract(st1)+fract(vec2(mod2, mod1));
  shadow_st = shadow_st*2.0-1.0;
  // shadow_st = fract(st1);
  float shadow1 = pow(shadow_st.x, 2.0) + 
                  pow(shadow_st.y, 2.0);
  float shadow2 = 1.0-pow((1.0-st.x)*0.5, 0.5);
  float shadow3 = pow(shadow_st.x, 1.2);

  float horizon = 1.0-smoothstep(0.25-0.001, 0.25+0.001, st1.y/size.y); 
  float cloud = fbm(st*3.0) * cnoise(st*0.5);


  vec3 c = mix(GREY, BLACK, horizon*w1);
  c = mix(c, WHITE, shadow2*horizon*(1.0-w1)+shadow2*horizon*w2*w1);
  c = mix(c, GREY*1.5, horizon*w2*w1);
  c = mix(c, GREY, shadow3*horizon*w1);
  c = mix(c, WHITE*0.6, shadow1*horizon*w2*w1);
  c = mix(c, WHITE, (1.0-horizon)*cloud);

  // float testw = windowShape(st, vec2(0.5), 0.01);
  // float testsdf = archSDF(st, vec2(0.5));
  // float testr = fill(rectSDF(st+vec2(0.0, 0.25), vec2(0.5)), 1.0, 0.01);
  // float testr1 = fill(rectSDF(st+vec2(pow(0.5, 0.5)/12.0, 0.25), vec2(0.25, 0.5)), 1.0, 0.01);
  // c = mix(WHITE, BLACK, testw);
  // c = mix(c, RED, testr1);

  gl_FragColor = vec4(WHITE, 1.0);
  gl_FragColor = vec4(c, 1.0);
  // gl_FragColor = vec4(vec3(aafract(st1.y)), 1.0);
}