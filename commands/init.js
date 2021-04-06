const fs = require('fs')
const hidefile = require('hidefile')

const files = require('../helpers/files')

module.exports.description = 'Initialize repository';
module.exports.command = function (yargs) {

    if(files.directoryExists('.jpar')){
        console.error('Already a jpar repository');
        process.exit();
    } else {
        
        if(files.directoryExists(files.getCurrentDirectory())){
            
            //create .jpar directory and hide it
            let nameOfRepo = '.jpar';
            fs.mkdirSync(nameOfRepo);
            hidefile.hideSync(nameOfRepo);

            //create the rest of the folders
            
            //folder for storing the snapshots
            fs.mkdirSync(nameOfRepo.concat('/snapshots'));
            
            //folder for storing references to files or directories
            fs.mkdirSync(nameOfRepo.concat('/refs'));
            //folder to store the pointer for the current snapshot in a branch
            fs.mkdirSync(nameOfRepo.concat('/refs/branch_pointers'));
            //create the pointer to the main branch without data in refs/branch_pointers
            fs.writeFileSync('.jpar/refs/branch_pointers/main','')
            //create the main pointer json file that serves as a pointer to the branch in use
            fs.writeFileSync('.jpar/MAINPOINTER.json',JSON.stringify({ref: 'refs/branch_pointers/main'}))
            
            console.log('Initialized empty jpar repository at ' + files.getCurrentDirectory().concat(`\\${nameOfRepo}\\`) );

        } else {
            console.error('Path not valid');
            process.exit();
        }
    }

}