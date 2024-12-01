require('module-alias/register');

const MiniKeyConverter = require('@classes/MiniKeyConverter');
const Converter = new MiniKeyConverter();

describe('MiniKeyConverter', () => {
  // Utility Functions
  const generateValidMiniKey = () => 'SQfHfa4dZ5xae6TN5CVRUTypLbp2B5'; // Valid 30-character Base58 MiniKey
  const generateValidHexKey = () => '88C50C0E095D68EBB6FE4CEFF0E29014D52A299D05C0365C184AABBC4BF60737';

  // Test Case: Convert MiniKey to hexadecimal
  it('should convert MiniKey to hexadecimal', () => {
    const miniKey = generateValidMiniKey();
    const hexKey = Converter.miniToHex(miniKey);
    expect(hexKey).toBe('88C50C0E095D68EBB6FE4CEFF0E29014D52A299D05C0365C184AABBC4BF60737');
  });

  // Test Case: Validate correct MiniKey format
  it('should validate a correct MiniKey format', () => {
    const validMiniKey = generateValidMiniKey();
    expect(Converter.check(validMiniKey)).toBe(true, 'The MiniKey should pass validation.');
  });

  // Test Case: Reject invalid MiniKey format
  it('should reject invalid MiniKey format', () => {
    const invalidMiniKey = 'InvalidMiniKey';
    expect(Converter.check(invalidMiniKey)).toBe(false, 'Invalid MiniKey should fail validation.');
  });

  // Test Case: Validate MiniKey with strict length (30 characters)
  it('should validate MiniKey with 30 characters in strict mode', () => {
    const validMiniKey = generateValidMiniKey(); // Exactly 30 characters
    expect(Converter.check(validMiniKey, true)).toBe(true, 'MiniKey with 30 characters should pass validation in strict mode.');
  });

  // Test Case: Reject MiniKey with invalid length in strict mode
  it('should reject MiniKey with length not equal to 30 in strict mode', () => {
    const shortMiniKey = 'S123456789A123456789B123456'; // 27 characters
    const longMiniKey = 'S123456789A123456789B123456789012345'; // 35 characters
    expect(Converter.check(shortMiniKey, true)).toBe(false, 'Short MiniKey should fail in strict mode.');
    expect(Converter.check(longMiniKey, true)).toBe(false, 'Long MiniKey should fail in strict mode.');
  });

  // Test Case: Reject MiniKey containing invalid Base58 characters
  it('should reject MiniKey containing invalid Base58 characters', () => {
    const invalidMiniKey1 = 'S123456789A123456789B1234567890'; // Contains '0'
    const invalidMiniKey2 = 'S123456789A123456789B12345678O'; // Contains 'O'
    const invalidMiniKey3 = 'S123456789A123456789B12345678l'; // Contains 'l'
    const invalidMiniKey4 = 'S123456789A123456789B12345678I'; // Contains 'I'

    expect(Converter.check(invalidMiniKey1)).toBe(false, 'MiniKey with "0" should fail validation.');
    expect(Converter.check(invalidMiniKey2)).toBe(false, 'MiniKey with "O" should fail validation.');
    expect(Converter.check(invalidMiniKey3)).toBe(false, 'MiniKey with "l" should fail validation.');
    expect(Converter.check(invalidMiniKey4)).toBe(false, 'MiniKey with "I" should fail validation.');
  });

  // Test Case: Generate a valid MiniKey
  it('should generate a valid MiniKey', () => {
    const miniKey = Converter.generateMiniKey();
    expect(Converter.check(miniKey)).toBe(true, 'Generated MiniKey should pass validation.');
    expect(miniKey.startsWith('S')).toBe(true, 'Generated MiniKey should start with "S".');
    expect(miniKey.length).toBe(30, 'Generated MiniKey should be 30 characters long.');
  });

  // Test Case: Verify WIF against MiniKey (Uncompressed, Mainnet)
  it('should verify a WIF key matches its MiniKey (compressed=false, testnet=false)', () => {
    const miniKey = generateValidMiniKey();
    const hexKey = Converter.miniToHex(miniKey);
    const wifKey = Converter.hexToWif(hexKey, false, false);

    const isValid = Converter.verifyWifAgainstMiniKey(miniKey, wifKey, false, false);
    expect(isValid).toBe(true, 'The uncompressed mainnet WIF key should match its MiniKey.');
  });

  // Test Case: Verify WIF against MiniKey (Compressed, Mainnet)
  it('should verify a WIF key matches its MiniKey (compressed=true, testnet=false)', () => {
    const miniKey = generateValidMiniKey();
    const hexKey = Converter.miniToHex(miniKey);
    const wifKey = Converter.hexToWif(hexKey, false, true);

    const isValid = Converter.verifyWifAgainstMiniKey(miniKey, wifKey, false, true);
    expect(isValid).toBe(true, 'The compressed mainnet WIF key should match its MiniKey.');
  });

  // Test Case: Verify WIF against MiniKey (Compressed, Testnet)
  it('should verify a WIF key matches its MiniKey (compressed=true, testnet=true)', () => {
    const miniKey = generateValidMiniKey();
    const hexKey = Converter.miniToHex(miniKey);
    const wifKey = Converter.hexToWif(hexKey, true, true);

    const isValid = Converter.verifyWifAgainstMiniKey(miniKey, wifKey, true, true);
    expect(isValid).toBe(true, 'The compressed testnet WIF key should match its MiniKey.');
  });

  // Test Case: WIF mismatch with MiniKey
  it('should return false for WIF that does not match MiniKey', () => {
    const miniKey = generateValidMiniKey();
    const invalidWif = '5HueCGU8rMjxEXxiPuD5BDu3qa8N1P2Sr2jXZbNmi4xzFqJMPtj';
    expect(Converter.verifyWifAgainstMiniKey(miniKey, invalidWif)).toBe(false, 'WIF that does not match MiniKey should fail verification.');
  });

  // Test Case: Convert HEX to WIF (Parameterized Test)
  const testCases = [
    { hexKey: generateValidHexKey(), testnet: false, compressed: false, expected: '5JrXBQr9Rh5Vzz7qEik66qCU1ngWexSYeq58ctRkNkh1WPVFcb5' },
    { hexKey: generateValidHexKey(), testnet: true, compressed: true, expected: 'cSAZfsFmd3b8ANaRHy4Jt4EfrhvoYyoSn1KhjpSjx8VbV5Pc7PU2' },
  ];
  testCases.forEach(({ hexKey, testnet, compressed, expected }) => {
    it(`should convert HEX to WIF (testnet=${testnet}, compressed=${compressed})`, () => {
      const wifKey = Converter.hexToWif(hexKey, testnet, compressed);
      expect(wifKey).toBe(expected, `Failed for testnet=${testnet}, compressed=${compressed}`);
    });
  });

  // Test Case: Handle empty MiniKey input
  it('should handle empty MiniKey input', () => {
    const emptyMiniKey = '';
    expect(Converter.check(emptyMiniKey)).toBe(false, 'Empty MiniKey should fail validation.');
  });

  // Test Case: Handle null MiniKey input
  it('should handle null MiniKey input', () => {
    const nullMiniKey = null;
    expect(Converter.check(nullMiniKey)).toBe(false, 'Null MiniKey should fail validation.');
  });

  // Test Case: Handle invalid hexadecimal key in hexToWif
  it('should throw an error for invalid hexadecimal key', () => {
    const invalidHexKey = 'ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ';
    expect(() => Converter.hexToWif(invalidHexKey)).toThrowError('Invalid hexadecimal key format');
  });

  // Stress Test: Generate 1000 valid MiniKeys
  it('should generate 1000 valid MiniKeys', () => {
    for (let i = 0; i < 1000; i++) {
      const miniKey = Converter.generateMiniKey();
      expect(Converter.check(miniKey)).toBe(true, `Failed at iteration ${i} with MiniKey: ${miniKey}`);
    }
  });
});
