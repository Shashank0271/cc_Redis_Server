const net = require("node:net");
const server = net.createServer();
const PORT = 6379;

server.listen(6379, "127.0.0.1", () => {
  console.log(`redis server listening on port : ${PORT}`);
});

server.on("connection", (socket) => {
  console.log("client connected");
  socket.on("data", (chunk) => {});
});

server
  .on("error", (err) => {
    console.log(err.toString());
  })
  .on("end", () => {
    console.log("A client disconnected");
  });

//when we start this server first
//and then run `sudo snap start redis`, the console will display started
//but if we check with sudo snap services the current status of the
//redis-server service is going to be inactive
//but to use redis.cli <Command> we need to make sure the redis.server startup is enabled
