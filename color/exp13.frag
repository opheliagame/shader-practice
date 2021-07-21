#ifdef GL_ES
precision mediump float;
#endif

#define DPINK     vec3(0.98, 0.73, 0.73)
#define LPINK     vec3(0.97, 0.90, 0.90)
#define GREY      vec3(0.52, 0.50, 0.47)
#define WHITE     vec3(1.00, 1.00, 1.00)

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/sdf/triSDF.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/space/rotate.glsl";
#include "../lygia/space/ratio.glsl";
#include "../lygia/color/blend.glsl";

float getArch(vec2 st, vec2 size, float blur) {
  float rect = fill(rectSDF(st, size), 1.0, blur);  
  float circ = fill(circleSDF((st+vec2(0.0, -size.y/2.0))), size.x, blur*size.x);
  return rect+circ - rect*circ;
}

float makeArch (vec2 st, vec2 tilt, vec2 size, float blur) {
  float outer = getArch(st, size, blur);
  float inner = getArch(st+tilt, size, blur);
  return outer-inner + outer*inner*0.5;
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/2.0;

  vec3 c = LPINK;
  int n = 7;
  float s = float(n);

  // for(int i = 1; i <= n; i++) {
  for(int i = n; i > 0; i--) {
    float v = float(i);
    vec2 size = vec2(v)*1.0/s*0.5;
    vec2 tilt = vec2(0.1, 0.05) * size*0.8;
    // tilt = size*0.08;
    vec2 pos = vec2(0.0, 0.1) + tilt*0.5*-1.0;
    // pos = vec2(random(cos(st)));
    float outer = getArch(st+pos, size, 0.01);
    float outer1 = getArch(st+pos, size, 0.2);
    float inner = getArch(st+pos+tilt, size, 0.01);
    float inner2 = getArch(st+pos+tilt, size, 0.1);
    float inner1 = getArch(st+pos+vec2(0.05, sin(t)*0.05), size, 0.2);

    vec2 mod_st = st;
    // mod_st += vec2(0.0, st.x*0.5);
    mod_st += vec2(0.0, 0.25*v/2.0);
    mod_st = rotate(mod_st, radians(-90.0), vec2(0.5));
    float shadow = fill(rectSDF(mod_st, vec2(0.05, size.y)), 1.0, 0.01);
    // shadow = outer+st.y*0.5;
    shadow = smoothstep(0.0, 1.0, outer1*st.x*st.y);
    float shadow1 = outer*(st.y*st.x*abs(sin(t)));
    float shadow2 = inner1*(st.y*st.x*abs(sin(t)));
    float shadow3 = st.y*st.x*abs(sin(t));
    // float shadow4 = (st+vec2(st.x, 0.0)).y;

    // c = mix(c, LPINK, inner-outer - inner*outer);
    // c = mix(c, 1.0-WHITE, shadow1);
    c = mix(c, LPINK, inner);
    c = mix(c, DPINK, inner*outer);
    // c = mix(c, LPINK, shadow1);

    // c = mix(c, 1.0-WHITE, shadow2);
    // c = mix(c, DPINK, outer);
    // c = mix(c, LPINK, inner*outer);
  }


  gl_FragColor = vec4(DPINK, 1.0);
  gl_FragColor = vec4(c, 1.0);
}