/*

    Copyright 2017, Robert L. Read

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

var red_phase = 0;
var yellow_phase = 1;
var blue_phase = 2;

var BCtheta = Math.acos(-2/3);
var BCrho = 3*BCtheta - 2 * Math.PI;
var BCh = (1/Math.sqrt(10));
var BCd = (3/Math.sqrt(10));
var BCr = (3 * Math.sqrt(3) / 10);

// This from https://github.com/josdejong/Mathjs/blob/develop/lib/utils/bignumber/nearlyEqual.js
function nearlyEqual(x, y, epsilon) {
  // if epsilon is null or undefined, test whether x and y are exactly equal
  if (epsilon == null) {
    return x === y;
  }


  // use "==" operator, handles infinities
  if (x == y) {
    return true;
  }

  // NaN
  if (isNaN(x) || isNaN(y)) {
    return false;
  }

    // check numbers are very close, needed when comparing numbers near zero
    var diff = Math.abs(x-y);
    if (diff == 0) {
      return true;
    }
    else {
	if (diff < epsilon)
	    return true;
    }

  // Infinite and Number or negative Infinite and positive Infinite cases
  return false;
};

function PColorHelix(n,phase,lambda) {
    var pnt = [];
    var r = (3 * Math.sqrt(3) / 10);
    var rl = (r - 1/Math.sqrt(3))*lambda + 1/Math.sqrt(3);
    var h = BCh;
    var hl = (h - 1/3)*lambda + 1/3;    
    var x = n+phase/3.0;
    var theta = Math.acos(-2/3);
    var slow = (3*theta - Math.PIi*2);
    var third = 2*Math.PI/3.0;
    // Note the subtle distinct here...
    // in fact:
    //   slow *(n+phase/3.0) + phase*third == slow * n + phase*theta!
    //
    var angle = slow * x * lambda+ phase*third;
    pnt[0] = rl * Math.cos(angle);
    pnt[1] = rl * Math.sin(angle);
    pnt[2] = (x) * 3 * hl;
    return pnt;
}

function find_drho_from_r_el(rho,r,el) {
    var sin_r_2 = Math.sin(rho/2);
    var d = Math.sqrt(el*el - 4 * r * r * sin_r_2 * sin_r_2);
    return d;
}

function find_rrho_from_d_el(rho,d,el) {
    var sin_r_2 = Math.sin(rho/2);
    var r = Math.sqrt(el*el - d*d) / (2 * sin_r_2);
    return r;
}
function find_drho_from_r(rho,r) {
    return find_drho_from_r_el(rho,r,1)
}

function find_rrho_from_d(rho,d) {
    return find_rrho_from_d_el(rho,d,1);
}


function H_general(n,c,rho,d,r) {
    var pnt = [];
    var kappa = n+ c/3.0;
    var rk = rho*kappa;
    var angle = rk + c*2*Math.PI/3;
    pnt[0] = r*Math.cos(angle);
    pnt[1] = r*Math.sin(angle);
    pnt[2] = d*kappa;
    return pnt;
}

function H_bc(n,c) {
    var BCr = find_rrho_from_d(BCrho,BCd);
    return H_general(n,c,BCrho,BCd,BCr);
}

function H_bc_el(n,c,el) {
    var BCdl = BCd*el;
    var BCrl = el * find_rrho_from_d(BCrho,BCd);
    return H_general(n,c,BCrho,BCdl,BCrl);
}


function H_bc_eqt_lambda(n,c,lambda) {
    // Note this is a particular scheme for parametrization.
    // Now we must compute r and h....
    // "0" is the equitetrabeam
    // "1" is the BC helix
    var r0 =  Math.sqrt(20/63);
    var d0 = 1;
    var rho0 = 0;
    
    var r1 = BCr;
    var d1 = BCd;
    var rho1 = BCrho;

    return H_interp_lambda(lambda,n,c,rho0,d0,r0,rho1,d1,r1);
}

// Interpolate between (rho0,d0,r0,l0) and (rho1,d1,r1,l1)
function H_interp_lambda(lambda,n,c,rho0,d0,r0,rho1,d1,r1) {
    
    var di = (d1 - d0)*lambda + d0;
    var rhoi = (rho1 - rho0)*lambda + rho0;
    var ri = (r1 - r0)*lambda + r0;
    
    return H_general(n,c,rhoi,di,ri);
}

function test_rail_angle_formula_against_BC() {
    var BCr_check = find_rrho_from_d(BCrho,BCd);
    var BCd_check = find_drho_from_r(BCrho,BCr);
    assert(nearlyEqual(BCr,BCr_check,0.0000001),
	   'BCr nearly equal fail '+BCr+', BCr_check == '+BCr_check);    
    assert(nearlyEqual(BCd,BCd_check,0.0000001),
	   'BCd == '+BCd+', BCd_check == '+BCd_check);
}

function test_H_general_against_BC() {
    var R0 = H_bc(0,0);
    var R1 = H_bc(1,0);
    var Y0 = H_bc(0,1);
    var B0 = H_bc(0,2);
    assert(nearlyEqual(Math.distance(R0,R1),1,0.0000001),"\n R0 = " + R0 +"\n R1 = " + R1 +"\n distance =" + Math.distance(R0,R1));
    assert(nearlyEqual(Math.distance(R0,Y0),1,0.0000001),"\n R0 = " + R0 +"\n Y0 = " + Y0 +"\n distance =" + Math.distance(R0,Y0));
    assert(nearlyEqual(Math.distance(R0,B0),1,0.0000001),"\n R0 = " + R0 +"\n B0 = " + B0 +"\n distance =" + Math.distance(R0,B0));

}

function major_test() {
var reds = [];
var otherreds = [];
var blues = [];
var otheryells = [];
var yells = [];
var otherblues = [];
// var lambda = 1.0;
var lambda = 1.0;
var third = 120*Math.PI/180.0;    
for(var i = 0; i < 4; i++) {

    var red = H_bc_lambda(i,red_phase,lambda);    
    var otherr = PColorHelix(i,red_phase,lambda);
    otherreds.push(otherr);
    var yell = H_bc_lambda(i,yellow_phase,lambda);        
    var othery = PColorHelix(i,yellow_phase,lambda);
    otheryells.push(othery);
    var blue = H_bc_lambda(i,blue_phase,lambda);    
    var otherb = PColorHelix(i,blue_phase,lambda);
    otherblues.push(otherb);
    
    reds.push(red);
    yells.push(yell);    
    blues.push(blue);
//    console.log(red,yell,blue);
}
console.log("reds");
console.log(reds);
console.log("otherreds");
console.log(otherreds);
console.log("yells");
console.log(yells);
console.log("otheryells");
console.log(otheryells);
console.log("blues");
console.log(blues);
console.log("otherblues");
console.log(otherblues);
for(var i = 0; i < 3; i++) {
    console.log("red");
//    console.log(Math.distance([Math.number(reds[i][0]),Math.number(reds[i][1]),Math.number(reds[i][2])],
//			      [Math.number(reds[i+1][0]),Math.number(reds[i+1][1]),Math.number(reds[i+1][2])]));

    console.log("blue");
 //   console.log(Math.distance([Math.number(blues[i][0]),Math.number(blues[i][1]),Math.number(blues[i][2])],
//			      [Math.number(blues[i+1][0]),Math.number(blues[i+1][1]),Math.number(blues[i+1][2])]));
   console.log(Math.distance(blues[i],blues[i+1]));
    console.log("yellow");
    console.log(Math.distance(yells[i],yells[i+1]));
 //   console.log(Math.distance([Math.number(yells[i][0]),Math.number(yells[i][1]),Math.number(yells[i][2])],
//			      [Math.number(yells[i+1][0]),Math.number(yells[i+1][1]),Math.number(yells[i+1][2])]));
    
    console.log("orangeeven");
    console.log(Math.distance(reds[i],yells[i]));

  //  console.log(Math.distance([Math.number(reds[i][0]),Math.number(reds[i][1]),Math.number(reds[i][2])],
//			      [Math.number(yells[i][0]),Math.number(yells[i][1]),Math.number(yells[i][2])]));

  //  var red_dist = Math.distance([Math.number(reds[i][0]),Math.number(reds[i][1]),Math.number(reds[i][2])],
//			      [Math.number(yells[i][0]),Math.number(yells[i][1]),Math.number(yells[i][2])])
    
    console.log("orangeodd");
    
    console.log(Math.distance(yells[i],reds[i+1]));
  //  console.log(Math.distance([Math.number(yells[i][0]),Math.number(yells[i][1]),Math.number(yells[i][2])],
//			      [Math.number(reds[i+1][0]),Math.number(reds[i+1][1]),Math.number(reds[i+1][2])]));

    console.log("purpleeven");
   console.log(Math.distance(reds[i],blues[i]));
 //   console.log(Math.distance([Math.number(reds[i][0]),Math.number(reds[i][1]),Math.number(reds[i][2])],
//			      [Math.number(blues[i][0]),Math.number(blues[i][1]),Math.number(blues[i][2])]));
    console.log("purpleodd");

 //   console.log(Math.distance([Math.number(blues[i][0]),Math.number(blues[i][1]),Math.number(blues[i][2])],
//			      [Math.number(reds[i+1][0]),Math.number(reds[i+1][1]),Math.number(reds[i+1][2])]));

    console.log(Math.distance(blues[i],reds[i+1]));

    console.log("greeneven");
    console.log(Math.distance(yells[i],blues[i]));
 //   console.log(Math.distance([Math.number(yells[i][0]),Math.number(yells[i][1]),Math.number(yells[i][2])],
//			      [Math.number(blues[i][0]),Math.number(blues[i][1]),Math.number(blues[i][2])]));
    
    console.log("greenodd");
    console.log(Math.distance(blues[i],yells[i+1]));
//    console.log(Math.distance([Math.number(blues[i][0]),Math.number(blues[i][1]),Math.number(blues[i][2])],
//			      [Math.number(yells[i+1][0]),Math.number(yells[i+1][1]),Math.number(yells[i+1][2])]));

 //   var green_odd_dist = Math.distance([Math.number(blues[i][0]),Math.number(blues[i][1]),Math.number(blues[i][2])],
//			      [Math.number(yells[i+1][0]),Math.number(yells[i+1][1]),Math.number(yells[i+1][2])])

 //   console.log("longest by shortest");
    //  console.log(red_dist/ green_odd_dist);
/*    for(var j = 0; j < 1; j = j + 0.1) {
	var azero = NColorHelix(j,red_phase);
	var yzero = NColorHelix(j,yellow_phase);
	//	var bzero = NColorHelix(j,blue_phase);
	var bzero = NColorHelix(j,blue_phase);	
	console.log(azero,yzero,bzero);
	// These angle calculations appear to be wrong.
	var ar = Math.tan(azero[1]/azero[0]);	
	var ay = Math.tan(yzero[1]/yzero[0]);
	var ab = Math.tan(bzero[1]/bzero[0]);
	console.log(180*ar/Math.pi,180*ay/Math.pi,180*ab/Math.pi);
    }
*/
    
}
}

//test_rail_angle_formula_against_BC();
//test_H_general_against_BC();