'use strict';

const metalog = require('metalog');

const log = metalog({
  path: './log',
  node: 'S1N1',
  writeInterval: 3000,
  writeBuffer: 64 * 1024,
  keepDays: 5,
  toStdout: [],
}).bind('app1');

log.logger.on('error', err => {
  console.log('Error');
  console.error(err);
  process.exit(1);
});

log.logger.on('open', () => {
  console.log('Opened');
  log.system('System test log message');
  log.fatal('Fatal test log message');
  log.error('Error test log message');
  log.warn('Warning test log message');
  log.info('Info test log message');
  log.debug('Debug test log message');
  log.slow('Slow test log message');
  log.db('Database test log message');

  const begin = process.hrtime.bigint();
  for (let i = 0; i < 1000000; i++) {
    log.info('Write more then 60Mb logs, line: ' + i);
  }
  log.logger.close();
  log.logger.on('close', () => {
    const end = process.hrtime.bigint();
    const time = (end - begin) / 1000000n;
    console.log(`Time: ${time} milliseconds`);
  });
});
