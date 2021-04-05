const fs = require('fs-extra')

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

        //read the existing numbered folders in /snapshots/ 
        let files = fs.readdirSync('.jpar/snapshots/')

        //if there is no snapshot, create the first one
        if (files.length == 0) {
            let snapshotName = snapshotBaseName + '1'
            //create the first snapshot with 1 as the name of the folder
            fs.mkdirSync(snapshotName);
            //copy all the files from . to the snapshot folder, and ignoring the .jpar folder
            copyFiles('.', snapshotName, nameOfRepo)

        } else {

            //read the existing numbered folders in /snapshots/ and parse them to integers
            for (let i in files) {
                files[i] = parseInt(files[i], 10)
            }
            //obtain the highest numbered snapshot and add + 1 to obtain the index for the newest snapshot
            let newSnapshotIndex = Math.max(...files) + 1;
            //append the newest index to the snapshot name
            let snapshotName = snapshotBaseName + newSnapshotIndex.toString()
            //create the snapshot folder
            fs.mkdirSync(snapshotName);
            //copy all the files from . to the snapshot folder, and ignoring the .jpar folder
            copyFiles('.', snapshotName, nameOfRepo)

        }
    } else {
        console.error('.jpar repository not found');
        process.exit();
    }
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