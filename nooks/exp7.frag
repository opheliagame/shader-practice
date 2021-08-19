#ifdef GL_ES
precision mediump float;
#endif

#define WHITE     vec3(0.9686, 0.9686, 0.9686)
#define GREY      vec3(0.6078, 0.6078, 0.6078)
#define BLACK      vec3(0.0)
#define RED        vec3(1.0, 0.0, 0.0)

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/space/rotate.glsl";
#include "../lygia/space/ratio.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/generative/fbm.glsl";
#include "../lygia/math/map.glsl";

vec2 wallst (vec2 st, vec2 wall, vec2 size, float side) {
  vec2 st1 = fract(st*size);
  float xside = step(wall.x, st1.x) == 0.0 ? 0.8*side : -0.25*side;
  st1.y += xside * (st1.x-wall.x);
  return st1;
}

float balcony (vec2 st, vec2 wall, vec2 size) {
  float blur = 0.05;
  vec2 mod_st = fract(st*size);
  vec2 st1 = wallst(st, wall, size, 1.0);
  float winfront = fill(rectSDF(fract(st1), vec2(0.8, 0.5)), 1.0, blur);
  vec2 flip_st = wallst(vec2(1.0-st.x, 1.0-st.y), wall, size, 1.0)+vec2(0.0, 0.38);
  float winflip = fill(rectSDF(fract(flip_st), vec2(0.8, 0.5)), 1.0, blur);
  float boundary = step(wall.x, mod_st.x);
  float winin1 = fill(rectSDF((boundary*(st1-wall+vec2(0.25, 0.0))), vec2(0.4, 0.4)), 1.0, blur);
  float winin2 = fill(rectSDF((1.0-boundary)*(st1+wall-vec2(0.25, 0.0)), vec2(0.4, 0.4)), 1.0, blur);

  // return WHITE*winfront + RED*winflip;
  vec2 shadow = fract(st*size);
  // return winfront*(shadow.x) + (winflip-winflip*winfront)*shadow.x;
  float common = winfront*winflip;
  float sides = (winfront-(winin1+winin2));
  float full = (winfront+winflip-common);
  float top = (winflip-common);
  float bottom = winfront-common;
  float window = bottom;
  float rand_mod = random(floor(st1)) < 0.5 ? 0.0 : 1.0;
  return window;
}

void main () {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/2.0;

  vec2 size = vec2(4.0);
  vec2 wall = vec2(0.4, 0.0);
  vec2 wall2 = vec2(0.2, 0.0);

  vec2 st1 = st*2.0-1.0;
  st1.x /= (st1.y+0.5)*0.0 + 1.2;
  // st1.y += st1.y * 0.0;
  // wall.x = mod_st.x/0.6;
  vec2 building_x_mod = vec2(step(0.5, st.x) == 0.0 ? 1.0 : -1.0, 1.0);
  vec2 building = wallst(st1*building_x_mod, vec2(0.0), vec2(1.0), 1.0);
  vec2 space = vec2(st1.x*size.x, building.y);
  float rand_mod = random(floor(space.yy*size.y)) < 0.5 ? 0.0 : 1.0;

  st = building;
  float blur = 0.05;
  vec2 mod_st = fract(st*size);
  vec2 stw = wallst(st, wall, size, 1.0);
  float winfront = fill(rectSDF(fract(stw), vec2(0.8, 0.5)), 1.0, blur);
  vec2 flip_st = wallst(vec2(1.0-st.x, 1.0-st.y), wall, size, 1.0)+vec2(0.0, 0.38);
  float winflip = fill(rectSDF(fract(flip_st), vec2(0.8, 0.5)), 1.0, blur);
  float boundary = step(wall.x, mod_st.x);
  float winin1 = fill(rectSDF((boundary*(stw-wall+vec2(0.25, 0.0))), vec2(0.4, 0.4)), 1.0, blur);
  float winin2 = fill(rectSDF((1.0-boundary)*(stw+wall-vec2(0.25, 0.0)), vec2(0.4, 0.4)), 1.0, blur);

  // return WHITE*winfront + RED*winflip;
  vec2 shadow = fract(st*size);
  // return winfront*(shadow.x) + (winflip-winflip*winfront)*shadow.x;
  float common = winfront*winflip;
  float sides = (winfront-(winin1+winin2));
  float full = (winfront+winflip-common);
  float top = (winflip-common);
  float bottom = winfront-common;
  float window = bottom;
  // float rand_mod = random(floor(st1)) < 0.5 ? 0.0 : 1.0;


  // vec2 st1 = wallst(st, wall1, size, 1.0);
  // vec2 st2 = wallst(st, wall2, size, 1.0);
  // vec2 strip = smoothstep(wall1-0.1, wall1+0.1, fract(st2))*st2;
  // float win1 = fill(rectSDF(fract(st1), vec2(0.8, 0.5)), 1.0, 0.01);
  // float win2 = fill(rectSDF(fract(st2*size), vec2(0.9)), 1.0, 0.01);
  // float rect = fill(rectSDF(fract(st1), vec2(0.5)), 1.0, 0.01);
  // float building = mix(fract(st1.y), fract(st2.y), win1);

  vec2 nst = gl_FragCoord.xy/u_resolution.xy;
  nst = ratio(nst, u_resolution);
  vec2 st2 = gl_FragCoord.xy/u_resolution.xy;
  st2.y += (st2.x-0.5) * 0.15 * (step(0.5, st2.x) == 0.0 ? -1.0 : 1.0);
  float horizon = 1.0-smoothstep(0.73-0.005, 0.725+0.005, st2.y);
  float cloud = fbm(nst*2.0);
  float btop = 1.0-smoothstep(0.85-0.01, 0.85+0.01, st2.y);
  btop *= (1.0-horizon);

  float shadow1 = pow(st1.y-0.2, 1.0)*0.5 ;
  float shadow2 = pow((st.x*2.0-1.0), 2.0)*2.0;
  float mod1 = abs(sin(t));
  vec3 c = WHITE*0.7;
  // c = mix(WHITE, BLACK, fract(st1.y));
  // c = mix(c, GREY, fract(st2.y));
  // c = mix(WHITE*mod1, (c)*(1.0-mod1), win2);
  // c = mix(c, BLACK, win2);
  // c = mix(c, GREY, flip);
  // c = mix(c, RED, win1);
  // c = mix(c, WHITE, cloud*(1.0-horizon));
  // c = mix(c, GREY*0.3, btop*(1.0-shadow2*0.2));
  // c = mix(c, GREY*0.8, building_x_mod.x*building.x);
  c = mix(c, WHITE, top*(1.0-shadow1));
  c = mix(c, WHITE*0.6, common*shadow2);
  c = mix(c, WHITE, bottom*shadow1*shadow2);
  c = mix(c, BLACK, sides);
  // c = mix(c, WHITE, shadow1);

  gl_FragColor = vec4(GREY, 1.0);
  gl_FragColor = vec4(c, 1.0);
  // gl_FragColor = vec4(vec3(horizon), 1.0);
}