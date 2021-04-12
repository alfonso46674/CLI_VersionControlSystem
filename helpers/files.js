const fs = require('fs-extra')
const path = require('path')

module.exports = {
    getCurrentDirectoryBase: () => {
        return path.basename(process.cwd());
    },
    getCurrentDirectory: () => {
        return process.cwd();
    },
    directoryExists: (filePath) => {
        return fs.existsSync(filePath);
    },
    copyFiles,
    getAllFiles,
    createDirectories,
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