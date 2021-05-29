# CryptoEditorDemo

This project was created as a part of the recruitment process to provide some skill overview.

## Project background

### Overview

It's a simple text editor which parse text inputed by the user and replace markdown-like marks with information about cryptocurrencies fetched from https://api.coinpaprika.com, based on the function and argument in the mark by the user.

Proper mark format: `{{ [function_name]/[argument] }}`

Supported functions:
| Function       | Argument           | Description  |
|:------------- |:-------------|:-----|
| Name      | symbol (ex. BTC / DOGE) | replace marker with cryptocurrency name |
| Price      | symbol (ex. BTC / DOGE)      |   replace marker with up-to-date cryptocurrency value in USD |

**Errors will be handled by replacing mark with "INCORRECT_FUNCTION" and "INCORRECT_SYMBOL" placeholders.**

### How it works

Every change of input data trigger parser (with 250ms throttle) which finds all marks within provided input text, and executes provided functions with given arguments. The first occurence of unique function-argument set will result in data fetch Redux store update - that data will be used next time to avoid sending redundant requests. If user pass an invalid function name the whole mark will be replaced with "INCORRECT_FUNCTION" string and new error will be added to ErrorLog. If user pass valid function name but API will not recognize passed argument as valid it will also be replaced by an error sting: "INCORRECT_SYMBOL", beside that, passed argument will be stored by the application and marked as incorrectSymbol. Any marks containing argument marked as incorrectSymbol will be replaced by an error sting: "INCORRECT_SYMBOL" - API request will be skipped to optimize the performance.

### Example input data

In 1998, Wei Dai published a description of "b-money", characterized as an anonymous, distributed electronic cash system.[Shortly thereafter, Nick Szabo described bit gold. Like {{ Name/BTC }} and other cryptocurrencies that would follow it, bit gold (not to be confused with the later gold-based exchange, {{ Name/BITGOLD }}) was described as an electronic currency system which required users to complete a proof of work function with solutions being cryptographically put together and published. A currency system based on a reusable proof of work was later created by Hal Finney who followed the work of Dai and Szabo.
The first decentralized cryptocurrency, {{ Name/BTC }}, was created in 2009 by pseudonymous developer Satoshi Nakamoto. It used SHA-256, a cryptographic hash function, as its proof-of-work scheme. In April 2011, {{ Name/NMC }} was created as an attempt at forming a decentralized DNS, which would make internet censorship very difficult. Soon after, in October 2011, {{ Name/LTC }} was released. It was the first successful cryptocurrency to use scrypt as its hash function instead of SHA-256. Another notable cryptocurrency, {{ Name/PPC }} was the first to use a proof-of-work/proof-of-stake hybrid.
