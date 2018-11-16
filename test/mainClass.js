const assert = require('assert');
const chai = require('chai');
const sinon = require('sinon');

const Twinkly = require('../twinkly-api.js');

const baseIP = '1.2.3.4';

let twinklyInstance;
		
describe('Main Class', function() {
	beforeEach(function () {
		twinklyInstance = new Twinkly(baseIP);
	});
	it('should throw an error when no IP address is passed', function() {
		chai.expect(() => {
			new Twinkly()
		}).to.throw('Device address must be passed')
	});
	it('should return an object when setup correctly', function() {
		const twinkly =  new Twinkly(baseIP);
		chai.expect(twinkly).to.be.an('object');
	});

	describe('getBaseUrl', function() {
		it('Should return correct url', function() {
			chai.expect(twinklyInstance.getBaseUrl()).to.equal(`http://${baseIP}:80/xled/v1/`);
		});
	});
	describe('generateToken', function() {
		
	});
	describe('areCredentialsValid', function() {
		it('Should return false when there are no credentials', function () {
			twinklyInstance.credentials = undefined;
			chai.expect(twinklyInstance.areCredentialsValid()).to.equal(false);
		});
		
		it('Should return false when there is no authentication_token', function () {
			twinklyInstance.credentials = { expiry: 1234 };
			chai.expect(twinklyInstance.areCredentialsValid()).to.equal(false);
		});
		
		it('Should return false when expiry time has passed', function () {
			twinklyInstance.credentials = { expiry: 1234, authentication_token: 'fakeToken' };
			twinklyInstance.credentialsExpiry = (new Date().getTime()) - 1000;
			chai.expect(twinklyInstance.areCredentialsValid()).to.equal(false);
		});
		
		it('Should return true when token is in place and expiry has not passed', function () {
			twinklyInstance.credentials = { expiry: 1234, authentication_token: 'fakeToken' };
			twinklyInstance.credentialsExpiry = (new Date().getTime()) + 2000;
			chai.expect(twinklyInstance.areCredentialsValid()).to.equal(true);
		});
	});
	describe('makeAuthenticatedRequest', function() {
		
	});
	describe('setMode', function() {
		it('should build correct request', function () {
			const mock = sinon.mock(twinklyInstance);
	    	mock.expects("makeAuthenticatedRequest").once().withExactArgs('led/mode', 'post', { mode: "off" });
	    	twinklyInstance.setMode('off');
		});
		
	});
	describe('setDeviceName', function() {
		it('should build correct request', function () {
			const mock = sinon.mock(twinklyInstance);
	    	mock.expects("makeAuthenticatedRequest").once().withExactArgs('device_name', 'post', { name: "newName" });
	    	twinklyInstance.setDeviceName('newName');
		});
	});
	describe('resetDevice', function() {
		it('should build correct request', function () {
			const mock = sinon.mock(twinklyInstance);
	    	mock.expects("makeAuthenticatedRequest").once().withExactArgs('led/reset', 'post', {});
	    	twinklyInstance.resetDevice();
		});
	});
	describe('newMovieConfig', function() {
		it('should build correct request', function () {
			const delay = 1000;
			const leds = 175;
			const frames = 5;

			const mock = sinon.mock(twinklyInstance);
	    	mock.expects("makeAuthenticatedRequest").once().withExactArgs('led/movie/config', 'post', {
				frame_delay: delay,
				leds_number: leds,
				frames_number: frames
			});
	    	twinklyInstance.newMovieConfig(delay, leds, frames);
		});
		
	});
	describe('convertMovieFormat', function() {
		
	});
	describe('sendMovieToDevice', function() {
		it('should build correct request', function () {
			const movie = [{r:1,g:2,b:3},{r:100,g:200,b:300},{r:0,b:244,g:27}];
			const mock = sinon.mock(twinklyInstance);
	    	mock.expects("makeAuthenticatedRequest").once().withExactArgs('led/movie/full', 'post', movie, 'application/octet-stream');
	    	twinklyInstance.sendMovieToDevice(movie);
		});
	});
	describe('generateFullFrame', function() {
		it('should return correct sized frame', function () {
			const expected = [{r:43, g:98, b:165},{r:43, g:98, b:165},{r:43, g:98, b:165},{r:43, g:98, b:165}];
			const generatedFrames = twinklyInstance.generateFullFrame({r:43, g:98, b:165}, 4);
			chai.expect(generatedFrames).to.eql(expected);
		});
		it('should return correct sized frame', function () {
			const expected = [{r:43, g:98, b:165}];
			const generatedFrames = twinklyInstance.generateFullFrame({r:43, g:98, b:165}, 1);
			chai.expect(generatedFrames).to.eql(expected);
		});
	});
	describe('newMovieUpload', function() {
		
	});

});