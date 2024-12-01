#!/usr/bin/env node
'use strict';

/**
 * @fileoverview CLI tool for managing Bitcoin Mini private keys.
 * 
 * This tool provides the following functionalities:
 * - **Validation**: Check if a given MiniKey is valid.
 * - **Generation**: Generate new 30-character MiniKeys.
 * - **Conversion**:
 *   - MiniKey → HEX private key.
 *   - HEX private key → Wallet Import Format (WIF).
 * - **Verification**: Confirm that a WIF key matches its original MiniKey.
 * - **Full Workflow**: Validate MiniKeys, convert to HEX, and generate WIF keys.
 * 
 * @module app
 * @requires commander
 * @requires @core/logger
 * @requires @classes/MiniKeyConverter
 * @requires @core/output
 * @requires config/config.json
 */

// Try to register module aliases dynamically
try {
  require('../core/setupAliases');
} catch (error) {
  console.warn('Module aliases are not registered. Ensure the runtime supports _moduleAliases.');
}

const { program } = require('commander'); // CLI framework for argument parsing
const logger = require('@core/logger'); // Custom logger for logging output
const MiniKeyConverter = require('@classes/MiniKeyConverter'); // Main converter class
const { printResult } = require('@core/output'); // Helper for user-facing results

// Read configuration
const config = require('../config/config.json');

/**
 * Set default log level from configuration file or fallback to 'info'.
 * @constant {string} LOG_LEVEL - The default logging level.
 */
process.env.LOG_LEVEL = config.logLevel || 'info';

/**
 * Instance of the MiniKeyConverter class.
 * @type {MiniKeyConverter}
 */
const Converter = new MiniKeyConverter();

/**
 * Adjust logging levels dynamically based on CLI options.
 * @name LoggingLevelOptions
 * @function
 */
program
  .option('-v, --verbose', 'Enable verbose debug logging')
  .option('-q, --quiet', 'Suppress all non-critical logs')
  .hook('preAction', (thisCommand) => {
    const opts = thisCommand.opts();

    // Set global LOG_LEVEL based on options
    if (opts.verbose) {
      process.env.LOG_LEVEL = 'debug';
    } else if (opts.quiet) {
      process.env.LOG_LEVEL = 'error';
    }

    // Update Winston logger level dynamically
    logger.transports[0].level = process.env.LOG_LEVEL;
  });

/**
 * Define the CLI program.
 */
program
  .name('minikey-converter')
  .description('A tool to manage and convert Bitcoin Mini private keys')
  .version('1.0.0');

/**
 * Command: Generate a new MiniKey and convert it to HEX and WIF formats.
 * @name generate
 * @function
 */
program
  .command('generate')
  .description('Generate a new 30-character MiniKey and convert it to HEX and WIF formats')
  .action(() => {
    try {
      const minikey = Converter.generateMiniKey();
      printResult(`🆕 Generated MiniKey: ${minikey}`);

      const hexKey = Converter.miniToHex(minikey);
      printResult(`🔑 HEX Private Key: ${hexKey}`);

      const mainnetWifUncompressed = Converter.hexToWif(hexKey, false, false);
      const mainnetWifCompressed = Converter.hexToWif(hexKey, false, true);
      const testnetWifUncompressed = Converter.hexToWif(hexKey, true, false);
      const testnetWifCompressed = Converter.hexToWif(hexKey, true, true);

      printResult('✅ WIF Keys Generated:');
      printResult(`  Mainnet (Uncompressed): ${mainnetWifUncompressed}`);
      printResult(`  Mainnet (Compressed):   ${mainnetWifCompressed}`);
      printResult(`  Testnet (Uncompressed): ${testnetWifUncompressed}`);
      printResult(`  Testnet (Compressed):   ${testnetWifCompressed}`);
    } catch (error) {
      logger.error(`❌ Error generating MiniKey: ${error.message}`);
    }
  });

/**
 * Command: Process a MiniKey through the full workflow.
 * @name process
 * @function
 * @param {string} minikey - The Mini private key to process.
 */
program
  .command('process <minikey>')
  .description('Validate a MiniKey and convert it to both HEX and WIF keys')
  .action((minikey) => {
    printResult('Starting the full MiniKey workflow...');

    // Step 1: Validate the MiniKey
    if (!Converter.check(minikey)) {
      logger.error('❌ Invalid MiniKey format. Exiting workflow.');
      return;
    }
    printResult(`✅ Valid MiniKey: ${minikey}`);

    // Step 2: Convert MiniKey to HEX
    const hexKey = Converter.miniToHex(minikey);
    printResult(`🔑 HEX Private Key: ${hexKey}`);

    // Step 3: Convert HEX to WIF (mainnet and testnet, compressed and uncompressed)
    const mainnetWifUncompressed = Converter.hexToWif(hexKey, false, false);
    const mainnetWifCompressed = Converter.hexToWif(hexKey, false, true);
    const testnetWifUncompressed = Converter.hexToWif(hexKey, true, false);
    const testnetWifCompressed = Converter.hexToWif(hexKey, true, true);

    printResult('✅ WIF Keys Generated:');
    printResult(`  Mainnet (Uncompressed): ${mainnetWifUncompressed}`);
    printResult(`  Mainnet (Compressed):   ${mainnetWifCompressed}`);
    printResult(`  Testnet (Uncompressed): ${testnetWifUncompressed}`);
    printResult(`  Testnet (Compressed):   ${testnetWifCompressed}`);
  });

/**
 * Command: Validate a MiniKey.
 * @name validate
 * @function
 * @param {string} minikey - The Mini private key to validate.
 */
program
  .command('validate <minikey>')
  .description('Validate a Bitcoin Mini private key')
  .action((minikey) => {
    if (Converter.check(minikey)) {
      printResult(`✅ Valid MiniKey: ${minikey}`);
    } else {
      logger.warn(`❌ Invalid MiniKey: ${minikey}`);
    }
  });

/**
 * Command: Convert a MiniKey to HEX.
 * @name to-hex
 * @function
 * @param {string} minikey - The Mini private key to convert.
 */
program
  .command('to-hex <minikey>')
  .description('Convert a MiniKey to a HEX private key')
  .action((minikey) => {
    if (Converter.check(minikey)) {
      const hexKey = Converter.miniToHex(minikey);
      printResult(`HEX Private Key: ${hexKey}`);
    } else {
      logger.error('Invalid MiniKey. Cannot convert.');
    }
  });

/**
 * Command: Convert HEX to WIF.
 * @name to-wif
 * @function
 * @param {string} hexkey - The HEX private key to convert.
 * @param {boolean} [testnet=false] - Generate a testnet WIF key.
 * @param {boolean} [compressed=false] - Generate a compressed WIF key.
 */
program
  .command('to-wif <hexkey>')
  .option('-t, --testnet', 'Generate a WIF key for testnet')
  .option('-c, --compressed', 'Generate a compressed WIF key')
  .description('Convert a HEX private key to WIF format')
  .action((hexkey, options) => {
    try {
      const wifKey = Converter.hexToWif(
        hexkey,
        options.testnet || false,
        options.compressed || false
      );
      printResult(`WIF Key: ${wifKey}`);
    } catch (error) {
      logger.error(`Error: ${error.message}`);
    }
  });

/**
 * Command: Verify if a WIF matches a MiniKey.
 * @name verify
 * @function
 * @param {string} minikey - The Mini private key.
 * @param {string} wifkey - The Wallet Import Format key.
 */
program
  .command('verify <minikey> <wifkey>')
  .description('Verify if the given WIF key matches the MiniKey')
  .action((miniKey, wifKey) => {
    try {
      const isValid = Converter.verifyWifAgainstMiniKey(miniKey, wifKey);
      if (isValid) {
        printResult('✅ The WIF key matches the MiniKey');
      } else {
        logger.error('❌ The WIF key does not match the MiniKey');
      }
    } catch (error) {
      logger.error(`❌ Error verifying WIF and MiniKey: ${error.message}`);
    }
  });

// Parse CLI arguments
program.parse(process.argv);
