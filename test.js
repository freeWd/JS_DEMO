// const a = "mLvaNoPcAVpC1aKoZLr8bxZOs8ApCEO5YS2EPPLqgUEDfihNIo3EbXtd"
// content-length  <--> mLvaNoPcAVpC1aKoZLr8bxZOs8ApCEO5YS2EPPLqgUEDfihNIo3EbXtd

// 测试加密
const crypto = require('crypto')

const ALGORITHM = 'aes-128-gcm'
const PASSWORD = "1OKzP/qNsaMw1VJEoQfpW6lEd/AbREqyKzpBVxFC5iE=";
const IV = Buffer.from([152, 187, 218, 54, 131, 220, 1, 90, 66, 213, 162, 168]);

const SECURITY_KEY =  createHashRandom(PASSWORD, 16)
const AAD = Buffer.from(PASSWORD)


function createHashRandom(seed, byteLength) {
  let randomNums = crypto.createHash('sha1').update(seed).digest();
  randomNums = crypto.createHash('sha1').update(randomNums).digest();
  console.log(randomNums)
  return randomNums.slice(0, byteLength)
}

function encrypt(plaintext) {
  const cipher = crypto.createCipheriv(ALGORITHM, SECURITY_KEY, IV)
  cipher.setAutoPadding(false)
  cipher.setAAD(AAD)

  let ciphertext = cipher.update(plaintext, 'utf8', 'base64')
  ciphertext += cipher.final('base64')
  const tag = cipher.getAuthTag();
  return Buffer.concat([IV, Buffer.from(ciphertext, "base64"), tag]).toString("base64")
}

function decrypt(ciphertext) {
  const ciphertextBuffer = Buffer.from(ciphertext, 'base64')
  const bufferLength = ciphertextBuffer.length;
  const realCiphertext = ciphertextBuffer.slice(IV.length, bufferLength - 16).toString('base64');
  const tag = ciphertextBuffer.slice(bufferLength - 16)

  console.log(tag, realCiphertext)

  const decipher = crypto.createDecipheriv(ALGORITHM, SECURITY_KEY, IV)
  decipher.setAutoPadding(false)
  decipher.setAAD(AAD)
  decipher.setAuthTag(tag)

  let decrypted = decipher.update(realCiphertext, 'base64', 'utf8')
  decrypted += decipher.final('utf8');
  return decrypted;
}




console.log([[], 1])