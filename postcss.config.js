module.exports = {
	syntax: 'postcss-scss',
	plugins: [
		require('postcss-import'),
		require('postcss-color-function'),
		require('postcss-utilities'),
		require('postcss-nested'),
		require('postcss-strip-inline-comments')
	]
};
