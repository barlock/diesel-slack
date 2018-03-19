"use strict";

const Store = require('jfs');
const promisify = require("util-promisify");
const db = new Store(".db");

db.save = promisify(db.save);
db.get = promisify(db.get);
db.delete = promisify(db.delete);

module.exports = () => {
  return ({
    async get (id) {
      return await db.get(id);
    },
    async put (id, data) {
      await db.save(id, data);
    },
    async delete (id) {
      await db.delete(id);
    }
  })
};
