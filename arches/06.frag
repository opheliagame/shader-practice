#version 430
#ifdef GL_ES
precision highp float;
#endif

#define BLACK vec3(0.0)
#define WHITE vec3(1.0)
#define PI 3.1415926535897932384626433832795

uniform vec2 u_resolution;
uniform float u_time;

float atan2(in float y, in float x) {
    bool s = (abs(x) > abs(y));
    return mix(PI/2.0 - atan(x,y), atan(y,x), s);
}

float pointedArchSDF(vec2 st, vec2 center) {
  vec2 left  = vec2(center.x-0.5, center.y-0.5);
  vec2 right = vec2(center.x+0.5, center.y-0.5);
  
  float a = length(st - left)  * 1.0;
  float b = length(st - right) * 1.0;

  // return a+b-(a*b);
  return max(a, b);
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
  // st += vec2(0.0, 0.5);
  // st = cart2polar(st*2.0-1.0);

  vec2 uv = st;
  uv.x = uv.x < 0.5 ? 1.0-uv.x : uv.x;
  // uv.x /= 0.5;
  float angle = atan(uv.x, uv.y);

  st = vec2(angle, pointedArchSDF(st));
  st *= res;
  st = fract(st);
  // st = vec2(st.x, pointedArchSDF(st));
  // st *= res;
  // st = fract(st);
  
  // st.y = (step(5.0, st.y) - step(6.0, st.y)) * st.y;
  return st;
} 

#include "../lygia/space/ratio.glsl";
#include "../lygia/space/cart2polar.glsl";
#include "../lygia/space/rotate.glsl";
#include "../lygia/draw/fill.glsl";
#include "../lygia/draw/stroke.glsl";
#include "../lygia/sdf/circleSDF.glsl";
#include "../lygia/space/ratio.glsl";
#include "../lygia/generative/cnoise.glsl";
#include "../lygia/generative/random.glsl";
#include "../lygia/generative/gnoise.glsl";

vec3 rcolor(float n) {
  return vec3(gnoise(n), gnoise((n)*10.0), gnoise(sin(n)*10.0));
}

float beat[] = {
  
  0.0, 0.0625, 0.125, 0.25, 0.75, 1.0
};

void main() {
  vec2 st = gl_FragCoord.st/u_resolution.xy;
  st = ratio(st, u_resolution);
  float t = u_time * 49.0/60.0;

  // st = cart2polar(st*2.0-1.0);
  // st *= 0.5;

  float g1 = random(floor(st*5.0));
  // float grid = random(floor(st+g1+t));
  float grid = random(floor(get_st(st, vec2(2.0))*2.0));
  float grid1 = random(floor(st*4.0));
  
  float off = grid < 0.5 ? 1.0 : 0.0;

  float n = cnoise(floor(st*1.0)+grid+floor(u_time*off));
  
  int oindex = int(mod(floor(t), 6.0));
  int iindex = int(mod(fract(t), oindex));
  float b = mod(floor(t), oindex) == 0.0 ? beat[oindex] : 0.0;
  // float b = 2.0;

  float n1 = cnoise(floor(st*6.0)+ t*0.1 )*2.0+5.0;

  float angle = atan(st.x < 0.5 ? 1.0-st.x : st.x, st.y);
  vec2 ast = get_st(
    fract(get_st(fract(st*1.0), vec2(1.0))*n1), 
    vec2(3.0)
  );
  
  float n2 = cnoise(floor(st*3.0)+b);
  vec2 ast1 = get_st(fract(st*1.0), vec2(1.0))*n1;

  // float a1 = fill(pointedArchSDF(ast), mod(grid1+n2, 1.0), 0.01);
  float a1 = fill(pointedArchSDF(ast), 1.0, 0.01);

  float c1 = fill(circleSDF(st), 1.0, 0.01);
  float g2 = random(floor(ast*10.0));

  vec3 color = rcolor(1.0-(g2));
  color = BLACK;
  color = mix(color, rcolor(g2*n1*4.0), a1);

  // color = mix(color, rcolor(random(st.x*st.y*ast.x+b)), a1);

  gl_FragColor = vec4(color, 1.0);


}