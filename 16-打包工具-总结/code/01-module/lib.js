// export let data = 'data'
// export function modify() {
//     data = 'modified data'
// }


let data = 'data'
let obj = {
    a: '123'
}
function modify() {
    data = 'modified data',
    obj.a = '456'
}
module.exports = {
    obj,
    data,
    modify
}