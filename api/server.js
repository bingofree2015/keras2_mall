#!/usr/bin/env node

/**
 * Created by bingofree.
 * Modernized and merged with bin/run functionality
 */

const schedule = require('node-schedule');
const config = require('config');
const logger = require('tracer').colorConsole();

const app = require('./app');
const { sequelize } = require('./models');

// Global error handlers
process.on('uncaughtException', (err) => {
    logger.error('--uncaughtException--');
    logger.error(err);
    logger.error(err.stack);
    process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
    logger.error('--unhandledRejection--');
    logger.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason.stack);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    process.exit(0);
});

// Database initialization and server startup
async function startServer () {
    try {
    // Initialize database
        await sequelize.sync({ logging: false });
        logger.info('Database synchronized successfully');

        // Clean up expired tasks (if needed)
        const _starting = false;
        if (_starting) {
            schedule.scheduleJob('*/20 * * * * *', async () => {
                // Task cleanup logic here
            });
        }

        // Start server
        const port = process.env.PORT || config.App.port;
        const server = app.listen(port, () => {
            logger.info(`服务启动中 ... 端口: ${port}`);
        });

        // Handle server errors
        server.on('error', (error) => {
            if (error.syscall !== 'listen') {
                throw error;
            }

            const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

            switch (error.code) {
            case 'EACCES':
                logger.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                logger.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
            }
        });

        // Graceful shutdown for server
        process.on('SIGTERM', () => {
            logger.info('SIGTERM received, closing server');
            server.close(() => {
                logger.info('Server closed');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            logger.info('SIGINT received, closing server');
            server.close(() => {
                logger.info('Server closed');
                process.exit(0);
            });
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Start the application
startServer();
