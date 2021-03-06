"use strict";

const namespaces = {};
const adapter = {
	namespaces,
	init( ns ) {
		if ( !namespaces[ ns ] ) {
			namespaces[ ns ] = { entries: [] };
		}
		namespaces[ ns ].entries = {
			info: [],
			debug: [],
			warn: [],
			error: []
		};
		return namespaces[ ns ];
	},
	reset( ns ) {
		this.init( ns );
	},
	onLog( data ) {
		let ns = namespaces[ data.namespace ];
		if ( !ns ) {
			ns = this.init( data.namespace );
		}
		ns.entries[ data.type ].push( data.msg );
	}
};

_.bindAll( adapter, [ "init", "reset", "onLog" ] );

module.exports = function mockLogAdapter( config ) {
	if ( _.isObject( config ) ) {
		return adapter;
	} else if ( config ) {
		const ns = _.isArray( config ) ? config : [ config ];
		ns.forEach( adapter.init.bind( adapter ) );
		return adapter;
	}
	return namespaces;
};
