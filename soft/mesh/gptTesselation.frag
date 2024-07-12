// Vertex Shader
#version 450

layout(location = 0) in vec3 position;

void main()
{
    gl_Position = vec4(position, 1.0);
}

// Tessellation Control Shader
#version 450

layout(vertices = 16) out;

void main()
{
    // Pass through input control points to output patch
    gl_out[gl_InvocationID].gl_Position = gl_in[gl_InvocationID].gl_Position;

    // Set the tessellation levels for the patch
    gl_TessLevelOuter[0] = 16.0;
    gl_TessLevelOuter[1] = 16.0;
    gl_TessLevelOuter[2] = 16.0;
    gl_TessLevelOuter[3] = 16.0;

    gl_TessLevelInner[0] = 16.0;
    gl_TessLevelInner[1] = 16.0;
}

// Tessellation Evaluation Shader
#version 450

layout(triangles, equal_spacing, ccw) in;

void main()
{
    float u = gl_TessCoord.x;
    float v = gl_TessCoord.y;
    float w = gl_TessCoord.z;

    // Ferguson Patch control points
    vec3 p00 = gl_in[0].gl_Position.xyz;
    vec3 p01 = gl_in[1].gl_Position.xyz;
    vec3 p02 = gl_in[2].gl_Position.xyz;
    vec3 p03 = gl_in[3].gl_Position.xyz;
    vec3 p04 = gl_in[4].gl_Position.xyz;
    vec3 p05 = gl_in[5].gl_Position.xyz;
    vec3 p06 = gl_in[6].gl_Position.xyz;
    vec3 p07 = gl_in[7].gl_Position.xyz;
    vec3 p08 = gl_in[8].gl_Position.xyz;
    vec3 p09 = gl_in[9].gl_Position.xyz;
    vec3 p10 = gl_in[10].gl_Position.xyz;
    vec3 p11 = gl_in[11].gl_Position.xyz;
    vec3 p12 = gl_in[12].gl_Position.xyz;
    vec3 p13 = gl_in[13].gl_Position.xyz;
    vec3 p14 = gl_in[14].gl_Position.xyz;
    vec3 p15 = gl_in[15].gl_Position.xyz;

    // Interpolate positions on the edges
    vec3 e0 = mix(p00, p01, u);
    vec3 e1 = mix(p01, p02, u);
    vec3 e2 = mix(p02, p03, u);
    vec3 e3 = mix(p03, p04, u);
    vec3 e4 = mix(p04, p05, u);
    vec3 e5 = mix(p05, p06, u);
    vec3 e6 = mix(p06, p07, u);
    vec3 e7 = mix(p07, p08, u);
    vec3 e8 = mix(p08, p09, u);
    vec3 e9 = mix(p09, p10, u);
    vec3 e10 = mix(p10, p11, u);
    vec3 e11 = mix(p11, p12, u);
    vec3 e12 = mix(p12, p13, u);
    vec3 e13 = mix(p13, p14, u);
    vec3 e14 = mix(p14, p15, u);

    // Interpolate positions on the interior
    vec3 i0 = mix(e0, e1, v);
    vec3 i1 = mix(e1, e2, v);
    vec3 i2 = mix(e2, e3, v);
    vec3 i3 = mix(e3, e4, v);
    vec3 i4 = mix(e4, e5, v);
    vec3 i5 = mix(e5, e6, v);
    vec3 i6 = mix(e6, e7, v);
    vec3 i7 = mix(e7, e8, v);
    vec3 i8 = mix(e8, e9, v);
    vec3 i9 = mix(e9, e10, v);
    vec3 i10 = mix(e10, e11, v);
    vec3 i11 = mix(e11, e12, v);
    vec3 i12 = mix(e12, e13, v);

    // Interpolate positions on the surface
    vec3 s0 = mix(i0, i1, w);
    vec3 s1 = mix(i1, i2, w);
    vec3 s2 = mix(i2, i3, w);
    vec3 s3 = mix(i3, i4, w);
    vec3 s4 = mix(i4, i5, w);
    vec3 s5 = mix(i5, i6, w);
    vec3 s6 = mix(i6, i7, w);
    vec3 s7 = mix(i7, i8, w);
    vec3 s8 = mix(i8, i9, w);
    vec3 s9 = mix(i9, i10, w);
    vec3 s10 = mix(i10, i11, w);

    // Interpolate final position
    vec3 position = mix(s0, s1, w);

    gl_Position = vec4(position, 1.0);
}
