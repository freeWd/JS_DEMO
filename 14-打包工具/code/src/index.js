// const ele = document.getElementById('app');
// ele.innerHTML = "APP Tag";

// import $ from 'jquery';

// 加载此模块，
$("#app").html("APP Tag");

// 在js里面加载css代码
// css不是js模块，需要转换，这些转换的工具就是loader
require("./index.css");

// 当在多个不同的模块里面需要使用一个公共库的时候， 比如jquery
// 方法一 （直接引入）在每个模块中 import $ from 'jquery'; - 这样不合适：每个js都很大
// 方法二 插件引入 webpack配置ProvidePlugin后，在使用时将不再需要import和require进行引入，直接使用即可
// 方法三 expose-loader 不需要任何其他的插件配合，只要将下面的代码添加到所有的loader之前
