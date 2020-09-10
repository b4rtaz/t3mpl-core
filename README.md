# T3MPL Core

[![Build Status](https://travis-ci.org/b4rtaz/t3mpl-core.svg?branch=master)](https://travis-ci.org/b4rtaz/t3mpl-core) [![Coverage Status](https://coveralls.io/repos/github/b4rtaz/t3mpl-core/badge.svg?branch=master)](https://coveralls.io/github/b4rtaz/t3mpl-core?branch=master)

T3MPL is the core library of [T3MPL Editor](https://github.com/b4rtaz/t3mpl-editor). This project contains the template YAML parser and the template generator. The generator can be used in the browser or by command line (by Nodejs).

### CLI

The generator supports only `build` command for now. To build a template, the generator needs the template manifest path and the data JSON path.

```node t3mpl.js build --manifest=examples/boilerplate-template/template.yaml --data=examples/boilerplate-data/data.json --outDir=build/```

This project contains [the template example](examples/boilerplate-template) and [the data example](examples/boilerplate-data).

### License

This project is released under the MIT license.
