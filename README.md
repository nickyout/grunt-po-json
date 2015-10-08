# grunt-po-json

> Converts one or more po files to a single json or amd module.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-po-json --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-po-json');
```

## The "po_json" task

### Overview
In your project's Gruntfile, add a section named `po_json` to the data object passed into `grunt.initConfig()`. You must specify a target in which you can add `options` and `files`.

```js
grunt.initConfig({
  po_json: {
    target: {
      files: {
        'path/to/dest.json': 'path/to/src.po'
      }
    },
    targetMultiple: {
      options : {
        amd: true
      },
      files: {
        'path/to/dest2.js': {
          'src2': 'path/to/src2.json',
          'src3': 'path/to/src3.json'
        }
      }
    }
  },
});
```

### Options

#### options.amd
Type: `Boolean`
Default value: `false`

Wraps the result in a `define( );` call so you can use it as an amd module. You probably want your dest path to end with `.js` instead of `.json`.

#### options.useMsgctxtAsKey
Type: `Boolean`
Default value: `false`

Matches msgctxt and msgstr instead of msgid and msgstr.

### Files

#### files[property]
Type `String|Object`

Each property of the files object can be a string path to a `.po` file, or an object of properties with string paths to `.po` files. In case of an object, the output file will have the output of each `.po` file under their respective property names.

### Usage Examples

#### Default Options
This example processes two `.po` files and puts them in two separate `.json` files.

```js
grunt.initConfig({
  po_json: {
    target: {
      files: {
        'path/to/dest1.json': 'path/to/src1.po'
        'path/to/dest2.json': 'path/to/src2.po'
      }
    },
  },
});
```

#### Custom Options
This example processes two `.po` files and puts them in a single `.js` file. It also turns it in an (anonymous) amd module. When used, the conversion results are accessible via `obj.src1` and `obj.src2`.

```js
grunt.initConfig({
  po_json: {
    options: {
      amd: true
    },
    target: {
      files: {
        'path/to/dest.js': {
          'src1': 'path/to/src1.po',
          'src2': 'path/to/src2.po'
        }
      }
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
