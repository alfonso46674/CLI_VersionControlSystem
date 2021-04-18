const fs = require('fs-extra')
const {
    hashElement
} = require('folder-hash')

const filesFunctions = require('../../helpers/files')


module.exports.description = 'Create snapshot of current directory';
module.exports.command = function (yargs) {

    //create yargs new argument for passing a message
    const argv = yargs.options({
        m: {
            demand: true, //this argument is required
            alias: 'message',
            describe: 'Snapshot message',
            string: true //always parse the address argument as a string
        }
    }).argv;
    // console.log(argv.message);
    if (filesFunctions.directoryExists('.jpar')) {
        //TODO: Share the nameofRepo variable between files for easier maintenance
        let nameOfRepo = '.jpar'
        let snapshotBaseName = `${nameOfRepo}/snapshots/`;

        //create a hash based on the working directory
        hashElement('.',{algo: 'sha1', encoding: 'hex'})
            .then(hash => {
                //obtain the hash created from the working directory
                let hashSnapshot = hash.hash;
                //append the hashSnapshot to the base path of the snapshots
                let snapshotPath = snapshotBaseName + '/' + hashSnapshot
                //create the snapshot folder
                fs.mkdirSync(snapshotPath);
                //copy all the files from . to the snapshot folder, and ignoring the .jpar folder
                filesFunctions.copyFilesFromWDToSnapshot('.', snapshotPath, nameOfRepo)
                //create the manifest for the snapshot
                createSnapshotManifest(snapshotPath, argv.message, hashSnapshot)
                //update the branch_pointer for the recent snapshot
                fs.writeFileSync('.jpar/refs/branch_pointers/main', hashSnapshot)

            })
            .catch(error => {
                return console.error('Error at creating the snapshot: ', error)
            })


    } else {
        console.error('.jpar repository not found');
        process.exit();
    }
}

//Create the snapshot manifest in the destination path
function createSnapshotManifest(dest, message, snapshotName) {
    let date = new Date();
    const snapshotInfo = {
        snapshot: snapshotName,
        // date: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
        date: date.toISOString(),
        message: message
    }

    fs.writeFileSync(dest + '/snapshot.json', JSON.stringify(snapshotInfo), (err) => {
        if (err) throw err;
    })
}
