import utils from './util.js';

class AddBookVo {
  constructor(name, price) {
    this.name = name || "";
    this.price = price || "";
  }

  add() {
    fetch("/add", {
      body: JSON.stringify(this),
      header: {
        "content-type": "application/json"
      },
      method: "POST"
    })
      .then(response => response.json())
      .then(val => {
        console.log(val);
      });
  }
}

new Vue({
  el: "#app-add",
  data: {
    addForm: new AddBookVo()
  },
  methods: {
    addBook() {
      // this.addForm.add()
      utils.throttle(function() {
        console.log('xxxxx');
      }, 2000)();
    }
  }
});
