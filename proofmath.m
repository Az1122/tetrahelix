function retval = square(x)retval = x .* x;endfunctionfplot (@square, [1, 10]);function retval = funky(g,r,rho)a = ((1 .+ g) ./ 2).^2 .+ r.^2 .* (1 .- cos(rho .* (1 .+ g)));disp(a);b = g.^2 .+ r.^2 .* (1 .- cos(2 .* g .* rho));disp(b);retval = sqrt(a) .- sqrt(b);endfunctionfunction retval = funky0(g,r) retval = funky(g,[0:0.2:10],1.3);endfunctionfplot (@funky0, [0,2/3])