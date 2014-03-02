/*
 * grunt-po-json
 * 
 *
 * Copyright (c) 2014 Nicky Out
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Configuration of postStrToObject
    var idReturn = '',
        strReturn = '',
        findID = /msgid\s+"(.*?)"$/,
        findStr = /msgstr\s+"(.*?)"$/,
        find = /"(.*?)"/,
        h = 'yellow',
        pn = 'white',
        tn = 'grey';

    grunt.registerMultiTask('po_json', 'Converts one or more po files to a single json or amd module.', function()
    {
        var options = this.options(),
            files = this.data.files;

        if (this.files.length == 0)
        {
            grunt.log.warn('Task "' + this.target +'" contains no files to convert. Omitting...');
            return;
        }

        for (var name in files)
        {
            if (!files.hasOwnProperty(name))
                continue;
            convertTask(files[name], name, options);
        }
    });

    /**
     * The actual convert task. Reads the file(s) in src and writes to dest.
     *
     * @param {String|Object} src accepts a path or a {[ns]: [path]} formatted object.
     * @param {String} destPath the destination path for the file.
     * @param {Object} options pass this.options() here.
     */
    var convertTask = function(src, destPath, options)
    {
        var poStr,
            returnObj = {},
            returnStr,
            amd = options.amd || false;

        switch (grunt.util.kindOf(src))
        {
            case "string":
                (poStr = safeReadFile(src)) && (poStrToObject(poStr, returnObj, src));
                break;

            case "object":
                // assume multiple, nested, src
                for (var namespace in src)
                {
                    if (!src.hasOwnProperty(namespace))
                        continue;

                    (poStr = safeReadFile(src[namespace])) && (returnObj[namespace] = {}) && (poStrToObject(poStr, returnObj[namespace], src[namespace]));
                }
                break;
        }

        // Seems to still process the gigantic string...
        returnStr = JSON.stringify(returnObj);
        if (amd)
            returnStr = 'define(' + returnStr + ');';
        grunt.file.write(destPath, returnStr);
        grunt.log.writeln('File "' + destPath + '" created.');
    };

    /**
     * Generic read file and return content if exists.
     * @param path
     * @returns {*}
     */
    var safeReadFile = function(path)
    {
        if (!grunt.file.exists(path)) {
            grunt.log.warn('Source file "' + path + '" not found.');
            return null;
        } else {
            return grunt.file.read(path);
        }

    };

    /**
     * Accepts the contents of a po file, and puts all translations in the target Object.
     *
     * @param {String} poStr the contents of a po file.
     * @param {Object=} target Target object. If not specified, creates new object
     * @param {String} sourceName Used for logging only.
     * @param {Boolean} includeCommented pass true to include translations that are commented out.
     * @returns {Object} The translations in name-value pairs.
     */
    var poStrToObject = function(poStr, target, sourceName, includeCommented)
    {
        target || (target = {});
        grunt.log.writeln('Reading ' + sourceName + '...');
        var id = '', str = '',
            match,
            line,
            mode = 0;

        for (var i= 0, arr = poStr.split(/[\r\n]/g), max = arr.length; i<max; line = arr[i++])
        {
            if (!line || line.charAt(0) == '#' && !includeCommented)
                continue;

            switch (mode)
            {
                case 0:
                    match = line.match(findID);
                    if (match)
                    {
                        // id - str pair complete, put into out
                        if (id && str)
                        {
                            target[id] = str;
                            grunt.verbose.writeln('['[h] + sourceName + '] '[h] + ('"'+id+'"')[pn] + ': ' + ('"'+str+'"')[tn]);
                        }
                        // start new id
                        id = match[1];
                        str = '';
                        mode = 1;
                        break;
                    }
                    match = line.match(find);
                    if (match)
                    {
                        // append to existing str
                        str += strReturn + match[1];
                        break;
                    }
                    break;
                case 1:
                    match = line.match(findStr);
                    if (match)
                    {
                        // start new str
                        str = match[1];
                        mode = 0;
                        break;
                    }
                    match = line.match(find);
                    if (match)
                    // append to existing id
                        id += idReturn + match[1];
                    break;
            }
        }
        // Write final result as well...
        if (id && str)
        {
            target[id] = str;
            grunt.verbose.writeln('['[h] + sourceName + '] '[h] + ('"'+id+'"')[pn] + ': ' + ('"'+str+'"')[tn]);
        }
        return target;
    };

    // Debug tool: view object properties
    function viewObj(text, target)
    {
        var h = 'yellow',
            type,
            content;
        if (text)
            grunt.log.writeln(text[h]);
        for (var name in target)
        {
            type = grunt.util.kindOf(target[name]);
            content = (target[name] + '').match(/^.*?$/m);
            grunt.log.writeln((' - {' + type + '} ')[h] + name + ': ' + content[0].grey);
        }
    }
};
