// 使用 compiler 对象时，你可以绑定提供了编译 compilation 引用的回调函数，
// 然后拿到每次新的 compilation 对象。这些 compilation 对象提供了一些钩子函数，来钩入到构建流程的很多步骤中

class AssetPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.compilation.tap("AssetPlugin", function (compilation) {
      compilation.hooks.chunkAsset.tap("AssetPlugin", function (
        chunk,
        filename
      ) {
        console.log("filename ====>", filename);
      });
    });
  }
}
module.exports = AssetPlugin;
