const fs = require('fs-extra')

const filesFunctions = require('../../helpers/files')

module.exports.description = 'Revert snapshot';
module.exports.command = function (yargs) {

    //create yargs new argument for passing a snapshot number
    const argv = yargs.options({
        n: {
            demand: true, //this argument is required
            alias: 'hashSnapshot',
            describe: 'Snapshot hash',
            string: true //always parse the address argument as a string
        }
    }).argv;

    let snapshotPath = `./.jpar/snapshots/${argv.hashSnapshot}`

    //check if the commit folder exists
    if(fs.existsSync(snapshotPath)){
        
        //obtain directories in root folder
        let directories = filesFunctions.getDirectoriesInPath('.');
        for(let i = 0; i < directories.length; i++){
            //if the directory isnot .jpar, delete it and everything in it recursively
            if(!(directories[i] == '.jpar')){
                fs.rmdirSync(`./${directories[i]}`, {recursive: true})
            }
        }
        
        //obtain the remaining files that are in root folder and delete them
        filesFunctions.deleteFiles('.','.jpar');


        //copy the commit from /snapshots to the working directory
        filesFunctions.copyFilesFromSnapshotToWD(snapshotPath,'.')

        //update the branch_pointer to the reverted snapshot
        fs.writeFileSync('.jpar/refs/branch_pointers/main',argv.hashSnapshot)

        return console.log(`Found commit folder ${argv.hashSnapshot}`);
    } else{
        return console.error('Unable to find commit to revert to');
    }


}