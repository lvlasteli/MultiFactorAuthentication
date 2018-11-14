'use strict'
const crypto = require('crypto');

function intToBytes(num) {
	let bytes = [];

	for(let i=7 ; i>=0 ; --i) {
		bytes[i] = num & (255);
		num = num >> 8;
	}

    return bytes;
}
function hexToBytes(hex) {
	let bytes = [];
	for(let c = 0, C = hex.length; c < C; c += 2) {
		bytes.push(parseInt(hex.substr(c, 2), 16));
	}
	return bytes;
}

/*generate HOTP <<Counter bassed>> One Time password
  args
        key - Key for the one time password.  This should be unique and secret for
         every user as this is the seed that is used to calculate the HMAC

        counter - Counter value.  This should be stored by the application, must
         be user specific, and be incremented for each request.

*/
const hotp = {};
hotp.gen = (key, opt) => {
	key = key || '';
	opt = opt || {};
	const counter = opt.counter || 0;
	const characters = opt.characters || 6;
	let modulo = '1';
	
	for(let x = characters; x--;) {
		modulo = modulo + '0'; 
	}

	// Create the byte array
	const b = Buffer.from(intToBytes(counter));

	const hmac = crypto.createHmac('sha1', Buffer.from(key));

	// Update the HMAC with the byte array
	const digest = hmac.update(b).digest('hex');

	// Get byte array
	const h = hexToBytes(digest);

	// Truncate
	const offset = h[19] & 0xf;
	let v = (h[offset] & 0x7f) << 24 |
		(h[offset + 1] & 0xff) << 16 |
		(h[offset + 2] & 0xff) << 8  |
		(h[offset + 3] & 0xff);
	v = ( v % parseInt(modulo)) + '';
	return Array((characters + 1) - v.length).join('0') + v;
};
/*verify OTP based on a counter

    key - -||-

    token - Passcode to validate.
 
    window - The allowable margin for the counter.  The function will check
          'W' codes in the future against the provided passcode.  Note,
          it is the calling applications responsibility to keep track of
          'W' and increment it for each password check, and also to adjust
          it accordingly in the case where the client and server become
          out of sync (second argument returns non zero).
          E.g. if W = 100, and C = 5, this function will check the passcode
          against all One Time Passcodes between 5 and 105.
 
          Default - 3-100, 3 is a standard and 100 is bad for brute force attacks

          counter- -||-
*/
hotp.verify = (token, key, opt) => {
	opt = opt || {};
	const window = opt.window || 3;
	const counter = opt.counter || 0;
	
	const loopStart = opt._totp ? counter - window : counter;
	// Now loop through from C (C - W in case of TOTP)
	// to C + W to determine if there is a correct code
	for(let i = loopStart; i <=  counter + window; ++i) {
		opt.counter = i;
		if(hotp.gen(key, opt) === token) {
			// We have found a matching code, trigger callback
			// and pass offset
			return { delta: i - counter };
		}
	}

	// If we get to here then no codes have matched, return null
	return null;
};

/*generate TOTP <<Time based>> One time password

    args
        key - Key for the one time password.  This should be unique and secret for
          every user as it is the seed used to calculate the HMAC
 
        time - The time step of the counter.  This must be the same for
        every request and is used to calculat C.
 
        Default - 30

*/
const totp = {};
totp.gen = (key, opt) => {
    opt = opt || {};
    let time = opt.time || 30;
    let _t = Date.now();
   // Determine the value of the counter, C
    // This is the number of time steps in seconds since T0
    opt.counter = Math.floor((_t / 1000) / time);
    return hotp.gen(key, opt);
}

totp.verify = (token, key, opt) => {
	opt = opt || {};
	let time = opt.time || 30;
	let _t = Date.now();

	// Determine the value of the counter, C
	// This is the number of time steps in seconds since T0
	opt.counter = Math.floor((_t / 1000) / time);
	//if we want allow to validate token but with sync value!=0
	//opt._totp = true;
	return hotp.verify(token, key, opt);
};

module.exports.hotp = hotp;
module.exports.totp = totp;