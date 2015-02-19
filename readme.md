#Gulp Coffee Stylus Boilerplate

####Description
This project is a generic boiler plate for building front end projects written in stylus and coffee.

####Features
- Gulp task runner to compile client code
- Browsersync allows for faster development and debugging
- Use bower packages with RequireJS

####Organization

All development should be done in the src directory. /styles is for stylus files, /scripts is for coffee files.
<pre><code>
var Config = {
	paths: {
		src:   {
			root:     'src/root',
			styles:   'src/styles',
			scripts:  'src/scripts',
			media:    'src/media'
		},
		build: {
			root:     'build',
			styles:   'build/styles',
			scripts:  'build/scripts',
			media:    'build/media'
		}
	}
}
</code></pre>

####Other Requirements
- Development machines will need Node.js installed.

####Initialization
- **npm install**
- **bower install**


####Commands

- **gulp serve**: Build for development, and watch
- **gulp**: Build for development
- **gulp dist**: Build for distribution
