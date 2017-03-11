/**
 * Created by DecaHub on 3/8/17.
 */

"use strict";

const is = require("is");

const isInvalidObj = function (obj) {
	
	let state = "";
	let error = false;
	
	
	if (!obj) {
		
		if (obj === "") {
			
			state = "empty string";
			
		} else {
			
			state = obj;
			
		}
		
		error = true;
		
	} else if (Object.keys(obj).length === 0 && obj.constructor === Object) {
		
		state = "empty object";
		error = true;
		
	} else if (!is.object(obj)) {
		
		throw new Error("ngFinder didn't get a Finder Task object. Please pass an object with the proper format and properties.");
		
	}
	
	if (error) {
		
		throw new Error(`ngFinder got ${state} as argument. Please pass an object with the proper format and properties.`);
		
	}
	
};

module.exports = {isInvalidObj};

