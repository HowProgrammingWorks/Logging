'use strict';

const vm = require('vm');
const fs = require('fs');
const util = require('util');
const metalog = require('metalog');

const log = metalog({
  path: './log',
  node: 'S1N1',
  writeInterval: 5000,
  writeBuffer: 64 * 1024,
  keepDays: 5,
  toStdout: [],
}).bind('app1');

const logInfo = (...args) => log.info(util.format(...args));
const logError = (...args) => log.error(util.format(...args));

const context = {
  module: {},
  console: {
    log: logInfo,
    dir: logInfo,
    debug: logInfo,
    error: logError,
  },
};

context.global = context;
const sandbox = vm.createContext(context);

const fileName = './application.js';
fs.readFile(fileName, 'utf8', (err, src) => {
  const script = new vm.Script(`module.exports = () => {\n${src}\n};`);
  const execute = script.runInNewContext(sandbox);
  execute();
  log.logger.close();
});
