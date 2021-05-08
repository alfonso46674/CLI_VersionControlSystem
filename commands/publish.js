const request = require('request')
const AdmZip = require('adm-zip')
const fs = require('fs-extra')
const chalk = require('chalk');

const filesFunctions = require('../helpers/files')

module.exports.description = 'Publish snapshots to remote server';
module.exports.command = function (yargs) {


    if (filesFunctions.directoryExists('.jpar')) {
        let publishCounter = 0; //to keep count how many snapshots are published

        let files = fs.readdirSync('.jpar/snapshots/')
        if (files.length == 0) {
            console.log(chalk.yellow('No snapshots available'));
        } else {
            
            //iterate through all the available snapshots
            for (let i in files) {
                if (fs.existsSync(`.jpar/snapshots/${files[i]}/snapshot.json`)) {
                    //read the snapshot.json of each snapshot folder
                    let snapshotManifest = JSON.parse(fs.readFileSync(`.jpar/snapshots/${files[i]}/snapshot.json`,'utf-8'))
                    //if the snapshot has not been published, do it by a POST http request to the remote server
                    if(!snapshotManifest.publishedToRemote){
                        //increment counter
                        publishCounter+=1

                    //first do a zip of the snapshot, so it can be sent in one file
                        let zip = new AdmZip()
                        //Zip the current snapshot folder in the loop
                        zip.addLocalFolder(`.jpar/snapshots/${files[i]}`)
                        //save the zip in .jpar/temp and with the same name as the snapshot
                        let zipPath = `.jpar/temp/${files[i]}.zip`
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
                            "snapshot_data": fs.createReadStream(zipPath)
                        }
                        };

                        //do the post request
                        request(options,function(err,res,body){
                            if(err || res.statusCode == 400) {
                                console.error(chalk.red(`Error while publishing snapshot: ${files[i]}`))
                            }else{
                                // console.log(body);
                                //set the publishedToRemote property to true
                                snapshotManifest.publishedToRemote = true
                                //rewrite the snapshot.json manifest
                                fs.writeFileSync(`.jpar/snapshots/${files[i]}/snapshot.json`,JSON.stringify(snapshotManifest))
                            }
                        })

                       //remove zip from .jpar/temp
                       fs.unlinkSync(zipPath)
                    }
                }
            }

            if(publishCounter == 0){
                console.log('Nothing to publish; Everything is up to date');
            } else{
                console.log(`Published ${publishCounter} snapshots to ${fs.readFileSync('.jpar/refs/remote/server', 'utf8')}`);
            }
        }
        
            
       

    } else {
        console.error(chalk.red('.jpar repository not found'))
    }

}

