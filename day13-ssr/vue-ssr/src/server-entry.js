import createApp from './app';

//  服务端会调用此函数产生新的app实例
export default () => {
    let { app } = createApp();
    return app;
}