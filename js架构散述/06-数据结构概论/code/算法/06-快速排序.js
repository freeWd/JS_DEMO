// 在列表中选择一个元素最为基准值，排序围绕这个基准值进行，将列表中小于基准值的放入数组底部，大于基准值的放入数组顶部

function quickSort(arr) {
    if (arr.length === 0) {
        return [];
    }

    var smallArr = [];
    var bigArr = [];
    var point = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > point ) {
            bigArr.push(arr[i])
        } else {
            smallArr.push(arr[i])
        }
    }
    return quickSort(smallArr).concat(point, quickSort(bigArr));
}



// example ===>
var data = [44, 75, 23, 43, 55, 12, 64, 77, 33];
console.log(quickSort(data));