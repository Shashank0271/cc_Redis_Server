const serializer = require("./serializer");
const deserializer = require("./deserializer");

const storage = new Map();

module.exports = (socket, command) => {
  const data = deserializer(command.toString("utf-8").toLowerCase());
  switch (data[0]) {
    case "ping":
      handlePing(socket);
      break;
    case "echo":
      handleEcho(socket, data);
      break;
    case "set":
      handleSet(socket, data);
      break;
    case "get":
      handleGet(socket, data);
      break;
    default:
      socket.write(serializer("invalid input"));
      break;
  }
};

handlePing = (socket) => {
  socket.write(serializer("PONG"));
};

handleEcho = (socket, data) => {
  socket.write(serializer(data[1]));
};

handleSet = (socket, data) => {
  if (storage.get(socket) === undefined) {
    storage.set(socket, new Map());
  }
  storage.get(socket).set(data[1], data[2]);
  socket.write(serializer("OK"));
};

handleGet = (socket, data) => {
  const key = data[1];
  if (!storage.get(socket) || !storage.get(socket).get(key)) {
    socket.write(serializer("(nil)"));
  } else {
    socket.write(serializer(storage.get(socket).get(key)));
  }
};
