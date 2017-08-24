'use strict';

var chai = require('chai');

var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

var expect = chai.expect;

var FAADataHelper = require('../faa_data_helper');

chai.config.includeStack = true;
	

describe('FAADataHelper', function() {

  var subject = new FAADataHelper();

  var airport_code;

  describe('#getAirportStatus', function() {

	context('with a valid airport code', function() {

	  it('returns matching airport code', function() {

	    airport_code = 'HOU';

	    var value = subject.requestAirportStatus(airport_code).then(function(obj) {

	      return obj.IATA;

	    });

	    return expect(value).to.eventually.eq(airport_code);

	  });

	});

	context('with an invalid airport code', function() {
  
      it('returns invalid airport code', function() {
    
        airport_code = 'PUNKYBREWSTER';
        return expect(subject.requestAirportStatus(airport_code)).to.be.rejectedWith(Error);

      });

    });

  });

  describe( '#formatAirportStatus', function() {

    var status = {
		"delay": "true",
		"IATA": "HOU",
		"state": "Texas",
		"name": "Houston William P Hobby",
		"weather": {
			"visibility": 10,
			"weather": "Mostly Cloudy",
			"meta": {
				"credit": "NOAA's National Weather Service",
				"updated": "5:53 PM Local",
				"url": "http://weather.gov/"
			},
			"temp": "90.0 F (32.2 C)",
			"wind": "Southeast at 6.9mph"
		},
		"ICAO": "KHOU",
		"city": "Houston",
		"status": {
			"reason": "AIRLINE REQUESTED DUE TO DE-ICING AT AIRPORT / DAL AND DAL SUBS ONLY",
			"closureBegin": "",
			"endTime": "",
			"minDelay": "",
			"avgDelay": "57 minutes",
			"maxDelay": "",
			"closureEnd": "",
			"trend": "",
			"type": "Ground Delay"
		}
	};

	context('with a status containing no delay', function() {

	    it('formats the status as expected', function() {

	        status.delay = 'false';

	        expect(subject.formatAirportStatus(status)).to.eq('There is currently no delay at Houston William P Hobby. The current weather conditions are Mostly Cloudy, 90.0 F (32.2 C) and wind Southeast at 6.9mph.');

	    });

	});

	context('with a status containing a delay', function() {

	    it('formats the status as expected', function() {

	        status.delay = 'true';

	        expect(subject.formatAirportStatus(status)).to.eq('There is currently a delay for Houston William P Hobby. The average delay time is 57 minutes. Delay is because of the following: AIRLINE REQUESTED DUE TO DE-ICING AT AIRPORT / DAL AND DAL SUBS ONLY. The current weather conditions are Mostly Cloudy, 90.0 F (32.2 C) and wind Southeast at 6.9mph.');

	    });

    });


  });

});


