const crypto = require("crypto");

let password = "1OKzP/qNsaMw1VJEoQfpW6lEd/AbREqyKzpBVxFC5iE=";
let plainText = "content-length";
let encryptText = "7DMzRiZ2CBj/LbuxHNk=";
let secretKey = null;
let iv1 = null;
let tag = null;

function encrypt() {
  const cipher = crypto.createCipheriv("aes-128-gcm", secretKey, iv1);
  cipher.setAutoPadding(false);
  let encryptText = cipher.update(plainText, "utf8", "base64");
  encryptText += cipher.final("base64");
  tag = cipher.getAuthTag()
  // return encryptText;
  return Buffer.concat([Buffer.from(encryptText, "base64"), tag]).toString("base64")
}

function decrypt() {
  encryptText = 'ZLr8bxZOs8ApCEO5YS0OxGzUv+DL4vY8ZQz2O9h+';
  console.log(encryptText)
  const decipher = crypto.createDecipheriv('aes-128-gcm', secretKey, iv1)
  decipher.setAutoPadding(false)
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(encryptText, 'base64', 'utf8')
  decrypted += decipher.final('utf8');
  return decrypted;
}

let random = crypto.createHash("sha1").update(password).digest();
random = crypto.createHash("sha1").update(random).digest();

secretKey = random.slice(0, 16);
console.log(secretKey)
// iv1 = Buffer.alloc(12, 0);
iv1 = Buffer.from([152,187,218,202,131,220,255,166,190,213,162,168])



console.log(encrypt()); // 7DMzRiZ2CBj/LbuxHNk=
encryptText = encrypt();

console.log(decrypt());
