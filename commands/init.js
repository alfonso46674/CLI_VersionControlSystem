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
            fs.mkdirSync(nameOfRepo.concat('/snapshots'));

            console.log('Initialized empty jpar repository at ' + files.getCurrentDirectory().concat(`\\${nameOfRepo}\\`) );

        } else {
            console.error('Path not valid');
            process.exit();
        }
    }

}