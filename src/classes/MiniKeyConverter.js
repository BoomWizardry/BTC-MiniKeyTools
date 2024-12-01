'use strict';

const logger = require('@core/logger');
const crypto = require('crypto');
const { sha256 } = require('@utils/hashUtils');
const { encodeBase58 } = require('@utils/base58');
const config = require('@config/config.json');

/**
 * Class for managing and converting Bitcoin MiniKeys.
 *
 * This class provides utilities for:
 * - Generating valid 30-character Bitcoin MiniKeys.
 * - Validating MiniKeys to ensure they conform to the correct format.
 * - Converting MiniKeys to private keys in HEX format.
 * - Converting private keys in HEX format to Wallet Import Format (WIF).
 *
 * **Important:** MiniKeys cannot directly generate WIF keys. They must first be converted
 * to HEX format using the `miniToHex` method, and only then can they be converted to WIF using `hexToWif`.
 *
 * @example
 * const converter = new MiniKeyConverter();
 *
 * // Generate a new MiniKey
 * const newMiniKey = converter.generateMiniKey();
 * console.log(`Generated MiniKey: ${newMiniKey}`);
 *
 * // Validate a MiniKey
 * const isValid = converter.check('S6c56bnXQiBjk9mqSYE7ykVQ7NzrRy');
 * if (isValid) {
 *   console.log('Valid MiniKey!');
 * }
 *
 * // Convert MiniKey to HEX
 * const hexKey = converter.miniToHex('S6c56bnXQiBjk9mqSYE7ykVQ7NzrRy');
 * console.log(`HEX Key: ${hexKey}`);
 *
 * // Convert HEX to WIF
 * const wifKey = converter.hexToWif(hexKey, false, false);
 * console.log(`WIF Key: ${wifKey}`);
 */
class MiniKeyConverter {
  /**
   * Generates a valid 30-character MiniKey.
   *
   * The MiniKey will always start with 'S' and will contain 29 additional Base58 characters.
   * It ensures the generated MiniKey passes validation checks before returning it.
   *
   * @returns {string} A valid 30-character MiniKey.
   * @example
   * const newMiniKey = converter.generateMiniKey();
   * console.log(`Generated MiniKey: ${newMiniKey}`);
   */
  generateMiniKey() {
    let minikey;
    do {
      minikey = 'S' + crypto.randomBytes(32).toString('base64')
        .replace(/[^1-9A-HJ-NP-Za-km-z]/g, '')
        .slice(0, 29);
    } while (!this.check(minikey));
    return minikey;
  }

  /**
   * Validates a MiniKey to ensure it conforms to the correct format.
   *
   * A valid MiniKey:
   * - Starts with 'S'.
   * - Contains only Base58 characters.
   * - Is either 22 or 30 characters long (or only 30 if strictMode is enabled).
   * - Has a SHA-256 hash (appended with '?') that starts with 0x00.
   *
   * @param {string} miniKey - The MiniKey to validate.
   * @param {boolean} [strictMode=false] - Enforce strict validation, allowing only 30-character MiniKeys.
   * @returns {boolean} True if the MiniKey is valid, false otherwise.
   * @example
   * const isValid = converter.check('S6c56bnXQiBjk9mqSYE7ykVQ7NzrRy');
   * console.log(`Is valid: ${isValid}`);
   */
  check(miniKey, strictMode = false) {
    logger.debug({
      method: 'check',
      input: miniKey,
      strictMode,
      message: `Validating MiniKey`
    });

    if (!miniKey || typeof miniKey !== 'string') {
      logger.warn({
        method: 'check',
        message: 'Invalid MiniKey: Must be a non-empty string.'
      });
      return false;
    }

    const validLengths = strictMode ? [30] : [22, 30];
    if (!validLengths.includes(miniKey.length)) {
      logger.warn({
        method: 'check',
        message: `Invalid MiniKey length: ${miniKey.length}. Allowed lengths: ${validLengths.join(', ')}.`
      });
      return false;
    }

    if (!/^[S][1-9A-HJ-NP-Za-km-z]+$/.test(miniKey)) {
      logger.warn({
        method: 'check',
        message: 'Invalid MiniKey format: Must start with "S" and contain only Base58 characters.'
      });
      return false;
    }

    const isValid = /^00[0-9A-F]{62}$/.test(sha256(`${miniKey}?`).toString('hex').toUpperCase());
    logger.debug({
      method: 'check',
      input: miniKey,
      result: isValid,
      message: `MiniKey validation result`
    });

    return isValid;
  }

  /**
   * Converts a MiniKey into its corresponding private key in HEX format.
   *
   * @param {string} key - The MiniKey to convert.
   * @returns {string} The private key in HEX format.
   * @example
   * const hexKey = converter.miniToHex('S6c56bnXQiBjk9mqSYE7ykVQ7NzrRy');
   * console.log(`HEX Key: ${hexKey}`);
   */
  miniToHex(key) {
    logger.debug({
      method: 'miniToHex',
      input: key,
      message: `Converting MiniKey to HEX`
    });
    const hexKey = sha256(key).toString('hex').toUpperCase();
    logger.debug({
      method: 'miniToHex',
      result: hexKey,
      message: `Converted HEX private key`
    });
    return hexKey;
  }

  /**
   * Converts a private key in HEX format to Wallet Import Format (WIF).
   *
   * **Note:** The input key must be in HEX format, typically obtained by converting a MiniKey
   * using the `miniToHex` method.
   *
   * @param {string} key - The private key in HEX format (64 characters).
   * @param {boolean} [testnet=false] - Whether the key is for the Bitcoin testnet.
   * @param {boolean} [compressed=false] - Whether the key is compressed.
   * @returns {string} The private key in Wallet Import Format (WIF).
   * @example
   * const wifKey = converter.hexToWif(hexKey, false, false);
   * console.log(`WIF Key: ${wifKey}`);
   */
  hexToWif(key, testnet = false, compressed = false) {
    logger.debug({
      method: 'hexToWif',
      input: key,
      testnet,
      compressed,
      message: `Converting HEX to WIF`
    });

    if (!/^[0-9A-Fa-f]{64}$/.test(key)) {
      logger.error({
        method: 'hexToWif',
        message: `Invalid HEX private key format: ${key}`
      });
      throw new Error('Invalid hexadecimal key format');
    }

    try {
      const prefix = testnet ? config.networks.testnet : config.networks.mainnet;
      let extendedKey = Buffer.from(`${prefix}${key}`, 'hex');
      if (compressed) {
        extendedKey = Buffer.concat([extendedKey, Buffer.from('01', 'hex')]);
      }

      const hash1 = sha256(extendedKey);
      const hash2 = sha256(hash1);
      const checksum = hash2.slice(0, 4);
      const fullKey = Buffer.concat([extendedKey, checksum]);
      const wif = encodeBase58(fullKey);

      logger.debug({
        method: 'hexToWif',
        result: wif,
        message: `Successfully converted to WIF`
      });
      return wif;
    } catch (error) {
      logger.error({
        method: 'hexToWif',
        message: `Error converting to WIF: ${error.message}`
      });
      throw error;
    }
  }

  /**
   * Verifies whether a WIF key matches a MiniKey.
   *
   * @param {string} miniKey - The Mini private key.
   * @param {string} wifKey - The WIF key to verify.
   * @param {boolean} [testnet=false] - Whether the WIF key is for testnet.
   * @param {boolean} [compressed=false] - Whether the WIF key is compressed.
   * @returns {boolean} - True if the WIF key matches the MiniKey, otherwise false.
   */
  verifyWifAgainstMiniKey(miniKey, wifKey, testnet = false, compressed = false) {
    try {
      // Convert MiniKey to HEX
      const hexKey = this.miniToHex(miniKey);

      // Generate the expected WIF key
      const expectedWifKey = this.hexToWif(hexKey, testnet, compressed);

      // Compare the expected WIF key with the provided one
      return expectedWifKey === wifKey;
    } catch (error) {
      logger.error(`Verification failed: ${error.message}`);
      return false;
    }
  }
}

module.exports = MiniKeyConverter;
