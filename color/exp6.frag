#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define BLACK      vec3(0.0, 0.0, 0.0)
#define WHITE      vec3(1.0, 1.0, 1.0)
#define YELLOW     vec3(1.0, 1.0, 0.0)

#include "../lygia/generative/random.glsl";
#include "../lygia/generative/cnoise.glsl";

float aafract(float x) {    // --- antialiased fract
    float v = fract(x),
          w = fwidth(x);    // NB: x must not be discontinuous or factor discont out
    return v < 1.-w ? v/(1.-w) : (1.-v)/w; // replace right step by down slope (-> chainsaw is continuous).
            // shortened slope : added downslope near v=1 
}

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  float t = u_time/8.0;
  float size = 20.0;

  vec2 space = st;
  vec2 mod_st = space;

  float wall_n = mix(cnoise(vec2(st.x+u_time, 0.0)), random(st+u_time/10.0)*2.0, 0.5);
  // wall_n = 1.0;
  float amp = 0.0 + cnoise(vec2(st.x, 0.0));
  // wall_n = cnoise(vec2(st.x, st.y)*10.0);
  vec2 wall = vec2(0.2, 0.5);
  // wall.y = (random(floor(st * wall_n * amp)));
  // wall.y /= (amp*wall_n);
  // wall.y += random(floor(u_time/2.0));
  // wall.y = fract(wall.y);
  // wall = 0.2; 

  wall.x = clamp(random(floor(st.x*size)), 0.2, 0.8);
  // wall = vec2(cnoise(vec2(floor(st.x*10.0), 0.0)), 0.0);
  // wall = vec2(0.2, 0.3); 

  vec2 slope = wall;
  // slope += cnoise(vec2(st.x)+wall);
  slope += sin(t);

  if(mod_st.x > wall.x) space += vec2(0, (st.x-wall.x) * slope.x);
  else space += vec2(0, (st.x-wall.x) * -slope.x);
  // space.x += u_time/10.0;
  
  // slope.y = 1.2;
  // if(mod_st.y > wall.y) space += vec2(0.0);
  // else tex_coord += vec2((st.y-wall.y) * -slope.y, 0.0);
  // else if(mod_st.x > wall.x) space += vec2((st.y-wall.y) * -slope.y, 0.0);
  // else if(mod_st.x < wall.x) space += vec2((st.y-wall.y) * slope.y, 0.0);

  space *= size;
  mod_st = space;
  // space = vec2(aafract(space.x), aafract(space.y));
  space = fract(space);

  float mod1 = smoothstep(0.0, 1.0, space.y);
  float mod2 = smoothstep(0.5-0.01, 0.5+0.01, space.x);
  vec3 c = mix(BLACK, WHITE, mod1);
  c = mix(c, WHITE, mod2);
  // c = mix(c, YELLOW, space.x*space.y);

  // mod1 = smoothstep(0.5-0.01, 0.5+0.01, random(floor(space.y*size)));
  // mod2 = smoothstep(0.5-0.01, 0.5+0.01, random(floor(space.x*size)));
  float mod3 = mod1+mod2;
  // vec3 c1 = mix(YELLOW, BLACK, mod3);
  // c1 = mix(c1, WHITE, (1.0-c)*cnoise(st*5.0+t));
  // c = c1;

  // float cond = (mod3 * random(floor(t + st*5.0)));
  // vec3 light = cond < 0.5 ? WHITE : BLACK;
  // vec3 c2 = mix(WHITE, light, c);
  // c = c2;
  // c = vec3(cond);

  // float cond = (mod3 * random(floor(t + space)));
  // vec3 light = cond < 0.5 ? WHITE : BLACK;
  // vec3 c2 = mix(WHITE, light, mod3);
  // c = c2;
  // c = vec3(cond);

  // float cond = (mod3 * random(floor(t)) * random(floor(space*size)));
  // vec3 light = cond < 0.5 ? WHITE : BLACK;
  // vec3 c2 = mix(WHITE, light, mod3);
  // c = c2;
  // c = vec3(cond);

  float cond1 = step(0.5, random(floor(space.y*size)));
  float cond = ((1.0-mod3) * random(floor(mod_st) + floor(t)));
  vec3 light = cond < 0.5 ? WHITE : BLACK;
  // vec3 c2 = mix(BLACK, YELLOW, smoothstep(0.5-0.01, 0.5+0.01, cond)*(1.0-mod3));
  vec3 c2 = mix(BLACK, YELLOW, 1.0-mod3);
  c2 = mix(BLACK, c2, smoothstep(0.5-0.2, 0.5+0.2, cond));
  // c2 = mix(YELLOW, c2, smoothstep(0.5-0.01, 0.5+0.01, 1.0-cond));
  c = c2;
  // c = vec3(cond);

  // vec2 d1 = st*size;
  // d1 = step(0.5, fract(d1));
  // c = vec3((d1.x+d1.y) * random(floor(st*size*2.0) + floor(t)));

  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  gl_FragColor = vec4(c, 1.0);
}