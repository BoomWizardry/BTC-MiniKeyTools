# BTC-MiniKeyTools

BTC-MiniKeyTools is a robust tool for working with Bitcoin Mini private keys. It provides validation, key generation, and conversion functionalities, including HEX and Wallet Import Format (WIF) keys. Fully equipped with CLI support and logging options, it's designed for Bitcoin developers and enthusiasts alike.

## Table of Contents
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
  - [CLI Commands](#cli-commands)
  - [Basic Example](#basic-example)
- [Documentation](#documentation)
- [Project Link](#project-link)
- [NPM Package](#npm-package)
- [Tests](#tests)
- [Security](#security)
- [License](#license)

## Features
- **Validation of Bitcoin Mini private keys**
  Ensures the MiniKey follows the proper format.
  Example: `S6c56bnXQiBjk9mqSYE7ykVQ7NzrRy`

- **Conversion to HEX private keys**
  Converts a valid MiniKey to its 64-character HEX representation.
  Example: `0C28FCA386C7A227600B2FE50B7CAE11EC86D3BF1FBE471BE89827E19D72AA1D`

- **Conversion to Wallet Import Format (WIF)**
  Generates WIF keys for mainnet and testnet, supporting compressed and uncompressed keys.
  Example: `5HueCGU8rMjxEXxiPuD5BDu3qa8N1P2Sr2jXZbNmi4xzFqJMPtj`

- **Key Generation**
  Randomly generates valid 30-character MiniKeys.
  Example: `S1LgfDWujrsGfSbvGfTHbZn5yCFCv4`

- **Logging to Console and File**
  Logs are written to the console and to the `app.log` file in the project directory. Use the `--verbose` and `--quiet` options to adjust log verbosity.

## Requirements
- **Node.js**: Version 20.11.1 (specified in `.nvmrc` or `package.json` under `engines`).
- **Dependencies**: Refer to the `package.json` file for required modules.

## Installation

To install dependencies for local use:
```bash
npm install btc-minikeytools
```

To install globally as a CLI tool:
```bash
npm install -g btc-minikeytools
```

After installation, use the CLI anywhere:
```bash
btc-minikeytools process S6c56bnXQiBjk9mqSYE7ykVQ7NzrRy
```

## Usage

### CLI Commands

1. **Generate a MiniKey**
   ```bash
   btc-minikeytools generate
   ```

2. **Validate a MiniKey**
   ```bash
   btc-minikeytools validate S6c56bnXQiBjk9mqSYE7ykVQ7NzrRy
   ```

3. **Convert a MiniKey to HEX**
   ```bash
   btc-minikeytools to-hex S6c56bnXQiBjk9mqSYE7ykVQ7NzrRy
   ```

4. **Convert HEX to WIF**
   Generate mainnet WIF:
   ```bash
   btc-minikeytools to-wif 4C7A9640C72DC2099F23715D0C8A0D8A35F8906E3CAB61DD3F78B67BF887C9AB
   ```

   Generate testnet WIF:
   ```bash
   btc-minikeytools to-wif 4C7A9640C72DC2099F23715D0C8A0D8A35F8906E3CAB61DD3F78B67BF887C9AB --testnet
   ```

   Generate compressed WIF:
   ```bash
   btc-minikeytools to-wif 4C7A9640C72DC2099F23715D0C8A0D8A35F8906E3CAB61DD3F78B67BF887C9AB --compressed
   ```

5. **Full Workflow: Validate, Convert to HEX, and WIF**
   ```bash
   btc-minikeytools process S6c56bnXQiBjk9mqSYE7ykVQ7NzrRy
   ```

#### Log Level Options
- **Default**: Logs general information (`info` level).
- **Verbose Mode**: Add `--verbose` to display detailed logs (`debug` level).
- **Quiet Mode**: Add `--quiet` to suppress all logs except errors (`error` level).

Example:
```bash
btc-minikeytools process S6c56bnXQiBjk9mqSYE7ykVQ7NzrRy --verbose
```

### Basic Example
```javascript
const MiniKeyConverter = require('btc-minikeytools');
const converter = new MiniKeyConverter();

// Validate Bitcoin MiniKey
const miniKey = 'S6c56bnXQiBjk9mqSYE7ykVQ7NzrRy';
console.log(`Is valid: \${converter.check(miniKey)}`);

// Generate a new MiniKey
const generatedMiniKey = converter.generateMiniKey();
console.log(`Generated MiniKey: \${generatedMiniKey}`);
```

## Documentation
The complete documentation is available [here](https://boomwizardry.github.io/BTC-MiniKeyTools/).

## Project Link
Find the full project on GitHub: [BTC-MiniKeyTools](https://github.com/BoomWizardry/BTC-MiniKeyTools).

## NPM Package
Install or view the package on NPM: [btc-minikeytools](https://www.npmjs.com/package/btc-minikeytools).

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
