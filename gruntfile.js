module.exports = function(grunt) {

	grunt.initConfig({

		// Import package manifest
		pkg: grunt.file.readJSON("package.json"),

		// Banner definitions
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.repository.url %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.license %> License\n" +
				" */\n"
		},

		// Concat definitions
		concat: {
			options: {
				banner: "<%= meta.banner %>"
			},
			dist: {
				src: ["src/jquery.passwordvalidate.js"],
				dest: "dist/jquery.passwordvalidate.js"
			}
		},

		// Minify definitions
		uglify: {
			my_target: {
				src: ["dist/jquery.passwordvalidate.js"],
				dest: "dist/jquery.passwordvalidate.min.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		// CoffeeScript compilation
		coffee: {
			compile: {
				files: {
					"src/jquery.passwordvalidate.js": "src/jquery.passwordvalidate.coffee"
				},
				options: {
					bare: true
				}
			}
		},

		// watch for changes to source
		// Better than calling grunt a million times
		// (call 'grunt watch')
		watch: {
		    files: ['src/*'],
		    tasks: ['default']
		},

		// Lint definitions
		jshint: {
			files: ["src/jquery.passwordvalidate.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		}

	});

	grunt.loadNpmTasks("grunt-contrib-coffee");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("build", ["coffee", "concat", "uglify"]);
	grunt.registerTask("default", ["build"]);
	grunt.registerTask("travis", ["default"]);

};
