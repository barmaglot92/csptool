const es = require('event-stream');

function transformDirective(directive = '') {
    return directive.replace(/"([\w-]+).*/i, '$1');
}

function domainFilter(uri = '') {
    return uri.match(/(?!(w+)\.)\w*(?:\w+\.)+\w+/gm);
}

module.exports = {
    transformDirective,
    domainFilter,
    transformCspChunk: es.mapSync((chunk = {}) => {
        const match = domainFilter(chunk.blocked_uri);

        if (!match || !chunk['violated-directive']) {
            return;
        }

        return {
            'directive': transformDirective(chunk['violated-directive']),
            blocked_uri: match[0]
        };
    }),
    getWildcard(domain = '') {
        const splitted = domain.split('.');

        if (splitted.length > 2) {
            splitted[0] = '*';
        }
        
        return splitted.join('.');
    }
};