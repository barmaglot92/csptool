require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command('directives', 'Create csp directives', yargs => {
        return yargs
            .option('input', {
                alias: 'i',
                type: 'string',
                desc: 'Standard CSP log in JSON format',
                demandOption: true
            })
            .option('output', {
                alias: 'o',
                type: 'string',
                desc: 'Output file in out/ with directives in JSON format'
            })
            .option('repeats', {
                default: 3,
                alias: 'r',
                type: 'number',
                desc: 'Number of domains repeats for wildcard replacing'
            })
            .option('autoSchema', {
                default: false,
                alias: 'as',
                type: 'boolean',
                desc: 'Add https and http protocol to generated domain names'
            })
            .option('defaults', {
                default: './defaults.json',
                alias: 'd',
                type: 'string',
                desc: 'Default CSP directives'
            });
    }, args => {
        const {input, output, repeats, autoSchema} = args;
        let defaults;
    
        if (args.defaults) {
            defaults = require(args.defaults);
        }

        require('./commands/directives')(input, {output, repeats, autoSchema, defaults});
    })
    .command('rules', 'Create csp header from directives', yargs => {
        return yargs
            .option('input', {
                alias: 'i',
                type: 'string',
                desc: 'Directives created by "generate directives" command',
                demandOption: true
            })
            .option('output', {
                alias: 'o',
                type: 'string',
                desc: 'Output file in out/ with rules'
            })
            .option('whiteList', {
                alias: 'wl',
                type: 'string',
                desc: 'Approved domains list in JSON format'
            })
            .option('reportUri', {
                alias: 'r',
                type: 'string',
                desc: 'Report URI'
            });
    }, args => {
        const {input, output, reportUri} = args;
        let whiteList;
    
        if (args.whiteList) {
            whiteList = require(args.whiteList);
        }

        require('./commands/rules')(input, {output, whiteList, reportUri});
    })
    .help('h')
    .alias('h', 'help')
    .showHelpOnFail(true)
    .demandCommand(1, '')
    .argv;