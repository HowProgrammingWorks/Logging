'use strict';

const fs = require('fs');

// file => serializer => app => module => kind => msg

const logger = file => {
  const { isTTY } = file;
  const stream = isTTY ? file : fs.createWriteStream(file);
  return (serializer = logger.defaultSerializer) => app => module => kind => {
    const color = isTTY ? (logger.colors[kind] || logger.colors.info) : '';
    return msg => {
      const date = new Date().toISOString();
      const record = { date, kind, app, module, msg };
      const line = serializer(record);
      stream.write(color + line + '\n');
    };
  };
};

logger.defaultSerializer = obj => {
  const res = [];
  for (const key in obj) {
    res.push(obj[key]);
  }
  return res.join('\t');
};

logger.colors = {
  warning: '\x1b[1;33m',
  error: '\x1b[0;31m',
  info: '\x1b[1;37m',
};

module.exports = logger;
