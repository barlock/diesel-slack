'use strict';

const _ = require('lodash');

module.exports = (data) => {
  return _.reduce(data, (data, value, key) => {
    data[_.camelCase(key)] = value;

    return data;
  }, {});
};
