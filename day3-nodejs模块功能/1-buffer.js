// 将字符串转化为16进制
let buffer = Buffer.from('测试');

// 将16进制的buffer转化为字符串,node只支持utf8格式
console.log(buffer.toString());
console.log(buffer.toString('base64'));


let r =  parseInt('ff', 16);
console.log((255).toString(16));
console.log(r);



// 看看base64的逻辑
console.log(parseInt("00111001", 2));
console.log(parseInt("00101011", 2));
console.log(parseInt("00010110", 2));
console.log(parseInt("00001011", 2));

console.log("ABCDEFGHIJKLMNOPQRSTUVWXYZ".toLocaleLowerCase());

let buffer = Buffer.from('测');
console.log(buffer);
console.log(buffer.toString('base64'));

console.log(parseInt('111111',2))

console.log(Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]))

// buffer 裁剪
let b = Buffer.from('测试');
console.log(b.slice(3).toString());

// buffer 拼接
let b1 = Buffer.from('测');
let b2 = Buffer.from('试');
console.log(b1.length);

let big1 = Buffer.alloc(6);
b1.copy(big1, 0, 0, 3);
b2.copy(big1, 3, 0, 3);
console.log(big1.toString());

let big2 = Buffer.concat([b1, b2]);
console.log(big2.toString());

// 手写个concat方法
Buffer.concat = function(arr) {
    let allLength = 0;
    let start = 0;
    arr.forEach((item) => {
        allLength += item.length;
    })
    let tempBig = Buffer.alloc(allLength);
    arr.forEach((item) => {
        item.copy(tempBig, start, 0, item.length);
        start += item.length;
    });
    return tempBig;
}


let big3 = Buffer.concat([b1, b2]);
console.log(big3.toString());



