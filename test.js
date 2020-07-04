const { spawn } = require('child_process')

const childProcess = spawn(process.execPath, ['./test2.js'])

childProcess.stdin.write('start')

let count = 0
childProcess.stdout.on('data', function(data) {
    console.log('parent ==>', data)
    count++
})

console.log('xxx')