const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin');
const path = require('path');

module.exports = {
    pwa: {
        name: 'My App',
        themeColor: '#f2f2f2',
        msTileColor: '#aaaaa',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',

        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            // swSrc is required in InjectManifest mode.
            swSrc: 'dev/service-worker.js',
        }
    },
    configureWebpack: {
        plugins: [
            // new SkeletonWebpackPlugin({
            //     webpackConfig: {
            //         entry: {
            //             app: path.resolve(__dirname, 'src/skeleton.js')
            //         }
            //     }
            // })
            // new SkeletonWebpackPlugin({
            //     webpackConfig: {
            //         entry: {
            //             app: path.join(__dirname, './src/skeleton.js'),
            //         },
            //     },
            //     router: {
            //         mode: 'history',
            //         routes: [{
            //                 path: '/',
            //                 skeletonId: 'skeletonA'
            //             },{
            //                 path: '/about',
            //                 skeletonId: 'skeletonB'
            //             }
            //         ]
            //     },
            //     minimize: true,
            //     quiet: true,
            // })
            new MyPlugin()
        ]
    }
}


// 骨架屏的实现原理
class MyPlugin {
    apply(compiler) { // compiler是当前整个webpack打包的对象
        compiler.plugin('compilation', (compilation) => { // compliation是当前这次打包是产生
            compilation.plugin(
                'html-webpack-plugin-before-html-processing',
                (data) => {
                    data.html = data.html.replace(`<div id="app"></div>`, `
                        <div id="app">
                            <div id="home" style="display:none">首页 骨架屏</div>
                            <div id="about" style="display:none">about页面骨架屏</div>
                        </div>
                        <script>
                            if(window.hash == '#/about' ||  location.pathname=='/about'){
                                document.getElementById('about').style.display="block"
                            }else{
                                document.getElementById('home').style.display="block"
                            }
                        </script>
                    `);
                    return data;
                }
            )
        });
    }
}