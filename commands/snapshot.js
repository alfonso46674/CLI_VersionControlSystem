const fs = require('fs-extra')
const {
    hashElement
} = require('folder-hash')

const filesFunctions = require('../helpers/files')


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
                copyFiles('.', snapshotPath, nameOfRepo)
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
        date: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
        message: message
    }

    fs.writeFileSync(dest + '/snapshot.json', JSON.stringify(snapshotInfo), (err) => {
        if (err) throw err;
    })
}


function copyFiles(src, dest, folderToIgnore) {
    //obtain all files from src
    let files = getAllFiles(src);

    for (let i = 0; i < files.length; i++) {
        //if the path of a file does notincludes the folder to ignore, create its folder structure, and then copy it
        if (!files[i].includes(folderToIgnore)) {
            //create folder structure
            createDirectories(files[i], dest);
            //copy the file to the destination folder 
            fs.copySync(files[i], dest + '/' + files[i])
        }
    }
}

//Returns all the files in a certain directory 
function getAllFiles(dir, files_) {
    files_ = files_ || [];
    let files = fs.readdirSync(dir);
    for (let i in files) {
        let name = dir + '/' + files[i]
        // console.log(path.basename(name));

        if (fs.statSync(name).isDirectory()) {
            getAllFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

//creates the folder structure to copy file into it
//Receives a string that is the path for each folder, and the destination where the folders will be created
function createDirectories(path, dest) {

    //used to validate in the loop if a path exists or not
    let appendedDirectories = dest + '/'

    //separate the path by / to obtain the folders
    let directories = path.split('/')

    //do not take into account the last element of directories because its a file, not a folder
    for (let i = 0; i < directories.length - 1; i++) {
        //append the previous folder to check for the status of the next subdirectory if there is one
        appendedDirectories += directories[i] + '/'
        //check if directories are already created, and create them it they do not exists
        if (!fs.existsSync(appendedDirectories)) {
            fs.mkdirSync(appendedDirectories)
        }
    }
}