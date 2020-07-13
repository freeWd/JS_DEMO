console.log('print hello world 123');

export function printMe() {
    console.log('Updating print.js 1234');
}

export function unImportUsedFn() {
    console.log('这是个没有被导入过的方法');
}

export function unUsedFn() {
    console.log('这是个被导入但是不被执行的方法');
}

export const num = 100;


