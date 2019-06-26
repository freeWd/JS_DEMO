// var obj = {
//     prop: 1,
//     func: function () {
//         var _this = this;

//         var innerFunc = () => {
//             this.prop = 1;
//         };

//         var innerFunc1 = function () {
//             this.prop = 1;
//         };
//     },
// };

// obj.func();

// var arr = [1,2,3];

// var obj2 = {
//     arr: [],
//     test: function() {
//         console.log(arr);
//     }
// }

// var fn = obj2.test;
// fn();


function test() {
    var a1 = 123;
    let a1 = 234;
    if (true) {
        let a1 = 456;

        function test1() {
            console.log(a1);
        }

        tesst1();
    }
}