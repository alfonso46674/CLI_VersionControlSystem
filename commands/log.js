const fs = require('fs-extra')

module.exports.description = 'Show the log history of snapshots';
module.exports.command = function (yargs) {

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
}


function compareDates(a,b){
    if(Date.parse(a.date) < Date.parse(b.date)){
        return -1;
    }
    if(Date.parse(a.date) > Date.parse(b.date)){
        return 1;
    }
    return 0;
}