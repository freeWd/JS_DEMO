let content=  document.getElementById('content');
let xhr = new XMLHttpRequest();
let str = '';
xhr.open('get', 'http://localhost:3000/api/img', true);
xhr.responseType = 'json';

xhr.onload = function() {
    let arr  = xhr.response;
    arr.forEach(arrItem => {
        str += `<li><img src=${arrItem} /></li>`;
    });
    content.innerHTML = str;
}
xhr.send();
