const chalk = require('chalk');
const fs = require('fs-extra')
const path = require('path')
const request = require('request')

const filesFunctions = require('../helpers/files')

module.exports.description = 'Show the assigned tickets to a certain email';
module.exports.command = function (yargs) {

    //create yargs new argument for passing a email
    const argv = yargs.options({
        email: {
            demand: true, //this argument is required
            describe: 'Developers email',
            string: true //always parse the address argument as a string
        }
    }).argv;

    if (filesFunctions.directoryExists('.jpar')) {

        //request the tickets to the remote URL
        let remoteURL = fs.readFileSync('.jpar/refs/remote/server', 'utf8')
        if (stringIsValidURL(remoteURL)) {

            const options = {
                method: 'GET',
                url: remoteURL + `/obtainTicket?devEmail=${argv.email}`
            }

            //do the request
            request(options, function (err, res, body) {
                if (err || res.statusCode == 400 || res.statusCode == 500) {
                    console.log(err);
                    console.error(chalk.red(`Error while retrieving tickets for ${argv.email}`));
                } else {
                    console.log((JSON.parse(res.body)))
                }
            })
        } else {
            console.error(chalk.red('Error at retrieving tickets; Check remote url'));
        }



    } else {
        console.error(chalk.red('.jpar repository not found'));
        process.exit();
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