function serialize(input) {
  if (input === null) {
    return "$-1\r\n";
  }
  if (typeof input === "number") {
    return appendCLRF(`:${input}`);
  }
  if (typeof input === "string") {
    const firstCharacter = input.charAt(0);
    if (firstCharacter === "-" || firstCharacter === `+`) {
      return appendCLRF(input);
    }
    return serializeBulkString(input);
  } else if (Array.isArray(input)) {
    return serializeArray(input);
  } else {
    throw new Error("unsupported type for serialization");
  }
}

const clrf = "\r\n";
function appendCLRF(command) {
  //for simple strings , integers and errors , we just add a clrf and send it back to the client
  return command + clrf;
}

function serializeBulkString(string) {
  return appendCLRF(`$${string.length}`) + appendCLRF(string);
}

function serializeArray(array) {
  const sarray =  array.map((element) => serialize(element));
  let message =  appendCLRF(`*${sarray.length}`);
  sarray.forEach(element => {
    message += element;
  });
  return message;
}

module.exports = serialize;
