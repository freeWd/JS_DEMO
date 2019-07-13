console.log(process.env.NODE_ENV)

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/vue-project' : '/',
  lintOnSave: false,
  assetsDir: 'static',
  productionSourceMap: false,

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: []
    }
  }
}
