const filesFunctions = require('../../helpers/files')

module.exports.description = 'Revert snapshot';
module.exports.command = function (yargs) {

    //create yargs new argument for passing a snapshot number
    const argv = yargs.options({
        n: {
            demand: true, //this argument is required
            alias: 'SnapHash',
            describe: 'Snapshot hash',
            string: true //always parse the address argument as a string
        }
    }).argv;

console.log(filesFunctions.getAllFiles('.'));

}