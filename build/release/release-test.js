"use strict";

var shell = require( "shelljs" );
var Release = {
	define: function( props ) {
		for ( var key in props ) {
			Release[ key ] = props[ key ];
		}
	},
	exec: function( _options, errorMessage ) {
		var result,
			command = _options.command || _options,
			options = {};

		if ( _options.silent ) {
			options.silent = true;
		}

		errorMessage = errorMessage || "Error executing command: " + command;

		result = shell.exec( command, options );
		if ( result.code !== 0 ) {
			Release.abort( errorMessage );
		}

		return result.output;
	},
	abort: function() {
		console.error.apply( console, arguments );
		process.exit( 1 );
	},
	newVersion: require( "../../package.json" ).version
};

var script = require( "./release" );
script( Release );

// If AUTHORS.txt is outdated, this will update it
// Very annoying during an actual release
shell.exec( "grunt update-authors" );

Release.generateArtifacts( function() {
	console.log( "Done generating artifacts, verify output, should be in dist/cdn" );
} );
