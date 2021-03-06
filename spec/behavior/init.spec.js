const path = require( "path" );
const wp = require( "../../src/index.js" );
const adapterPath = path.resolve( `${ __dirname }/../adapters` );
const publishAsync = `${ adapterPath }/publishAsync.js`;
const publishSync = `${ adapterPath }/publishSync.js`;
const config = {
	adapters: {}
};

config.adapters[ publishSync ] = {
	level: 5
};

config.adapters[ publishAsync ] = {
	level: 5
};

describe( "Whistlepunk Synchronous Initialization", function() {
	describe( "when initializing whistlepunk", function() {
		let logFactory, log, syncLogReceived, asyncLogReceived, msg;

		before( function() {
			msg = "You been whistlepunk'd";
			postal.subscribe( {
				channel: "wp-test",
				topic: "publishSync",
				callback( data ) {
					syncLogReceived = data;
				}
			} );

			postal.subscribe( {
				channel: "wp-test",
				topic: "publishAsync",
				callback( data ) {
					asyncLogReceived = data;
				}
			} );

			logFactory = wp( postal, config );
			log = logFactory( "wp-tests" );
			log.info( msg );
		} );

		after( function() {
			postal.reset();
		} );

		it( "should be immediately available", function() {
			syncLogReceived.should.equal( msg );
		} );

		it( "should queue logs for async adapters", function( done ) {
			this.timeout( 1000 );

			( typeof asyncLogReceived ).should.equal( "undefined" );

			setTimeout( function() {
				asyncLogReceived.should.equal( msg );
				done();
			}, 500 );
		} );
	} );
} );
