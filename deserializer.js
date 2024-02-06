function deserialize(command) {
  //the is going to convert RESP-formatted strings into native data structures
  const firstCharacter = command.charAt(0);
  switch (firstCharacter) {
    case "+":
      return deserializeSimpleString(command);

    case "-":
      return deserializeError(command);

    case ":":
      return deserializeInteger(command);

    case "$":
      return deserializeBulkString(command);

    case "*":
      return deserializeArray(command);

    default:
      throw new Error();
  }
}

const clrf = "\r\n";
let parsed = 0; //holds the number of characters last parsed

function deserializeSimpleString(command, pos = 0) {
  const data = command.substring(1, command.indexOf(clrf, pos));
  parsed = data.length + 3;
  return data;
}

function deserializeError(command, pos = 0) {
  const data = command.substring(
    command.indexOf(" ")+1,
    command.indexOf(clrf, pos)
  );
  parsed = data.length + 3;
  return data;
}

function deserializeInteger(command, pos = 0) {
  const data = command.substring(1, command.indexOf(clrf, pos));
  parsed = data.length + 3;
  return Number(data);
}

function deserializeBulkString(command, pos = 0) {
  const bytes = Number(command.substring(1, command.indexOf(clrf, pos)));
  let data = "";
  let c = 0,
    index = command.indexOf(clrf) + 2;
  while (c < bytes && index < command.length - 2) {
    try {
      data += command.charAt(index);
    } catch (e) {
      return e;
    }
    index++;
    c++;
  }
  if (c !== bytes) {
    throw new Error("Invalid input");
  }
  parsed = data.length + 5 + bytes.toString().length;
  return data;
}

function deserializeArray(command) {
  if (Number(command.charAt(1) <= 0)) {
    return [];
  }
  let pos = 4;
  const len = command.length - 2;
  let elements = [];
  while (pos < len) {
    try {
      let data = command.substring(pos);
      const result = deserialize(data);
      pos += parsed;
      elements = elements.concat(result);
    } catch (e) {
      return e;
    }
  }
  return elements;
}

module.exports =  deserialize ;
