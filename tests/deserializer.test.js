const { describe, test, expect } = require("@jest/globals");
const deserialize = require("../deserializer");

describe("deserialize Bulk String function", () => {
  test("Correctly deserializes a valid RESP command(1)", () => {
    const respCommand = "$5\r\nhello\r\n";
    expect(deserialize(respCommand)).toBe("hello");
  });
  test("Correctly deserializes an empty string", () => {
    const respCommand = "$0\r\n\r\n";
    expect(deserialize(respCommand)).toBe("");
  });
  test("correctly deserializes a null string", () => {
    const respCommand = "$-1\r\n";
    expect(deserialize(respCommand)).toBe(null);
  });
  test("Correctly deserializes a valid RESP command(2)", () => {
    const respCommand = "$6\r\nabc123\r\n";
    expect(deserialize(respCommand)).toBe("abc123");
  });
  test("Correctly deserializes a valid RESP command(3)", () => {
    const respCommand = "$10\r\nhello world\r\n";
    expect(deserialize(respCommand)).toBe("hello worl");
  });
  test("throws an error when insufficient characters entered", () => {
    const respCommand = "$36\r\n12\r\n";
    expect(() => deserialize(respCommand)).toThrowError("Invalid input");
  });
});

describe("deserialize array function", () => {
  test("Correctly deserializes array having a single integer", () => {
    const respCommand = "*1\r\n:42\r\n";
    expect(deserialize(respCommand)).toEqual([42]);
  });
  test("Correctly deserializes array having integer and strings", () => {
    const respCommand = "*3\r\n:1\r\n$5\r\nhello\r\n+there\r\n";
    expect(deserialize(respCommand)).toStrictEqual([1, "hello", "there"]);
  });
  test("Correctly deserilizes array having only bulk strings", () => {
    const respCommand =
      "*3\r\n$5\r\nhello\r\n$6\r\nworld!\r\n$8\r\nresponse\r\n";
    expect(deserialize(respCommand)).toStrictEqual([
      "hello",
      "world!",
      "response",
    ]);
  });
  test("correctly deserializes array having only integers", () => {
    const respCommand = "*5\r\n:1\r\n:2\r\n:3\r\n:4\r\n:5\r\n";
    expect(deserialize(respCommand)).toStrictEqual([1, 2, 3, 4, 5]);
  });
  test("correctly deserializes array having simple strings , bulk strings and integers", () => {
    const respCommand =
      "*6\r\n+simple\r\n:123\r\n$5\r\nhello\r\n$11\r\nbulk-string\r\n$6\r\nworld!\r\n";
    expect(deserialize(respCommand)).toStrictEqual([
      "simple",
      123,
      "hello",
      "bulk-string",
      "world!",
    ]);
  });
  test("correctly deserializes empty array", () => {
    const respCommand = "*0\r\n";
    expect(deserialize(respCommand)).toStrictEqual([]);
  });
});

describe("deserialize integers function", () => {
  test("correctly deserializes an integer", () => {
    const respCommand = ":0\r\n";
    expect(deserialize(respCommand)).toBe(0);
  });
  test("correctly deserializes an integer(2)", () => {
    const respCommand = ":2223\r\n";
    expect(deserialize(respCommand)).toBe(2223);
  });
});

describe("deserializes errors", () => {
  const respCommand = "-ERR unknown command 'asdf'\r\n";
  expect(deserialize(respCommand)).toBe("unknown command 'asdf'");
});

describe("deserializes simple strings", () => {
  test("correctly deserializes simple strings", () => {
    const respCommand = "+OK\r\n";
    expect(deserialize(respCommand)).toBe("OK");
  });
  test("correctly deserializes simple strings", () => {
    const respCommand = "+SHASHANK\r\n";
    expect(deserialize(respCommand)).toBe("SHASHANK");
  });
});

