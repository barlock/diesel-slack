const requireDirectory = require("require-directory");
const _ = require('lodash');

module.exports = requireDirectory(module, {
  visit: template => template.default,
  rename: name => _.camelCase(name)
});
