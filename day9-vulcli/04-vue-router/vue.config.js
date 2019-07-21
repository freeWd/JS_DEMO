const path = require('path');

module.exports = {
    chainWebpack: config => {
        config.resolve.alias.set('_views', path.resolve(__dirname, 'src/views'));
        config.resolve.alias.set('_comps', path.resolve(__dirname, 'src/components'))
    }
}