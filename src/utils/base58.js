
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/**
 * Encodes a buffer into Base58 format.
 *
 * @param {Buffer} buffer - The buffer to encode.
 * @returns {string} - The Base58 encoded string.
 */
function encodeBase58(buffer) {
    const BASE = ALPHABET.length;
    let number = BigInt('0x' + buffer.toString('hex'));
    let encoded = [];

    while (number > 0) {
        const remainder = number % BigInt(BASE);
        encoded.unshift(ALPHABET[Number(remainder)]);
        number = number / BigInt(BASE);
    }

    for (let i = 0; i < buffer.length && buffer[i] === 0; i++) {
        encoded.unshift('1');
    }

    return encoded.join('');
}

module.exports = { encodeBase58 };
