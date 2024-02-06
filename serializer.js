function serialize(command) {
  //the is going to convert RESP-formatted strings into native data structures
  const firstCharacter = command.charAt(0);
  switch (firstCharacter) {
    case "+":
    case "-":
    case ":":
      return appendCLRF(command);

    case "$":
      return serializeBulkString(command);

    case "*":
      return serializeArray(command);

    default:
      throw new Error("unsupported type for serilization");
  }
}

const clrf = "\r\n";
function appendCLRF(command) {
  //for simple strings , integers and errors , we just add a clrf and send it back to the client
  return command + clrf;
}

function serializeBulkString(command) {
  //in this case some computation is required as we need to find the length of the string and format it
  const length = string.length;
  if (length === 1) {
    return appendCLRF("$-1");
  } else {
    return appendCLRF(`$${length}`) + appendCLRF(string.substring(1));
  }
}

function serializeArray() {}

module.exports = serialize;
