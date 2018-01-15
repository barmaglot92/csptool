const fs = require('fs');
const JSONStream = require('JSONStream');
const {transformCspChunk, getWildcard} = require('lib.js');

const wildcardHash = {};
const directives = {};

function generateWildcardHash(directive, blocked_uri, whiteList) {
    const domainWildcard = getWildcard(blocked_uri);

    if (whiteList) {
        if (whiteList.indexOf(blocked_uri) === -1) {
            return;
        }
    }
    
    if (!wildcardHash[directive]) {
        wildcardHash[directive] = {};
    }

    if (!wildcardHash[directive][domainWildcard]) {
        wildcardHash[directive][domainWildcard] = [];
    }

    wildcardHash[directive][domainWildcard].push(blocked_uri);
}

function convertToDirectives({repeats = 3, autoSchema, defaults = {}} = {}) {
    Object.assign(directives, Object.keys(wildcardHash).reduce((acc, directiveName) => {
        if (!acc[directiveName]) {
            acc[directiveName] = [];
        }

        Object.keys(wildcardHash[directiveName]).forEach(domainWildcard => {
            let domainsToPush = [];
            const domains = wildcardHash[directiveName][domainWildcard];

            if (domains.length >= repeats) {
                // use wildcard
                domainsToPush.push(domainWildcard);
            } else {
                // use domains
                domainsToPush.push(...domains);
            }

            if (autoSchema) {
                domainsToPush = domainsToPush.map(d => `https://${d} http://${d}`)
            }

            acc[directiveName].push(...domainsToPush);
        });
        
        return acc;
    }, defaults));
}

function main(input, {output, repeats, autoSchema, defaults, whiteList}) {
    fs.createReadStream(input)
        .pipe(JSONStream.parse('*'))
        .pipe(transformCspChunk)
        .on('data', ({directive, blocked_uri}) => generateWildcardHash(directive, blocked_uri, whiteList))
        .on('end', () => {
            convertToDirectives({repeats, autoSchema, defaults});
            if (output) {
                const filePath = require('path').resolve('./out', output);
                fs.writeFileSync(filePath, JSON.stringify(directives, null, '\t'));
                console.log('%s writted', filePath);
            } else {
                console.log(directives);
            }
        })
}

module.exports = main;