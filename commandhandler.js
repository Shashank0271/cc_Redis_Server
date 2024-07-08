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
    case "exists":
      handleExists(socket, data);
      break;
    case "del":
      handleDel(socket, data);
      break;
    case "incr":
      handleIncr(socket, data);
      break;
    case "decr":
      handleDecr(socket, data);
      break;
    //handle lpush
    default:
      socket.write(serializer("invalid input"));
  }
};

handlePing = (socket) => {
  socket.write(serializer("PONG"));
};

handleEcho = (socket, data) => {
  socket.write(serializer(data[1]));
};

handleSet = (socket, data) => {
  const key = data[1];
  let value = data[2];
  if (storage.get(socket) === undefined) {
    storage.set(socket, new Map());
  }

  storage.get(socket).set(key, value);

  if (data.length > 3) {
    //set <key> <value> <ex/px/exat/pat> <time>
    //0     1      2           3            4
    let expirationMillis;
    if (data[3] === "ex") {
      expirationMillis = data[4] * 1000; //because the time is specified in seconds with ex
    } else if (data[3] === "px") {
      expirationMillis = data[4];
    } else if (data[3] === "exat") {
      //unix time-stamp is mentioned in seconds
      const timeStamp = new Date(data[4] * 1000);
      expirationMillis = timeStamp - new Date();
    } else if (data[3] === "pat") {
      //unix time-stamp is mentioned in milliseconds
      expirationMillis = new Date(data[4]) - new Date();
    }
    setTimeout(() => {
      storage.get(socket).delete(key);
    }, expirationMillis);
  }
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

handleExists = (socket, data) => {
  let counter = 0;
  if (!storage.get(socket)) {
    return socket.write(serializer(`(integer) ${counter}`));
  }
  for (let i = 1; i < data.length; i++) {
    if (storage.get(socket).get(data[i])) {
      counter++;
    }
  }
  socket.write(serializer(`(integer) ${counter}`));
};

handleDel = (socket, data) => {
  let counter = 0;
  if (!storage.get(socket)) {
    return socket.write(serializer(`(integer) ${counter}`));
  }
  for (let i = 1; i < data.length; i++) {
    if (storage.get(socket).get(data[i])) {
      counter++;
      storage.get(socket).delete(data[i]);
    }
  }
  socket.write(serializer(`(integer) ${counter}`));
};

handleIncr = (socket, data) => {
  const key = data[1];
  if (!storage.get(socket)) {
    storage.set(socket, new Map());
  }
  if (!storage.get(socket).get(key)) {
    console.log("initialized value to 0");
    storage.get(socket).set(key, 0);
  }
  const currentValue = storage.get(socket).get(key);
  if (
    !isNaN(parseInt(currentValue)) &&
    isValidInteger(1 + parseInt(currentValue))
  ) {
    storage.get(socket).set(key, Number(currentValue) + 1);
    socket.write(serializer(`(integer) ${storage.get(socket).get(key)}`));
  } else {
    socket.write(serializer(`(error) value is not an integer or out of range`));
  }
};

handleDecr = (socket, data) => {
  const key = data[1];
  if (!storage.get(socket)) {
    storage.set(socket, new Map());
  }
  if (!storage.get(socket).get(key)) {
    storage.get(socket).set(key, 0);
  }
  const currentValue = storage.get(socket).get(key);
  if (
    !isNaN(parseInt(currentValue)) &&
    isValidInteger(parseInt(currentValue) - 1)
  ) {
    storage.get(socket).set(key, Number(currentValue) - 1);
    socket.write(serializer(`(integer) ${storage.get(socket).get(key)}`));
  } else {
    socket.write(serializer(`(error) value is not an integer or out of range`));
  }
};

const isValidInteger = (value) => {
  return (
    Number.isInteger(value) &&
    value <= Number.MAX_SAFE_INTEGER &&
    value >= Number.MIN_SAFE_INTEGER
  );
};

handleLpush = (socket, data) => {
  //unshift
  const key = data[1];
  console.log(data.length);
};
