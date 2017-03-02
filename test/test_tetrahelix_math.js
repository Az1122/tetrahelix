var assert = require('assert');

var tm = require('../js/tetrahelix_math.js')


Math.distance3 = function(p0,p1) {
    x = p0[0] - p1[0];
    y = p0[1] - p1[1];
    z = p0[2] - p1[2];        
    return Math.sqrt(x*x + y*y + z*z);
}


describe('Array', function() {
    describe('#indexOf()', function() {
	it('should return -1 when the value is not present', function() {
	    assert.equal(-1, [1,2,3].indexOf(4));
	});
    });
});

describe('tetrahelix_math', function() {
    describe('optimal_radius()', function() {
	it('should compute same one-hop and two-hop distance (1) for BC helix', function() {
	    var MAX_DEGREES = 45;
	    console.log(tm.optimal_radius);
	    for(var i = 0; i < 100;i++) {
		var rho = Math.PI*(i*MAX_DEGREES/100)/180;
		var r = tm.optimal_radius(rho,1.0);
		var h1 = tm.one_hop(r,rho,1.0);
		var h2 = tm.two_hop(r,rho,1.0);
		assert(tm.nearlyEqual(1,h1,0.0000001));
	    }
	});
    });
    describe('test rail angle formula against BC', function() {
	it('find functions should match Coxeter\'s solutions for BC helix', function() {
	    var BCr_check = tm.find_rrho_from_d(tm.BCrho,tm.BCd);
	    var BCd_check = tm.find_drho_from_r(tm.BCrho,tm.BCr);
	    assert(tm.nearlyEqual(tm.BCr,BCr_check,0.0000001),
		   'BCr nearly equal fail '+tm.BCr+', BCr_check == '+BCr_check);    
	    assert(tm.nearlyEqual(tm.BCd,BCd_check,0.0000001),
		   'BCd == '+tm.BCd+', BCd_check == '+BCd_check);
	});
    });

    describe('H_general', function() {
	it('H_general should match H_bc', function() {
	    var R0 = tm.H_bc(0,0);
	    var R1 = tm.H_bc(1,0);
	    var Y0 = tm.H_bc(0,1);
	    var B0 = tm.H_bc(0,2);
	    assert(tm.nearlyEqual(Math.distance3(R0,R1),1,0.0000001),"\n R0 = " + R0 +"\n R1 = " + R1 +"\n distance3 =" + Math.distance3(R0,R1));
	    assert(tm.nearlyEqual(Math.distance3(R0,Y0),1,0.0000001),"\n R0 = " + R0 +"\n Y0 = " + Y0 +"\n distance3 =" + Math.distance3(R0,Y0));
	    assert(tm.nearlyEqual(Math.distance3(R0,B0),1,0.0000001),"\n R0 = " + R0 +"\n B0 = " + B0 +"\n distance3 =" + Math.distance3(R0,B0));
	});
    });

    describe('H_general', function() {
	it('H_general is an even function', function() {
	    var rho = tm.BCrho;
	    var len = 1.0;
	    var r_opt = tm.optimal_radius(rho,len);
	    var d_opt = tm.optimal_distance(rho,len);
	    console.log(rho,len,r_opt,d_opt);    
	    var p1 = tm.H_general(1,0,0,tm.BCrho,d_opt,r_opt);
	    var p2 = tm.H_general(1,0,1,tm.BCrho,d_opt,r_opt);
	    var distance1 = Math.distance3(p1,p2);
	    console.log(p1,p2,distance1);

	    var p3 = tm.H_general(-1,0,0,tm.BCrho,d_opt,r_opt);
	    var p4 = tm.H_general(-1,1,1,tm.BCrho,d_opt,r_opt);
	    var distance2 = Math.distance3(p3,p4);
	    console.log(p3,p4,distance2);	    
	    assert.equal(distance1,distance2);

	});
    });

	});
