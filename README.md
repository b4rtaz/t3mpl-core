# T3MPL Core

[![Build Status](https://travis-ci.com/b4rtaz/t3mpl-core.svg?branch=master)](https://travis-ci.com/b4rtaz/t3mpl-core) [![Coverage Status](https://coveralls.io/repos/github/b4rtaz/t3mpl-core/badge.svg?branch=master)](https://coveralls.io/github/b4rtaz/t3mpl-core?branch=master) [![License: MIT](https://img.shields.io/github/license/mashape/apistatus.svg)](/LICENSE) [![Twitter: b4rtaz](https://img.shields.io/twitter/follow/b4rtaz.svg?style=social)](https://twitter.com/b4rtaz)

T3MPL is the core library of [T3MPL Editor](https://github.com/b4rtaz/t3mpl-editor). This project contains the template YAML parser and the template generator. The generator can be used in the browser or by command line (by Nodejs).

This project contains [the template example](examples/boilerplate-template) and [the data example](examples/boilerplate-data).

## ⚙️ How to Build

[Node.js](https://nodejs.org/en/) is required.

```
npm install
npm run build
```

## ✨ CLI

You can use T3MPL from CLI. To install globally enter bellow commands. Node.js is required.

```
npm install -g t3mpl-core
t3mpl version
```

### Build

To build a template, the generator needs the template manifest path and the data. You can pass the path to the own data by  `--data=PATH` argument or generate an example data by `--exampleData=true` argument.

##### Own Data

```t3mpl build --manifest=examples/boilerplate-template/template.yaml --data=examples/boilerplate-data/data.json --outDir=build/```

##### Example Data

```t3mpl build --manifest=examples/boilerplate-template/template.yaml --exampleData=true --outDir=build/```

## 💡 License

This project is released under the MIT license.
