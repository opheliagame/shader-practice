#version 330
#ifdef GL_ES
precision mediump float;
#endif

#define BLACK vec3(0.0)
#define WHITE vec3(1.0)

uniform vec2 u_resolution;
uniform float u_time;

float pointedArchSDF(vec2 st, vec2 center) {
  vec2 left  = vec2(center.x-0.5, center.y-0.5);
  vec2 right = vec2(center.x+0.5, center.y-0.5);
  
  float a = length(st - left)  * 1.0;
  float b = length(st - right) * 1.0;

  // return a+b-(a*b);
  return st.y > 0.0 ? max(a, b) : 2.0;
  // return min(max(a, b), -st.y*5.0);
}

float pointedArchSDF(vec2 st) {
  return pointedArchSDF(st, vec2(0.5));
}

vec2 st_pointedArch(vec2 st) {
  
  vec2 left  = vec2(0.9, 0.0);
  vec2 right = vec2(0.1, 0.0);

  float a = distance(st, left)  * 1.0;
  float b = distance(st, right) * 1.0;


  return mod(st + vec2(0.0, max(a, b)), 1.0);
}

vec2 get_st(vec2 st, vec2 res) {

  float angle = atan(st.x-0.5, st.y);

  st = vec2(angle, pointedArchSDF(st));
  st *= res;
  st = fract(st);
  
  return st;
} 

#include "../lygia/space/ratio.glsl";
#include "../lygia/space/cart2polar.glsl";
#include "../lygia/space/rotate.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/draw/stroke.glsl";
#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/sdf/rectSDF.glsl";
#include "../lygia/space/ratio.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/generative/gnoise.glsl";

float[] time_sig = {
  0.25, 0.5, 0.75, 1.0, 
};

float[] beat = {
  1.0, -1.0, 1.0, 1.0
};


void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time * 0.1;

  int index = int(mod(fract(t)*4.0, 4.0));

  float b_res = time_sig[index] * beat[index];
  float ones = b_res < 0.0 ? 0.0 : 1.0;

  float rot = index*45.0/2.0;

  vec2 rot_st = rotate(st, radians(15.0*b_res));
  
  float circle = circleSDF(st);
  float rect = rectSDF(rotate(st, radians(rot)));

  float[] shapes = {rect};
  int i_shape = int(mod(floor(t), 2.0));
  float shape = shapes[i_shape];

  
  float a = stroke(pointedArchSDF(
    get_st(
    // fract(cart2polar(rot_st*2.0-1.0)*2.0), vec2(b_res+2.0)
      (st), vec2(mod(floor(t), 4.0)+4.0)
      // (st), vec2(1.0)
    )
  ), 1.0, 0.1, 0.01);

  float res = 10.0;
  float mt = random(floor(st*res)) < 0.5 ? 1.0 : -1.0;
  vec2 grid = floor(vec2(st.x, st.y)*res)/res;
  float rot1 = floor(random(floor(st*res)) * 4.0) * 90.0;
  // rot1 = mod(rot1, 90.0);
  vec2 mod_st = st;
  // mod_st.y += (1.0-mt)*t;
  // mod_st.x += t*mt;
  mod_st.y += (mod_st.x-grid.x) * 1.0 * (random(floor(st*res)) < 0.5 ? 0.0 : 1.0); 

  // mod_st = rotate(mod_st, radians(rot1), grid+res/2.0);

  float a1 = fill(pointedArchSDF(fract(mod_st*res)), 1.0, 0.01) * (cnoise(grid+floor(t)*ones) < 0.5 ? 1.0 : 0.0);


  vec3 color = BLACK;
  // color = mix(color, WHITE, fill(rect, 0.2, 0.001));
  // color = mix(color, WHITE, (fill(shapes[int(mod(i_shape+1.0, 2.0))], 0.8, 0.001)*a));
  color = mix(color, WHITE, a1);
  // color = mix(color, WHITE, (rot1));
 

  gl_FragColor = vec4(color, 1.0);


}