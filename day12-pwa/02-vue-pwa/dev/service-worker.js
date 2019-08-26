// ----- 自定义缓存配置

// 缓存的名字
workbox.core.setCacheNameDetails({prefix: "02-vue-pwa"});

// 缓存的列表
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();

// 把文件列表缓存起来
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// 新增缓存策略 - 自己增加配置
workbox.routing.registerRoute(
    function(obj){  // 函数返回true则缓存
        // 包涵api的就缓存下来
        return obj.url.href.includes('/user')
    },
    workbox.strategies.staleWhileRevalidate() // 使用这个缓存策略
);


// workbox 专门做缓存的库 


// 首屏加载 - 骨架屏 app-skeleton