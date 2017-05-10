module.exports = {
	entry: './index.js',
	output: {
		path: __dirname + '/dist',
		filename: 'bundle.js'
	},
	module: {
		loaders: [{
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: /node_modules/,
			query: {
				presets: ['es2015', 'stage-0']
			}
		}]
	},
	resolve: {
		extensions: ['.js', '.json']
	},
	devtool: "inline-source-map"
}