# Bitcoin Mini Private Key Converter

This project is a Node.js library and CLI tool for working with Bitcoin's **Mini private key** format. It provides utilities for validating, generating, converting, and verifying Wallet Import Format (WIF) private keys based on the Bitcoin Mini private key input.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
  - [CLI Commands](#cli-commands)
  - [Basic Example](#basic-example)
- [Tests](#tests)
- [Security](#security)
- [License](#license)

## Features

- **Validation of Bitcoin Mini private keys**  
  Ensures the MiniKey follows the proper format.  
  Example: `S6c56bnXQiBjk9mqSYE7ykVQ7NzrRy`

- **Generation of Bitcoin Mini private keys**  
  Generates new 30-character MiniKeys that pass all validation checks.  
  Example: `S9K8CNzE2U3RhYvp5AL8BWXYnVfTmP`

- **Conversion to HEX private keys**  
  Converts a valid MiniKey to its 64-character HEX representation.  
  Example: `0C28FCA386C7A227600B2FE50B7CAE11EC86D3BF1FBE471BE89827E19D72AA1D`

- **Conversion to Wallet Import Format (WIF)**  
  Generates WIF keys for mainnet and testnet, supporting compressed and uncompressed keys.  
  Example: `5HueCGU8rMjxEXxiPuD5BDu3qa8N1P2Sr2jXZbNmi4xzFqJMPtj`

- **Verification of WIF keys**  
  Verifies whether a WIF key corresponds to its original MiniKey.  

- **Logging to Console and File**  
  Logs are written to the console and to the `app.log` file in the project directory. Use the `--verbose` and `--quiet` options to adjust log verbosity.

## Requirements

- **Node.js**: Version 20.11.1 (specified in `.nvmrc` or `package.json` under `engines`).
- **Dependencies**: Refer to the `package.json` file for required modules.

## Installation

To install dependencies for local use:

```bash
npm install
```

To install globally as a CLI tool:

```bash
npm install -g minikey-converter
```

After installation, use the CLI anywhere:

```bash
minikey-converter process S6c56bnXQiBjk9mqSYE7ykVQ7NzrRy
```

## Usage

### CLI Commands

1. **Generate a MiniKey**  

```bash
minikey-converter generate
```

This will generate a new MiniKey, convert it to HEX, and generate WIF keys for both mainnet and testnet.

2. **Validate a MiniKey**  

```bash
minikey-converter validate S6c56bnXQiBjk9mqSYE7ykVQ7NzrRy
```

3. **Convert a MiniKey to HEX**  

```bash
minikey-converter to-hex S6c56bnXQiBjk9mqSYE7ykVQ7NzrRy
```

4. **Convert HEX to WIF**  

Generate mainnet WIF:

```bash
minikey-converter to-wif 4C7A9640C72DC2099F23715D0C8A0D8A35F8906E3CAB61DD3F78B67BF887C9AB
```

Generate testnet WIF:

```bash
minikey-converter to-wif 4C7A9640C72DC2099F23715D0C8A0D8A35F8906E3CAB61DD3F78B67BF887C9AB --testnet
```

Generate compressed WIF:

```bash
minikey-converter to-wif 4C7A9640C72DC2099F23715D0C8A0D8A35F8906E3CAB61DD3F78B67BF887C9AB --compressed
```

5. **Verify a WIF key against a MiniKey**  

```bash
minikey-converter verify S6c56bnXQiBjk9mqSYE7ykVQ7NzrRy 5HueCGU8rMjxEXxiPuD5BDu3qa8N1P2Sr2jXZbNmi4xzFqJMPtj
```

6. **Full Workflow: Validate, Convert to HEX, and WIF**  

```bash
minikey-converter process S6c56bnXQiBjk9mqSYE7ykVQ7NzrRy
```

#### Log Level Options

The following global options control the logging output for all CLI commands:

- **Default**: Logs general information (`info` level).
- **Verbose Mode**: Add `--verbose` to display detailed logs (`debug` level).
- **Quiet Mode**: Add `--quiet` to suppress all logs except errors (`error` level).

Example:

```bash
minikey-converter process S6c56bnXQiBjk9mqSYE7ykVQ7NzrRy --verbose
```

### Basic Example

```javascript
const MiniKeyConverter = require('./src/Classes/MiniKeyConverter');
const Converter = new MiniKeyConverter();

// Generate a MiniKey
const miniKey = Converter.generateMiniKey();
console.log(`Generated MiniKey: ${miniKey}`);

// Validate Bitcoin Mini private key
console.log(`Is valid: ${Converter.check(miniKey)}`); // Expected Output: Is valid: true

// Convert Bitcoin MiniKey to HEX
const hexKey = Converter.miniToHex(miniKey);
console.log(`HEX Private Key: ${hexKey}`); // Expected Output: HEX Private Key: 0C28FCA386C7A227600B2FE50B7CAE11EC86D3BF1FBE471BE89827E19D72AA1D

// Convert HEX to WIF
const wifKey = Converter.hexToWif(hexKey, false, true);
console.log(`WIF Key: ${wifKey}`); // Expected Output: WIF Key: KwDiBf89QgGbjEhKnhXJuH7SUWJ9aWdh9vVVGF7NDNN1D8TPCAiG

// Verify if the WIF matches the MiniKey
const isValid = Converter.verifyWifAgainstMiniKey(miniKey, wifKey);
console.log(`WIF matches MiniKey: ${isValid}`); // Expected Output: WIF matches MiniKey: true
```

## Tests

Run the test suite to ensure everything works correctly:

```bash
npm test
```

## Security

- This tool processes private keys and generates sensitive outputs (e.g., WIF keys). Handle all inputs and outputs securely.
- Avoid running the tool on untrusted systems or sharing private keys.
- Logs may contain private keys when using `--verbose`. Consider clearing the `app.log` file after use if this is a concern.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
