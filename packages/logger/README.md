# @nethercore/logger

Enhanced console logger with gradient styling and Nether Host branding.

## Features

- 🎨 Beautiful gradient styling with chalk and gradient-string
- ⚡ Nether Host branded logging
- 📦 Boxed messages for important announcements
- 🔄 Spinner support for loading states
- 📊 Table formatting for structured data
- 🎯 Log level filtering
- ⏱️ Timestamp support
- 🎪 Console replacement functionality

## Installation

```bash
pnpm add @nethercore/logger
```

## Usage

### Basic Usage

```typescript
import { logger } from '@nethercore/logger';

logger.info('Server starting...');
logger.success('Server started successfully!');
logger.warn('This is a warning');
logger.error('Something went wrong');
logger.debug('Debug information');
```

### Custom Logger Instance

```typescript
import { createLogger, LogLevel } from '@nethercore/logger';

const customLogger = createLogger({
  level: LogLevel.DEBUG,
  showTimestamp: true,
  showLevel: true,
  brand: true,
  prefix: 'API'
});

customLogger.info('Custom logger message');
```

### Replace Console

```typescript
import { replaceConsole } from '@nethercore/logger';

replaceConsole({
  brand: true,
  showTimestamp: true
});

// Now console.log uses Nether styling
console.log('This will be styled!');
```

### Advanced Features

#### Boxed Messages
```typescript
logger.box('Important announcement!', 'ALERT');
```

#### Banner
```typescript
logger.banner('Welcome to Nether Host');
```

#### Spinner
```typescript
const spinner = logger.spinner('Loading data...');
spinner.start();
// ... do work
spinner.succeed('Data loaded!');
```

#### Table
```typescript
logger.table([
  { name: 'John', age: 30, role: 'Admin' },
  { name: 'Jane', age: 25, role: 'User' }
]);
```

#### Grouped Logging
```typescript
logger.group('Database Operations', () => {
  logger.info('Connecting to database...');
  logger.success('Connected!');
  logger.info('Running migrations...');
});
```

## API Reference

### LogLevel
- `DEBUG = 0`
- `INFO = 1` 
- `WARN = 2`
- `ERROR = 3`
- `FATAL = 4`

### LoggerOptions
- `level?: LogLevel` - Minimum log level to display
- `showTimestamp?: boolean` - Show timestamp in logs
- `showLevel?: boolean` - Show log level in logs  
- `brand?: boolean` - Show Nether Host branding
- `prefix?: string` - Custom prefix for logs

### Methods
- `debug(message, ...args)` - Debug level logging
- `info(message, ...args)` - Info level logging
- `log(message, ...args)` - Alias for info
- `warn(message, ...args)` - Warning level logging
- `error(message, ...args)` - Error level logging
- `fatal(message, ...args)` - Fatal level logging
- `success(message, ...args)` - Success styling
- `box(message, title?)` - Boxed message
- `banner(message)` - Nether Host banner
- `spinner(text)` - Create spinner instance
- `table(data)` - Format table data
- `group(label, fn)` - Group related logs
- `clear()` - Clear console with banner

## License

MIT