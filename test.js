function *test() {
  const a = yield new Promise(resolve => {
    setTimeout(() => {
      resolve(123)
    }, 1000)
  })
  return a
}


function test2() {
  let it = test();
  function inner(data) {
    const { value, done } = it.next(data)
    if (done) {
      return value
    } else {
      value.then(val => {
        inner(val)
      })
    }
  }
  inner();
}


console.log(test2())