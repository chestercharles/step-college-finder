const { getClient } = require("./app/db.server");
exports.mochaHooks = {
  afterAll(done) {
    getClient().destroy();
    done();
  },
};
