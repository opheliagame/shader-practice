r << 0.5;
res << 4;
im1 << img "https://raw.githubusercontent.com/opheliagame/shader-practice/main/out/%20pink.png";
pink << [0.97, 0.73, 0.81];
yellow << [0.97, 233/255.0, 8/255.0];

x << ft;
n << x*x*x*(x*(x*6.0-15.0)+10.0);

a <<  max [dist [-0.5, -0.5]] [dist [0.5, -0.5]];
t << (a-0.01) / (1.0-0.01);
ss << 1.0 - (t * t * (3.0-2.0*t));

-- fit 1 $ setfxy [a, a*fy] $ tile [res, res] $ circle [sin (ft* fract (etime*mid)) * r, cos (frt*tan(time*0.2)) * r] [0.3] * im1 >> video;
fit 1 $ setfxy [a, a] $ tile [res, res] $ ss * im1 * 0.1 >> video;

mod1 << sin $ ft*ebeat;

-- im1 * mid * 0.2 >> video; 
-- g * mid * pink * 0.2 >> video;
-- b * pink * 0.2 >> video;

move [rnd, sin mod1] (fb $ fxy) * 0.2 * yellow >> video;

-- fit 1 $ setfxy [a, a*fy] $ tile [res, res] $ circle [sin (ft* fract (etime*mid)) * r, cos (frt*tan(time*0.2)) * r] [0.3] * im1 >> video;
fit 1 $ setfxy [a, a] $ spin[0, mid] $ tile [res, res] $ ss * im1 * 0.00005 >> video;


fit 1 $ setfxy [a, a*fy] $ tile [res, res] $ circle [sin (ft* fract (etime*mid)) * r, cos (frt*tan(time*0.2)) * r] [0.3] * im1 >> video;
-- fit 1 $ setfxy [a, a] $ tile [res, res] $ ss * im1 * 0.00005 >> video;


