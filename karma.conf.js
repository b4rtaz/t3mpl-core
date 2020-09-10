module.exports = function(config) {
	config.set({
		frameworks: [ 'jasmine', 'karma-typescript' ],
		files: [
			{ pattern: 'src/**/*.ts' }
		],
		preprocessors: {
		  'src/**/*.ts': [ 'karma-typescript' ]
		},
		exclude: [
			'src/t3mpl.ts'
		],
		karmaTypescriptConfig: {
			tsconfig: './tsconfig.json',
		},
		plugins: [
			require('karma-jasmine'),
			require('karma-chrome-launcher'),
			require('karma-firefox-launcher'),
			require('karma-typescript'),
			require('karma-spec-reporter')
		],
		reporters: [ 'progress', 'karma-typescript' ],
		browsers: [ 'ChromeHeadless', 'FirefoxHeadless' ],
		autoWatch: true
	})
}
