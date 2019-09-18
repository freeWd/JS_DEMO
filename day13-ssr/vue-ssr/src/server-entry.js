import createApp from './app';

//  服务端会调用此函数产生新的app实例
export default (context) => {
    return new Promise((resolve, reject) => {
        let {
            app,
            router,
            store
        } = createApp();
        router.push(context.url); // 跳转到路由
        // 如果服务端启动时，直接访问 /foo, 返回的页面永远都是index.html 需要通过路由调整到指定路径
        // 为了防止路由中的异步逻辑（懒加载），所以采用promise的形式，等待路由加载完成后，返回vue实例，服务端才可以渲染出完整的页面

        // 需要把当前页面中匹配到的组件找到它的asyncData方法, 让它执行
        router.onReady(() => {
            // 获取当前路径匹配到的组件 看下组件中是否有asyncData方法
            let matchComponents = router.getMatchedComponents();
            Promise.all(matchComponents.map((component) => {
                if (component.asyncData) {
                    return component.asyncData({store});
                }
            })).then(() => {
                // 将vuex中的状态 挂载到上下文的state中 - 打包后访问server会自动在window中挂载一个属性：__INITIAL_STATE__
                context.state = store.state;

                // Vue-meta - 
                context.meta = app.$meta();

                // Promise 应该 resolve 应用程序实例，以便它可以渲染
                resolve(app)
            });
        }, reject)
    });
}