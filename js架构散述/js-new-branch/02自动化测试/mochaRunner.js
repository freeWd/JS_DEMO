const Mocha = require('mocha');
var mocha = new Mocha({
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "./coverage/mochawesome-report",
    // quiet: true
  }
});

mocha.addFile('./tests/service/service.spec.js');
mocha.run(function() {
    process.exit();
});
