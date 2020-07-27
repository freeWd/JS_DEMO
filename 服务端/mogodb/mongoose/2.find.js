// 手写 - 模拟mogoose中的通过model进行的find操作
class User {
    constructor() {
        this.users = [];
        for(let i = 0; i< 10; i++) {
            this.users.push({username: 'wd' + i, age: i + 1});
        }
        this.sortKey;
        this.sortNum;
        this.limitNum = 20;
        this.skipNum = 0;
    }

    sort(sorter) { // {username: -1}
        this.sortKey = Object.keys(sorter)[0];
        this.sortNum = sorter[this.sortKey];
        return this;
    }

    limit(pageSize) {
        this.limitNum = pageSize;
        return this;
    }

    skip(skipNum) {
        this.skipNum = skipNum;
        return this;
    }

    exec(callBack) {
        const result = this.users.sort((a, b) => { // 1,2,3
            return (a[this.sortKey] - b[this.sortKey])*this.sortNum;
        }).slice(this.skipNum, this.limitNum);
        callBack(null, result);
    }
}


let pageSize = 5;
let pageNum = 1;
new User().sort({age: 1}).limit(pageSize).skip((pageNum-1)*pageSize).exec((err, docs) => {
    console.log(docs);
});

