import { logger, createLogger, replaceConsole, LogLevel } from './index';

console.log('=== Nether Logger Examples ===\n');

logger.info('Server starting...');
logger.success('Operation completed successfully!');
logger.warn('This is a warning message');
logger.error('This is an error message');
logger.debug('Debug information (may not show depending on log level)');

const customLogger = createLogger({
  prefix: 'API-SERVER',
  level: LogLevel.DEBUG,
  brand: true
});

customLogger.debug('API server debug message');
customLogger.info('API request processed');
customLogger.warn('API rate limit approaching');

logger.info('\n=== Console Replacement Demo ===');
replaceConsole({ brand: true, prefix: 'CONSOLE' });

console.log('This console.log now uses gray styling!');
console.info('Info messages are cyan');
console.warn('Warnings are yellow');
console.error('Errors are red');
console.debug('Debug messages are purple');