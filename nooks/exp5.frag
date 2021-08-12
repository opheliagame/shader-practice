#ifdef GL_ES
precision mediump float;
#endif

#define WHITE     vec3(0.8196, 0.8196, 0.8196)
#define GREY      vec3(0.4784, 0.4784, 0.4784)
#define BLACK      vec3(0.0)

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/space/ratio.glsl";
#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/space/rotate.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/generative/fbm.glsl";
#include "../lygia/math/map.glsl";

float door(vec2 st, vec2 size, float blur) {
  // float b = map(st.x, 0.0, 1.0, 0.8, 1.2);
  st = st + vec2(0.0, size.y/4.0);
  float rect = fill(rectSDF((st), size), 1.0, blur);
  float circle = fill(circleSDF((st-vec2(0.0, size.y/2.0))), size.x, blur);
  return rect+circle - rect*circle;
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/5.0;
  // t = 11.6;

  vec2 mod_st = st*2.0-1.0;
  vec2 size = vec2(12.0+1.0, 1.0);
  vec2 st1 = st*2.0-1.0 + vec2(0.0, 0.25);
  float flip = step(0.5, st.x) == 0.0 ? -1.0 : 1.0;
  float flipy = step(0.45, st.x) == 0.0 ? -1.0 : 1.0;
  float sidemod = flip == -1.0 ? 0.0 : 1.0;
  st1.y /= step(0.1*flip, st1.x) == sidemod ? (st1.x)*2.0 : 0.2;
  float middle = step(0.1*flip, st1.x) == sidemod ? 0.0 : 1.0;
  // st1.y += 2.0;
  st1 = (st1+1.0)/2.0;
  // st1 += 0.5;

  float side = fill(rectSDF((st1), vec2(1.2, 0.6)), 1.0, 0.01);
  float win1 = fill(rectSDF(fract(st1*size), vec2(0.8, 1.0)), 1.0, 0.01);
  float top = (1.0-side)*step(0.5-0.25/2.0, st.y);
  float bottom = (1.0-side)*(1.0-step(0.5-0.25/2.0, st.y));
  middle *= side;

  float cloud = fbm(st*2.0+vec2(t/10.0, 0.0))*cnoise(st+t/10.0);
  mod_st += vec2(0.0, 0.25);
  float shadow1 = pow(mod_st.y*2.0, 2.0) + pow(mod_st.x*4.0, 2.0);
  shadow1 = pow((1.0-st.y), 2.0)*0.2;
  float shadow2 = abs(map(st.x, 0.0, 1.0, -1.0, 1.0));
  shadow2 = abs(map(fract(st1.x), 0.0, 1.0, -1.0, 1.0));

  float d = door(fract(st1*size*flipy)*vec2(1.0, 1.5), vec2(0.6, 1.2), 0.05);
  float d1 = door(fract(st1*size*flipy)*vec2(1.0, 1.5)+vec2(-0.2, 0.0), vec2(0.6, 1.2), 0.08);
  float midd = door(fract(st1*vec2(8.0+1.0, 1.3)), vec2(0.7, 0.4), 0.05);
  float midd1 = door(fract(st1*vec2(8.0+1.0, 1.3)), vec2(0.7-0.2, 0.4-0.1), 0.05);

  vec2 rot_st = (rotate(st, radians(20.0), vec2(0.0)) + vec2(0.0, -2.0) ) * size;
  float rd = door(fract(rot_st)*vec2(1.0, 1.5), vec2(0.6, 1.2), 0.05);

  float dshadow = door(fract(st1*size*flipy)*vec2(1.0, 1.5), vec2(0.85, 0.9), 0.05);
  float sinmod = abs(sin(t));


  vec3 c = WHITE;
  // c = mix(c, WHITE, cloud*(1.0-side));
  // c = mix(c, GREY*0.8, dshadow*side*(1.0-middle));
  // c = mix(c, BLACK*1.0, bottom*(shadow1)*sin(t));
  c = mix(c, GREY, side*d*(1.0-middle));
  c = mix(c, WHITE*1.0*(sin(t+radians(90.0))), side*d1*d*(1.0-middle));
  // c = mix(c, GREY, midd*middle);
  // c = mix(c, GREY*0.5, midd1*middle);
  c = mix(c, BLACK*1.0, shadow2*side*sin(t));
  c = mix(c, WHITE*1.0*(sin(t+radians(90.0))), (shadow1*bottom));
  c = mix(c, BLACK*1.2, top*cloud);
  c = mix(c, BLACK*1.5, side*d*d1*(1.0-middle)*sin(t+st.x+radians(90.0))*cloud);
  // c = mix(c, BLACK, side*cloud);

  float test = door(fract(st), vec2(0.5, 0.4), 0.01);
  float test1 = door(fract(rotate(st.yx, radians(30.0), vec2(0.0))), vec2(0.5), 0.01);

  // c = mix(WHITE, BLACK, test);
  // c = mix(c, BLACK, test1);

  // c = mix(c, BLACK, top*shadow1);

  gl_FragColor = vec4(WHITE, 1.0);
  gl_FragColor = vec4(c, 1.0);
  // gl_FragColor = vec4(vec3(shadow1), 1.0);
}