const { describe, test, expect } = require("@jest/globals");
const serialize = require("../serializer");
const clrf = "\r\n";

describe("Serializing integers , simple strings and Erros", () => {
  test("serializes integers correctly", () => {
    const respCommand = ":10000";
    expect(serialize(respCommand)).toBe(respCommand + clrf);
  });
  test("serializes errors correctly", () => {
    const respCommand = "-Error thisistheerrormessage";
    expect(serialize(respCommand)).toBe(respCommand + clrf);
  });
  test("serializes simple strings correctly", () => {
    const respCommand = ":OK";
    expect(serialize(respCommand)).toBe(respCommand + clrf);
  });
});
