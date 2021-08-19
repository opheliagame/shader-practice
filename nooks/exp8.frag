#ifdef GL_ES
precision mediump float;
#endif

#define WHITE     vec3(0.8941, 0.8941, 0.8941)
#define GREY      vec3(0.6078, 0.6078, 0.6078)
#define BLACK      vec3(0.0)
#define RED        vec3(1.0, 0.0, 0.0)

uniform vec2 u_resolution;
uniform float u_time;

#include "../lygia/space/ratio.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/generative/fbm.glsl";
#include "../lygia/generative/cnoise.glsl";

float aafract(float x) {    // --- antialiased fract
  // https://www.shadertoy.com/view/wtjGzt
  float v = fract(x),
        w = fwidth(x);    // NB: x must not be discontinuous or factor discont out
  return v < 1.-w ? v/(1.-w) : (1.-v)/w; // replace right step by down slope (-> chainsaw is continuous).
          // shortened slope : added downslope near v=1 
}

float archSDF (vec2 st, vec2 s) {
  float c = 0.0;
  st = st * 2.0 - 1.0;
  float x = min(s.x, max(-st.x, st.x));
  float y = min(s.y, max(-st.y, st.y));
  float p = 1.0;
  c = min(pow(( x+s.x) * p, 0.5), pow((-x+s.x) * p, 0.5)) + 
      min(pow(( y+s.y) * p, 0.5), pow((-y+s.y) * p, 0.5));  
  return c;
}

vec2 wallst (vec2 st, vec2 wall, vec2 size, float side) {
  vec2 st1 = (st*size);
  float xside = step(wall.x, st1.x) == 0.0 ? 0.8*side : -0.15*side;
  st1.y += xside * (st1.x-wall.x);
  return st1;
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/10.0;

  vec2 wall = vec2(0.35, 0.0);
  vec2 offset = vec2(0.0, 0.15);
  vec2 rightoff = (vec2(0.5, 0.0)-vec2(0.75-0.35, 0.0))*0.5;
  vec2 leftoff = (vec2(0.5, 0.0)-vec2(0.35-0.25, 0.0))*0.5;
  vec2 st1 = wallst(st, wall, vec2(1.0), 1.0);
  vec2 st2 = wallst(vec2(1.0-st.x, 1.0-st.y), wall, vec2(1.0), 1.0);
  float balfront = fill(rectSDF(st1+offset, vec2(0.5)), 1.0, 0.01);
  vec2 st1_flip = wallst(vec2(1.0-st.x, 1.0-st.y), wall, vec2(1.0), 1.0);
  float balflip = fill(rectSDF(st1_flip+vec2(0.0, -0.0075), vec2(0.5)), 1.0, 0.01);
  float common = balfront*balflip;

  float boundary = step(wall.x, st.x);
  float boundary1 = step(1.0-wall.x, st.x);
  float win1 = fill(rectSDF(boundary*(st1)+offset*0.5-rightoff, vec2(0.35, 0.3)), 1.0, 0.01);
  float win2 = fill(rectSDF(st1+offset*0.5+leftoff, vec2(0.075, 0.3)), 1.0, 0.01);
  float win3 = fill(rectSDF((st2)+offset*0.5-rightoff, vec2(0.35, 0.3)), 1.0, 0.01);
  float win4 = fill(rectSDF(st2+offset*0.5+leftoff, vec2(0.075, 0.3)), 1.0, 0.01);
  float win = win1+win2;
  float top = balflip-common;
  
  float bottom1 = fill(rectSDF(st1+offset+vec2(0.0, 0.25*0.8), vec2(0.5, 0.2*0.5)), 1.0, 0.001);
  float bottom2 = fill(rectSDF(st1+offset+vec2(0.0, 0.25*0.5), vec2(0.5, 0.2*0.5)), 1.0, 0.001);
  float bottom = bottom1+bottom2 - bottom1*bottom2;
  vec2 archs = vec2(10.0, 5.0);
  vec2 archst = fract(st1*archs);
  float arch1 = 1.0-fill(archSDF(archst*(bottom), vec2(0.5, 1.0)), 1.0, 0.05);
  float arch2 = 1.0-fill(archSDF(archst*(bottom), vec2(0.7, 1.2)), 1.0, 0.05);
  float rect = fill(rectSDF(st-rightoff, vec2(0.5)), 1.0, 0.01);

  float frontv = (1.0-balfront-top+win1+win2);
  float backv = 1.0-(balflip-(win3+win4));
  float insidev = (frontv-(frontv*backv));

  float shadow1 = pow(st.x*2.0-1.0, 2.0);
  float shadow2 = (1.0-st.x);
  // st1 = st1*2.0-1.0;
  float shadow3 = (pow(fract(st1*archs*2.0).y*0.5, 2.0) + 
                  pow(fract(st1*archs).x*2.0-1.0, 1.2));
  shadow3 *= 1.2;
  float shadow4 = pow((st.x*2.0-1.0)*0.5, 2.0) + pow(st.y*0.8, 2.0);

  float cloud = fbm(st*2.0) * cnoise(st1);


  vec3 c = GREY;
  c = mix(c, WHITE *0.8, insidev*boundary1*(1.0-st.y)*st.x);
  c = mix(c, GREY, insidev*(1.0-st.y));
  c = mix(c, BLACK, cloud*frontv*backv);
  c = mix(c, WHITE, arch2);
  c = mix(c, BLACK, arch1*shadow3);
  c = mix(c, WHITE, (balfront-win)*shadow2*boundary);
  c = mix(c, WHITE, (balfront-win)*shadow2);
  c = mix(c, WHITE, (top)*shadow2);
  c = mix(c, GREY, shadow4);
  // c = mix(c, WHITE, win1);
  // c = mix(c, WHITE, win2);

  
  // c = mix(WHITE, RED, frontv-(frontv*backv));
  // c = mix(c, BLACK, bottom2);
  // c = mix(c, WHITE, win3);
  // c = mix(c, WHITE, win4);

  // c = mix(WHITE, BLACK, rect);

  gl_FragColor = vec4(WHITE, 1.0);
  gl_FragColor = vec4(c, 1.0);
  // gl_FragColor = vec4(vec3(shadow4), 1.0);
}