const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

const addBtn = document.getElementById("addBtn");
const addInput = document.getElementById("addInput");

searchBtn.addEventListener("click", function() {
  const searchValue = searchInput.value;
  fetch(`http://localhost:3000/user/search?userId=${searchValue}`, {
    method: "GET"
  })
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      console.log(data);
      const ul = document.createElement("ul");
      for (const item of data) {
        const li = document.createElement("li");
        li.innerText = item.username;
        ul.appendChild(li);
      }
      console.log(ul);
      searchBtn.parentElement.insertBefore(ul, searchBtn.nextSibling);
    });
});

addBtn.addEventListener("click", function() {
  const userName = addInput.value;
  fetch(`http://localhost:3000/user/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({ userName })
  })
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      console.log(data);
    });
});
