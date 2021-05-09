const request = require('request')
const AdmZip = require('adm-zip')
const fs = require('fs-extra')
const chalk = require('chalk');

const filesFunctions = require('../helpers/files')

module.exports.description = 'Publish snapshots to remote server';
module.exports.command = function (yargs) {
        //create yargs new argument for passing a message
        const argv = yargs.options({
            id: {
                demand: true, //this argument is required
                describe: 'Ticket id',
                string: true //always parse the address argument as a string
            },
            snapshot:{
                demand: true, //this argument is required
                describe: 'Snapshot hash',
                string: true //always parse the address argument as a string
            }
        }).argv;

    if (filesFunctions.directoryExists('.jpar')) {
        

     
            //verify that snapshot exists
                if (fs.existsSync(`.jpar/snapshots/${argv.snapshot}/snapshot.json`)) {
                    //read the snapshot.json 
                    let snapshotManifest = JSON.parse(fs.readFileSync(`.jpar/snapshots/${argv.snapshot}/snapshot.json`,'utf-8'))
                    //if the snapshot has not been published, do it by a POST http request to the remote server
                    if(!snapshotManifest.publishedToRemote){
                        
                    //first do a zip of the snapshot, so it can be sent in one file
                        let zip = new AdmZip()
                        //Zip the current snapshot folder in the loop
                        zip.addLocalFolder(`.jpar/snapshots/${argv.snapshot}`)
                        //save the zip in .jpar/temp and with the same name as the snapshot
                        let zipPath = `.jpar/temp/${argv.snapshot}.zip`
                        zip.writeZip(zipPath)
                        

                        let remoteUrl = fs.readFileSync('.jpar/refs/remote/server', 'utf8')

                        //create the post options
                       const options = {
                        method: 'POST',
                        url: remoteUrl+'/snapshotReceive',
                        headers:{
                            "Content-Type":"multipart/form-data"
                        },
                        formData:{
                            //the snapshot_data is the key in the formData, this key must match on the receiving end of the post request
                            "snapshot_data": fs.createReadStream(zipPath),
                            'ticket_id': argv.id
                        }
                        };

                        //do the post request
                        request(options,function(err,res,body){
                            if(err || res.statusCode == 400) {
                                console.error(chalk.red(`Error while publishing snapshot: ${argv.snapshot}`))
                            }else{
                                console.log(chalk.green(JSON.parse(body).ticketStatus));
                                //set the publishedToRemote property to true
                                snapshotManifest.publishedToRemote = true
                                //rewrite the snapshot.json manifest
                                fs.writeFileSync(`.jpar/snapshots/${argv.snapshot}/snapshot.json`,JSON.stringify(snapshotManifest))
                            }
                        })

                       //remove zip from .jpar/temp
                       fs.unlinkSync(zipPath)
                    }
                }
            
                //read the publishedToRemote property of the manifest.json from the snapshot
            if((JSON.parse(fs.readFileSync(`.jpar/snapshots/${argv.snapshot}/snapshot.json`,'utf-8')).publishedToRemote)){
                console.log(chalk.red(`Snapshot ${argv.snapshot} already published`));
            } else{
                console.log(chalk.green(`Snapshot ${argv.snapshot} published to ${fs.readFileSync('.jpar/refs/remote/server', 'utf8')}`));
            }
        
        
            
       

    } else {
        console.error(chalk.red('.jpar repository not found'))
    }

}

