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
  // return max(a, b);
  // return a+b-(a*b);
  return st.y > 0.0 ? max(a, b) : 2.0;
  // return min(max(a, b), -st.y*5.0);
}

float pointedArchSDF(vec2 st) {
  return pointedArchSDF(st, vec2(0.5));
}

// vec2 get_st(vec2 st, vec2 res, vec2 res2) {
//   // st += vec2(0.0, 0.5);
//   // st = cart2polar(st*2.0-1.0);

//   st = st_pointedArch(st);
//   st *= res;
//   st = fract(st);
//   st = st_pointedArch(st);
//   st *= res2;
//   st = fract(st);
//   // st.y = (step(5.0, st.y) - step(6.0, st.y)) * st.y;
//   return st;
// } 

vec2 st_pointedArch(vec2 st) {
  
  vec2 left  = vec2(0.9, 0.0);
  vec2 right = vec2(0.1, 0.0);

  float a = distance(st, left)  * 1.0;
  float b = distance(st, right) * 1.0;


  return mod(st + vec2(0.0, max(a, b)), 1.0);
}

// vec2 get_st(vec2 st, vec2 res) {
//   // st += vec2(0.0, 0.5);
//   // st = cart2polar(st*2.0-1.0);

//   st = vec2(st.x, pointedArchSDF(st));
//   st *= res;
//   st = fract(st);
//   st = vec2(st.x, pointedArchSDF(st));
//   st *= res;
//   st = fract(st);
  
//   // st.y = (step(5.0, st.y) - step(6.0, st.y)) * st.y;
//   return st;
// } 

vec2 get_st_old(vec2 st, vec2 res) {
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

vec2 get_st(vec2 st, vec2 res) {

  float angle = atan(st.x-0.5, st.y);

  st = vec2(angle, pointedArchSDF(st));
  st *= res;
  st = fract(st);
  
  return st;
} 

vec3 rcolor(float n) {
  // return cnoise(vec2(n)) < 0.5 ? vec3(0.0) : vec3(1.0);

  return vec3(gnoise(n), gnoise((n)*70.0), gnoise(sin(n)*10.0));
}

vec3 rcolor(vec2 st) {
  return cnoise(st) < 0.5 ? vec3(0.0) : vec3(1.0);

  // return vec3(gnoise(n), gnoise((n)*10.0), gnoise(sin(n)*10.0));
}
