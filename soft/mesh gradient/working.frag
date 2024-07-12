#version 330
#ifdef GL_ES
precision mediump float;
#endif

#define MAX_POINTS 6
// uniform sampler2D texture;
// uniform vec2 points[MAX_POINTS];
// uniform float s2[MAX_POINTS];
// uniform vec2 w[MAX_POINTS];
// uniform int npoints;
// uniform int warp;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
// varying vec2 texco;

// uniform int u_color1;
// uniform int u_color2;
// uniform int u_color3;
// uniform int u_color4;

vec4 getColor(int c) {
    float rValue = float(c / 256 / 256);
    float gValue = float(c / 256 - int(rValue * 256.0));
    float bValue = float(c - int(rValue * 256.0 * 256.0) - int(gValue * 256.0));
    return vec4(rValue / 255.0, gValue / 255.0, bValue / 255.0, 1.0);
}

vec4 grad(vec2 uv) {
    
	// vec4 color0 = getColor(15389330); // EAD292  15389330
  //   vec4 color1 = getColor(8303016); // 7EB1A8  8303016
  //   vec4 color2 = getColor(16624521); // FDAB89  16624521
  //   vec4 color3 = getColor(14355510); // DB0C36  14355510
 
    // vec4 color0 = getColor(153198330); // EAD292  15389330
    // vec4 color1 = getColor(83073286); // 7EB1A8  8303016
    // vec4 color2 = getColor(16622521); // FDAB89  16624521
    // vec4 color3 = getColor(14738120); // DB0C36  14355510

    vec4 color0 = getColor(153198330); // EAD292  15389330
    vec4 color1 = getColor(83073286); // 7EB1A8  8303016
    vec4 color2 = getColor(16622521); // FDAB89  16624521
    vec4 color3 = getColor(24926319); // DB0C36  14355510
    // vec4 color3 = getColor(14155663); // DB0C36  14355510

    // coordinates
    vec2 P0 = vec2(0.31,0.3);
    vec2 P1 = vec2(0.7,0.32);
    vec2 P2 = vec2(0.28,0.71);
    vec2 P3 = vec2(0.72,0.75);
 
    vec2 Q = P0 - P2;
    vec2 R = P1 - P0;
    vec2 S = R + P2 - P3;
    vec2 T = P0 - uv;
 
    float u;
    float t;
 
    if(Q.x == 0.0 && S.x == 0.0) {
        u = -T.x/R.x;
        t = (T.y + u*R.y) / (Q.y + u*S.y);
    } else if(Q.y == 0.0 && S.y == 0.0) {
        u = -T.y/R.y;
        t = (T.x + u*R.x) / (Q.x + u*S.x);
    } else {
        float A = S.x * R.y - R.x * S.y;
        float B = S.x * T.y - T.x * S.y + Q.x*R.y - R.x*Q.y;
        float C = Q.x * T.y - T.x * Q.y;
        if(abs(A) < 0.0001)
            u = -C/B;
        else
        u = (-B+sqrt(B*B-4.0*A*C))/(2.0*A);
        t = (T.y + u*R.y) / (Q.y + u*S.y);
    }
    u = clamp(u,0.0,1.0);
    t = clamp(t,0.0,1.0);
 

    t = smoothstep(0.0, 1.0, t);
    u = smoothstep(0.0, 1.0, u);
 
    vec4 colorA = mix(color0,color1,u);
    vec4 colorB = mix(color2,color3,u);
    
    return mix(colorA, colorB, t);
}

#include "../../lygia/generative/gnoise.glsl";
#include "../../lygia/generative/cnoise.glsl";

void main()
{
    vec2 texco = gl_FragCoord.xy/u_resolution.xy;

    // int warp = 0;
    // const int npoints = 6;
    // vec2 points[MAX_POINTS] = vec2[MAX_POINTS](
    //     vec2(0.5, 0.5), vec2(0.25, 0.25), vec2(0.9), vec2(0.8)
    // );
    // float s2[MAX_POINTS] = float[MAX_POINTS](
    //     25, 200, -10, -200
    // );
    // vec2 w[MAX_POINTS] = vec2[MAX_POINTS](
    //     vec2(0.5, 0.5), vec2(0.25, -1.0), vec2(0.24), vec2(0.24)
    // );
    int warp = 10;
    const int npoints = MAX_POINTS;
    vec2 points[MAX_POINTS];
    points[0] = vec2(0.520,-0.860);    
    points[1] = vec2(0.160,-0.320);
    points[2] = vec2(-0.120,0.540);
    points[3] = vec2(0.550,0.400);    
    points[4] = vec2(0.490,-0.800);    
    points[5] = vec2(-0.800,-0.160);

  
    float s2[MAX_POINTS];
     s2[0] = 0.932;    
    s2[1] = 0.608;
    s2[2] = 0.120;
    s2[3] = 0.012;    
    s2[4] = 0.148;    
    s2[5] = 0.012;

       
    vec2 w[MAX_POINTS];
     w[0] = vec2(0.750,-0.750)*1.1;    
    w[1] = vec2(-0.900,0.420)*1.024;
    w[2] = vec2(0.440,-0.260)*1.228;
    w[3] = vec2(-0.970,0.890)*1.052;    
    w[4] = vec2(-0.690,0.180)*0.088;    
    w[5] = vec2(0.550,0.360)*0.090;

    if (warp > 0) {
	vec2 p = texco * 2.0 - 1.0;
	vec2 q = vec2(0, 0);
	for (int i = 0; i < MAX_POINTS; i++) {
            if (i >= npoints)
            continue;
            vec2 points_i = points[i];
            float s2_i = s2[i];
            vec2 w_i = w[i];

            // float s2_i = (s2[i] + gnoise(u_time)) * 0.09;
            // vec2 points_i = vec2(
            //   gnoise(points[i].x + u_time*0.5), 
            //   gnoise(points[i].y + u_time*0.2))*2.0-1.0;
            // vec2 w_i = (w[i] + cnoise(vec2(w[i] + points[i] +(u_time*0.7)))) * 1.5;
            // vec2 w_i = vec2(cnoise(((points_i ) +random(floor(u_time*0.7)) )));

            vec2 delta = p - points_i;
            float distsq = dot(delta, delta);
            float H_i = sqrt(distsq + s2_i);
            q += H_i * w_i;
        }

        vec4 color = grad((q + 1.0) / 2.0);

        gl_FragColor = vec4(vec3((color.xyz)), color.a);


    }
    else {
        gl_FragColor = grad(texco);

    }
}