const http = require("http");

const client = http.request(
  {
    hostname: "localhost",
    port: 3000,
    path: "/test",
    method: "get"
  },
  resp => {
    resp.on("data", function(data) {
       console.log(data.toString());
    });
  }
);

client.end();
