'use strict';

const pluralize = require('pluralize');

module.exports = async ({ action, context }, next) => {
  const [ plugin, type ] = action.type.split(".");

  if (plugin !== "slack") {
    return;
  }

  const group = pluralize.plural(type);
  const actionData = JSON.parse(JSON.stringify(action));

  context.slack = context.slack || {};

  context.slack[group] = context.slack[group] || [];
  context.slack[group].push(actionData);

  console.log(`Received ${action.type}: ${JSON.stringify(actionData)}`);

  await next();
};
