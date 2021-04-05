const fs = require('fs-extra')

module.exports.description = 'Show the log history of snapshots';
module.exports.command = function (yargs) {

    let files = fs.readdirSync('.jpar/snapshots/')
    for(let i in files){
        console.log(fs.readJSONSync(`.jpar/snapshots/${files[i]}/snapshot.json`));
    }
}