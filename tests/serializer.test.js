const { describe, test, expect } = require("@jest/globals");
const serialize = require("../serializer");
const clrf = "\r\n";

describe("Serializing integers , simple strings and Erros", () => {
  test("serializes integers correctly", () => {
    const respCommand = 10000;
    expect(serialize(respCommand)).toBe(`:${respCommand}` + clrf);
  });
  test("serializes errors correctly", () => {
    const respCommand = "-Error thisistheerrormessage";
    expect(serialize(respCommand)).toBe(respCommand + clrf);
  });
  test("serializes simple strings correctly", () => {
    const respCommand = "+OK";
    expect(serialize(respCommand)).toBe(respCommand + clrf);
  });
});

describe("Serializes bulk strings", () => {
  test("serializes bulk strings correctly", () => {
    const bulkString = "shashank";
    expect(serialize(bulkString)).toBe(`$8\r\nshashank\r\n`);
  });
  test("serializes null value to null string", () => {
    const input = null;
    expect(serialize(input)).toBe("$-1\r\n");
  });
  test("correctly serializes empty strings", () => {
    const input = "";
    expect(serialize(input)).toBe("$0\r\n\r\n");
  });
});

describe("Serializes arrays" , ()=>{
  test("serializes arrays correctly" , ()=>{
    const input = [1, "+hello", "there"] ;
    expect(serialize(input)).toBe("*3\r\n:1\r\n+hello\r\n$5\r\nthere\r\n")
  })
})
