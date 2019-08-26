let fs = require('fs');
let path = require('path');

let dataPath = path.resolve(__dirname, 'data.json');
let json = [];

for (let index = 0; index < 80; index++) {
    json.push(`https://www.fullstackjavascript.cn/conan/${index}.jpeg`);
}

fs.writeFileSync(dataPath, JSON.stringify(json));

