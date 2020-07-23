class DonePlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        // 同步
        // compiler.hooks.done.tap('DonePlugin', (stats) => {
        //     console.log('DonePlugin ====> ', this.options.name);
        // });
        // 异步
        compiler.hooks.done.tapAsync('DonePlugin', (stats, callback) => {
            console.log('DonePlugin=====> ', this.options.name);
            callback();
        });
    }
}
module.exports = DonePlugin;