#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define LBROWN        vec3(0.74, 0.53, 0.40)
#define DBROWN        vec3(0.30, 0.19, 0.12)
#define WHITE         vec3(1.00, 1.00, 1.00)
#define GREY          vec3(0.52, 0.50, 0.47)
#define YELLOW        vec3(0.96, 0.87, 0.58)

#include "../lygia/space/ratio.glsl";
#include "../lygia/space/rotate.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/math/map.glsl";

float aafract(float x) {    // --- antialiased fract
    float v = fract(x),
          w = fwidth(x);    // NB: x must not be discontinuous or factor discont out
    return v < 1.-w ? v/(1.-w) : (1.-v)/w; // replace right step by down slope (-> chainsaw is continuous).
            // shortened slope : added downslope near v=1 
}

float getDoor(vec2 mod_st, vec2 dsize, float blur) {
  float diffy = (dsize.y)/2.0;
  diffy = 0.5-dsize.y;
  float diffx = (dsize.x);
  float sdf1 = rectSDF(mod_st+vec2(0.0, diffy), dsize);
  float sdf2 = circleSDF(mod_st+vec2(0.0, diffy), 
              // vec2(0.5, (1.0-dsize.y)/2.0));
              vec2(0.5, 0.5+dsize.y/2.0));
              // vec2(0.5, 0.5+0.25));
  float sdf = sdf1+sdf2;
  float door1 = fill(sdf1, 1.0, blur*5.0);
  float door2 = fill(sdf2, dsize.x, blur);
  // float door3 = fill(circleSDF(mod_st, vec2(0.5, 0.0)), dsize.x, 0.01);
  float door = door1 + door2 - door1*door2;
  // door = smoothstep(0.0, 1.0, door);
  return door;
}


void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time/2.0;
  // t = 2.8;

  vec2 size = vec2(12.0);
  vec2 mod_st = st*size;
  vec2 space = st*size;
  vec2 orig_mod = space;
  // space.x += t;
  // space.x *= cnoise((st.xx+t/10.0));
  // space.x += step(0.5, fract(space.x*0.1)) == 0.0 ? t : 0.0;
  // space.y += step(0.5, fract(space.x*0.1)) == 1.0 ? t : 0.0;

  vec2 wall = vec2(0.3, 0.0)+vec2(0.0, t);
  wall = vec2(floor(st.x * 3.0)/3.0 + 1.0/3.0, 0.0);
  wall = vec2(random(floor(mod_st.x)));
  // wall = vec2(cnoise(wall.xx), wall.y)*size;
  // wall.x += sin(t);
  vec2 slope = vec2(0.5);
  // slope.x = (sin(t)/4.0);


  float flip = step(0.5, fract(space.x*0.5)) == 0.0 ? -1.0 : 1.0;
  // wall.x = floor(space.x);
  

  // if(flip == -1.0) space.y += (fract(mod_st.x))*slope.x*size.x;
  // else space.y += (1.0-fract(mod_st.x))*slope.x*size.x;
  // mod_st.y += (st.x - wall.x - floor(mod_st.x))*slope.x*size.x*flip;
  
  if(st.x < wall.x) space.y += (st.x - wall.x)*slope.x*size.x;
  else space.y += (st.x - wall.x)*-slope.x*size.x;

  
  float rotation = step(0.5, cnoise(floor(space)+t/2.0))*radians(90.0);
  space = rotate(space, rotation);
  float door = getDoor(fract(space), vec2(0.4), 0.01);

  vec3 light = step(0.5, cnoise(floor(space)+t/5.0)) == 0.0 
                ? YELLOW : 1.0-WHITE;
  
  float dshadow = getDoor(fract(space), vec2(0.4), 0.2) - getDoor(fract(space), vec2(0.4), 0.05);


  vec3 c = mix(DBROWN, LBROWN, fract(space.y));
  if (light == YELLOW) c = mix(c, GREY, dshadow);
  c = mix(c, light, door*fract(space.y));

  gl_FragColor = vec4(LBROWN, 1.0);
  gl_FragColor = vec4(c, 1.0);
  gl_FragColor = vec4(vec3(space.xy, 1.0), 1.0);
}