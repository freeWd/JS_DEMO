const test = [1,2,3]

const oldPush = test.push.bind(test)

function newPush(val) {
    console.log(val, '<-----')
    oldPush(val)
}

test.push = newPush


// test.push(4);


const test2 = ['x']
test2.push('y')

