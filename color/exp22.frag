#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define BROWN     vec3(221, 114, 48)/255.0
#define YELLOW1   vec3(244, 201, 93)/255.0
#define YELLOW2   vec3(231, 227, 147)/255.0
#define WHITE   vec3(1.0)
#define GREY      vec3(219, 219, 219)/255.0

#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/generative/cnoise.glsl";

float aafract(float x) {    // --- antialiased fract
    float v = fract(x),
          w = fwidth(x);    // NB: x must not be discontinuous or factor discont out
    return v < 1.-w ? v/(1.-w) : (1.-v)/w; // replace right step by down slope (-> chainsaw is continuous).
            // shortened slope : added downslope near v=1 
}

void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  float t = u_time/1.0;

  vec2 size = vec2(4.0);
  vec2 mod_st = (st*size) + vec2(0.0, random(floor(st.x*size.x))/2.0);
  mod_st.y *= (floor(st.x*1.0) + 1.0)/1.0;
  mod_st.x *= ((floor(st.x*1.0) + 1.0)/1.0);
  vec2 slope = vec2(0.0, -floor(mod_st.y)/(size.y*4.0)-0.1);
  slope.y = sin(t)*slope.y;

  mod_st = fract(mod_st);
  vec2 mod_st1 = vec2(mod_st.x, mod_st.y + mod_st.x * -slope.y + slope.y/2.0);
  vec2 mod_st2 = vec2(mod_st.x, mod_st.y + mod_st.x *  slope.y - slope.y/2.0);
  vec2 mod_st3 = vec2(mod_st.x, mod_st.y + (mod_st.x+0.4) * -0.5 );
  vec2 mod_st4 = vec2(mod_st.x, mod_st.y + mod_st.x * 0.5);

  // vec2 s1 = vec2(0.5, 1.0-fract(mod_st.x)/3.0)*0.9;
  vec2 s2 = vec2(0.41);
  vec2 s1 = vec2(0.41);
  float window1 = fill(rectSDF(fract(mod_st1 + vec2(-0.2, 0.0)), s2), 1.0, 0.01);
  float window2 = fill(rectSDF(fract(mod_st2 + vec2( 0.2, 0.0)), s1), 1.0, 0.01);
  float window3 = fill(rectSDF(fract(mod_st + vec2(0.0, -slope.y/2.4)), vec2(0.8, 0.4)), 1.0, 0.01);
  float window4 = fill(rectSDF(fract(mod_st1 + vec2(-0.2, 0.0)), s2), 0.8, 0.01);
  float shadow = fill(rectSDF(
                  (mod_st1+vec2(0.0, 0.2))*0.00 + fract(mod_st4 + vec2(0.0, -slope.y*0.5)), 
                  vec2(0.8, 0.4)), 1.0, 0.01);

  vec3 c = WHITE;
  // c = mix(c, YELLOW1, fract(mod_st2.y));
  // c = mix(YELLOW2, YELLOW1, floor(st.x*size.x));
  c = mix(c, mix(YELLOW2, BROWN, 0.5), window3*mod_st.x);
  c = mix(c, mix(1.0-WHITE, GREY, 0.8), shadow-window3*mod_st.x);
  c = mix(c, YELLOW1, window1);
  c = mix(c, mix(YELLOW2, WHITE, 0.5), window2);
  c = mix(c, mix(YELLOW2, WHITE, 1.0), (window4)*mod_st.x);
  c = mix(c, YELLOW1, window4 * smoothstep(0.0, 1.0, (fract(mod_st3.y))));
  // c = mix(c, WHITE, fract(mod_st.x));

  gl_FragColor = vec4(BROWN, 1.0);
  gl_FragColor = vec4(c, 1.0);
  // gl_FragColor = vec4(vec3(floor(mod_st.x)/size.x), 1.0);
}