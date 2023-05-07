float pattern1 (vec2 st, vec2 size) {
  vec2 mod_st = st*size;
  mod_st = fract(mod_st);
  mod_st = rotate(mod_st, radians(360.0/16.0));
  float lw = 0.2; 
  float blur = 0.4;
  float s1 = fill(starSDF(mod_st, 8, 0.31), 0.7, 0.1);
  float s1_line = stroke(starSDF(mod_st, 8, 0.31), 0.7, lw, blur);
  float s1_line1 = stroke(starSDF(mod_st, 8, 0.31), 0.7, 0.05, 0.01);
  // mod_st = rotate(mod_st, -radians(360.0/16.0));
  float s2 = fill(starSDF(mod_st, 8, 0.07), 0.6, 0.1);
  float s2_line = stroke(starSDF(mod_st, 8, 0.08), 0.6, lw, blur);
  vec2 st1 = (st*size)+vec2(0.5);
  st1 = fract(st1);
  st1 = rotate(st1, radians(360.0/8.0));
  float s3 = fill(starSDF(st1, 4, 0.05), 0.4, 0.1);
  float s3_line = stroke(starSDF(st1, 4, 0.05), 0.4, lw, blur);

  float line = s1_line+s2_line+s3_line; 
  return line;
}

float pattern2 (vec2 st, vec2 size, float t) {
  // unfinished
  float lw = 0.2; 
  float blur = 0.5;
  vec2 mod_st = fract(st*size);
  float s1 = stroke(starSDF(mod_st, 8, (0.55)), 0.7, lw, blur);
  float s2 = stroke(starSDF(mod_st, 8, (0.32)), 0.7, lw, blur);
  mod_st = rotate(mod_st, radians(360.0/16.0));
  float s4 = stroke(starSDF(mod_st, 8, 0.5), 2.0, lw*1.5, blur);

  mod_st = rotate(mod_st, -radians(360.0/16.0));
  mod_st = fract(mod_st+vec2(0.5));
  float s3 = stroke(starSDF(mod_st, 8, 0.5), 0.7, lw, blur);
  mod_st = rotate(mod_st, radians(45.0));
  mod_st = fract(mod_st*2.0);

  float s5 = stroke(starSDF(mod_st, 3, 0.3), 0.5, lw, blur);

  float line = s1+s2+s3+s4;
  return line;
}

float pattern3 (vec2 st, vec2 size) {
  float lw = 0.05; 
  float blur = 0.01;
  vec2 mod_st = fract(st*size);
  float row = floor(st*size).y;
  float off = mod(row, 2.0) != 0.0 ? row*0.5 : 0.0;
  float s1 = stroke(starSDF(fract(mod_st+vec2(off, 0.0)), 6, 0.11), 0.7, lw, blur);
  
  float line = s1;
  return line;
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


vec2 get_st(vec2 st, vec2 res) {

  float angle = atan(st.x-0.5, st.y);

  st = vec2(angle, pointedArchSDF(st));
  st *= res;
  st = fract(st);
  
  return st;
} 