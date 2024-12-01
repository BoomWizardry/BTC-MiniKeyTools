
const crypto = require('crypto');

/**
 * Computes the SHA256 hash of a given input.
 *
 * @param {string|Buffer} input - The input to hash.
 * @returns {Buffer} - The SHA256 hash as a buffer.
 */
function sha256(input) {
    return crypto.createHash('sha256').update(input).digest();
}

module.exports = { sha256 };
