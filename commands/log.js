const fs = require('fs-extra')

const filesFunctions = require('../helpers/files')

module.exports.description = 'Show the log history of snapshots';
module.exports.command = function (yargs) {

    if (filesFunctions.directoryExists('.jpar')) {
        let files = fs.readdirSync('.jpar/snapshots/')
        if (files.length == 0) {
            console.log('No snapshot history to show');
        } else {
            let logJSONS = []
            for (let i in files) {
                if (fs.existsSync(`.jpar/snapshots/${files[i]}/snapshot.json`)) {
                    logJSONS.push(fs.readJSONSync(`.jpar/snapshots/${files[i]}/snapshot.json`))
                }
            }

            console.log(logJSONS.sort(compareDates));
        }
    } else {
        console.error('.jpar repository not found');
        process.exit();
    }
}


function compareDates(a, b) {
    if (Date.parse(a.date) < Date.parse(b.date)) {
        return -1;
    }
    if (Date.parse(a.date) > Date.parse(b.date)) {
        return 1;
    }
    return 0;
}