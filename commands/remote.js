const URL = require('url').URL
const fs = require('fs-extra')
const chalk = require('chalk');

const filesFunctions = require('../helpers/files')

module.exports.description = 'Add remote server url';
module.exports.command = function (yargs) {

    //create yargs new argument for passing the remote url
    const argv = yargs.options({
        url: {
            demand: true, //this argument is required
            describe: 'Url for the remote VCS server',
            string: true //always parse the address argument as a string
        }
    }).argv;
    if (filesFunctions.directoryExists('.jpar')) {
        if (stringIsValidURL(argv.url)) {
            fs.writeFileSync('.jpar/refs/remote/server', argv.url)
            console.log(chalk.green(`Remote url added: ${argv.url}`))
        } else {
            console.error(chalk.red('Invalid remote url'));
        }

    } else {
        console.error(chalk.red('.jpar repository not found'))
    }

}

function stringIsValidURL(s) {
    try {
        new URL(s)
        return true
    } catch {
        return false
    }
}