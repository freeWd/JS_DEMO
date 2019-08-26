const CACHE_NAME = 'cache v_' + 1; //默认情况下，sw文件变化后会重新注册serviceWorker

const CACHE_LIST = [
    '/',
    '/index.html',
    '/main.js',
    '/api/img'
]

function fetchAddSave(request) { // 获取数据后进行缓存
    // 如果请求到了就更新缓存
    return fetch(request).then(res => { // node中res是可写流
        // 更新缓存
        let r = res.clone(); // res必须clone,因为它是流，使用一次后就销毁了 
        caches.open(CACHE_NAME).then(cache => cache.put(request, r))
        return res;
    })
}

self.addEventListener('fetch', (e) => { // 线程中不能发ajax 但可以用fetch - 基于promise
    console.log(e.request.url);
    // 缓存策略有多种，包括缓存优先，网络优先
    if (e.request.url.includes('/api/')) { // 请求的是接口
        return e.respondWith(
            fetchAddSave(e.request).catch((error) => {
                // 异常说明请求失败，断网，就去缓存中看看有没有, 有就将缓存的内容返回
                return caches.open(CACHE_NAME).then(cache => cache.match(e.request));
            })
        )
    }

    // 如果联网的话就发请求 
    e.respondWith( // 用什么内容返回当前的响应
        fetch(e.request).catch((error) => {
            // 异常说明请求失败，断网，就去缓存中看看有没有, 有就将缓存的内容返回
            return caches.open(CACHE_NAME).then(cache => cache.match(e.request));
        })
    )
});

// 缓存 需要缓存的内容
function preCache() {
    // 开启一个缓存空间
    return caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(CACHE_LIST)
    });
}

self.addEventListener('install', (e) => {
    // 如果上一个serviceWorker不能销毁 需要手动skipWaiting
    console.log('install');
    e.waitUntil(
        preCache().then(() => {
            return skipWaiting();
        })
    ) // 等等promise执行完成
})

function clearCache() {
    return caches.keys().then(keys => {
        return Promise.all(keys.map(key => {
            if (key !== CACHE_NAME) {
                return caches.delete(key);
            }
        }))
    })
}

// 激活当前的serviceWorker 
// 如果要让service立即生效，self.clients.claim()
self.addEventListener('activate', (e) => {
    console.log('activate');
    e.waitUntil(
        Promise.all([
            clearCache(),
            self.clients.claim()
        ])
    )
})