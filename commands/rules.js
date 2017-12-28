const {domainFilter} = require('lib.js');

function main(input, {output, whiteList, reportUri = ''}) {
    const directives = require(input);

    let cspRules = Object.keys(directives).map(directive => {
        let rules = directives[directive];

        if (whiteList) {
            rules = rules.filter(rule => {
                const match = domainFilter(rule);
                return whiteList.indexOf(
                    match ? match[0] : rule
                ) > -1;
            });
        }

        if (rules.length > 0) {
            return `${directive} ${rules.join('\n')}`;
        }
    }).filter(Boolean);

    if (!cspRules.length) {
        console.log('No CSP rules were created');
        return;
    }
    if (reportUri) {
        reportUri = `;\nreport-uri ${reportUri}`;
    }
    cspRules = cspRules.join(';\n');
    cspRules = cspRules.replace(/"/g, '\'');
    cspRules += reportUri;

    if (output) {
        const filePath = require('path').resolve('./out', output);
        require('fs').writeFileSync(filePath, cspRules);
        console.log('%s writted', filePath);
    } else {
        console.log(cspRules);
    }
}

module.exports = main;