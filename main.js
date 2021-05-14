const prompts = require('prompts');
const fs = require('fs')
const Utils = require('./utils');
require('colors')
const Questions = [
    {
        type: 'text',
        name: 'folderpath',
        message: `Where would you like to install? (Default: ${require('os').homedir()}\\Desktop)`,
    },
    {
        type: 'text',
        name: 'foldername',
        message: 'What will be the folder name? (Default: FXServer)',
    }
]

const Start = async () => {
    const x = await prompts(Questions);
    let folderpath = x.folderpath
    if (folderpath === "") {
        folderpath = `${require('os').homedir()}\\Desktop`
    }
    let foldername = x.foldername
    if (foldername == "") {
        foldername = "FXServer"
    }
    const CombinedPath = `${folderpath}\\${foldername}`
    if (fs.existsSync(CombinedPath))
        return console.log(`Folder ${foldername} already exists in ${folderpath}`.red);

    const BinFolder = `${CombinedPath}\\bin`
    const ResourceFolder = `${CombinedPath}\\server`

    fs.mkdirSync(BinFolder, { recursive: true })
    fs.mkdirSync(ResourceFolder, { recursive: true })
    await Utils.SetupResources(ResourceFolder)
    await Utils.SetupBin(BinFolder)
    console.log('Dont forget to edit the server.cfg file!'.red)
}


Start()