import assert from "assert";
import "../imports/api/tasks.tests.js"

describe("simple-todos", function () {
  it("package.json has correct name", async function () {
    //{name} is name attribute of the file in package.json file
    const { name } = await import("../package.json");
    //ensure name === simple-todos
    assert.strictEqual(name, "simple-todos");
  });

  if (Meteor.isClient) {
    it("client is not server", function () {
      assert.strictEqual(Meteor.isServer, false);
    });
  }

  if (Meteor.isServer) {
    it("server is not client", function () {
      assert.strictEqual(Meteor.isClient, false);
    });
  }
});
