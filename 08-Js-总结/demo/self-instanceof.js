function myInstanceof(left, right) {
  if (left) {
    left = left.__proto__;
    while (true) {
      if (left) {
        if (left.constructor === right) {
          return true;
        }
        left = left.__proto__;
      } else {
        return false;
      }
    }
  }
  return false
}

console.log(new String("123") instanceof XX);
