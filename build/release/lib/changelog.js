"use strict";

var fs = require( "fs" ),
	changelogplease = require( "changelogplease" ),
	chalk = require( "chalk" );

module.exports = function( Release ) {

Release.define( {
	_generateChangelog: function( callback ) {
		Release._generateCommitChangelog( function( commitChangelog ) {
			Release._generateGithubChangelog( function( issueChangelog ) {
				var changelogPath = Release.dir.base + "/changelog",
					changelog = Release.changelogShell() +
						commitChangelog +
						"\n\n\n" +
						"--- Issue List ---\n" +
						issueChangelog;

				fs.writeFileSync( changelogPath, changelog );
				console.log( "Stored changelog in " + chalk.cyan( changelogPath ) + "." );

				callback();
			} );
		} );
	},

	changelogShell: function() {
		return "";
	},

	_generateCommitChangelog: function( callback ) {
		console.log( "Adding commits..." );

		changelogplease( {
			ticketUrl: Release._ticketUrl() + "{id}",
			commitUrl: Release._repositoryUrl() + "/commit/{id}",
			repo: Release.dir.repo,
			committish: Release.prevVersion + ".." + Release.newVersion
		}, function( error, log ) {
			if ( error ) {
				Release.abort( "Error generating commit changelog.", error );
			}

			callback( log );
		} );
	}
} );

};
