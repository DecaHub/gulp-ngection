/**
 * Created by DecaHub on 3/10/17.
 */

"use strict";

const ngFinder = require("ngfinder");
const is = require("is");
const errHandler = require("./errorHandler");

class NGSource {
	
	constructor () {
		
		this.angularSource = [];
		this.extraSource = [];
		this.finderTask = null;
		
	}
	
	get () {
		
		return this.angularSource;
		
	}
	
	set (finderTask, additionalPaths) {
		
		this.finderTask = finderTask;
		
		this.angularSource.length = 0;
		this.extraSource.length = 0;
		
		this.angularSource = ngFinder(finderTask);
		
		if (is.array(additionalPaths)) {
			
			for (let i = 0; i < additionalPaths.length; ++i) {
				
				if (is.string(additionalPaths[i])) {
					
					this.angularSource.push(additionalPaths[i]);
					this.extraSource.push(additionalPaths[i]);
					
				}
				
			}
			
		}
		
		return this.angularSource;
		
	};
	
	refresh () {
		
		this.angularSource = ngFinder(this.finderTask);
		
		for (let i = 0; i < this.extraSource.length; ++i) {
			
			this.angularSource.push(this.extraSource[i]);
			
		}
		
		return this.angularSource;
		
	};
	
}

module.exports = new NGSource();
