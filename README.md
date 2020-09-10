# T3MPL

[![Build Status](https://travis-ci.org/b4rtaz/t3mpl-core.svg?branch=master)](https://travis-ci.org/b4rtaz/t3mpl-core)

T3MPL is the core library of T3MPL Editor. This project contains the template YAML parser and the template generator. The generator can be used in the browser or by command line (by Node).

### CLI

The generator support only `build` command for now. To build a template, the generator needs the template manifest path and the data JSON path.

```node t3mpl.js build --manifest=examples/boilerplate-template/template.yaml --data=examples/boilerplate-data/data.json --outDir=build/```

This project contains [the template example](examples/boilerplate-template) and [the data example](examples/boilerplate-data).

### License

This project is released under the MIT license.
