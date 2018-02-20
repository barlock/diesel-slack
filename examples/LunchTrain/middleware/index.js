const requireDirectory = require("require-directory");
const _ = require('lodash');

module.exports = requireDirectory(module, {
  rename: name => _.camelCase(name)
});
