/**
 * Description. test objToArray.
 * partitions:
 * object is empty;
 * object has 1 key-value pair;
 * object has multiple key-value pairs;
 *
 * object values:
 * value is number
 * value is string
 * value is object
 * value is an array
 */

import { expect } from "chai";
import { objToArray } from "../src/test";
import { describe } from "mocha";

interface ObjectValueNumbers {
  [key: string]: number;
}

describe("Tests objToArray function", () => {
  it("should return empty array when provided empty object", () => {
    const ans = objToArray({});
    expect(ans.length).to.equal(0);
  });

  it("should return an array with lenght 1, when provided with an object containing 1 key-value pair", () => {
    const ans = objToArray({ rame: "x" });
    expect(ans.length).to.equal(1);
  });

  it("should return an array with lenght n, when provided with an object containing n key-value pair", () => {
    const obj: ObjectValueNumbers = {};
    const n: number = 10;
    for (let i = 0; i < n; i++) {
      obj[`key + ${i}`] = i;
    }
    const ans = objToArray(obj);
    expect(ans.length).to.equal(10);
  });

  it("when provided with number value, should return the string in array", () => {
    const ans = objToArray({ key: 5 });
    expect(typeof ans[0]).to.equal("string");
  });

  it("when provided with string value, should return the string in array", () => {
    const ans = objToArray({ key: "test string" });
    expect(typeof ans[0]).to.equal("string");
  });

  it("when provided with number value, should return the string in array", () => {
    const ans = objToArray({ key: { key: 5 } });
    expect(typeof ans[0]).to.equal("string");
  });

  it("when provided with number value, should return the string in array", () => {
    const ans = objToArray({ key: [1, 2, 3, 4, 5] });
    expect(typeof ans[0]).to.equal("string");
  });
});
