const axios = require('axios');
const clone = require('git-clone');
const cheerio = require('cheerio')
const Downloader = require('nodejs-file-downloader');
const _7z = require('7zip-min');
const fs = require('fs')
const servercfg = require('./servercfgshit')
const DownloadResources = async (folder) => {
    return new Promise(async (resolve, reject) => {
        clone('https://github.com/citizenfx/cfx-server-data.git', folder, () => {
            resolve()
        })
    })
}

const SetupResources = async (folder) => {
    console.log('Downloading Resource Files'.blue)
    await DownloadResources(folder)
    console.log('Download Complete'.blue)
    fs.unlinkSync(`${folder}/README.md`)
    fs.unlinkSync(`${folder}/.gitignore`)
    fs.writeFileSync(`${folder}/start.bat`, `..\\bin\\FXServer.exe +exec server.cfg`)
    fs.writeFileSync(`${folder}/server.cfg`, servercfg.get())
    console.log('Resource setup is complete!'.green)
}

const UnpackBin = (folder) => {
    return new Promise(async(res, rej) => {
        _7z.unpack(`${folder}/server.7z`, `${folder}/`, err => {
            if(err) rej(err);
            fs.unlinkSync(`${folder}/server.7z`)
            res()
        });
    })
}

const DownloadBin = async (folder) => {
    const { data } = await axios.get('https://runtime.fivem.net/artifacts/fivem/build_server_windows/master/')
    const $ = cheerio.load(data);
    const PartialLink = $('body > section > div > nav > div > a.button.is-link.is-primary').attr('href')
    const DownloadLink = `https://runtime.fivem.net/artifacts/fivem/build_server_windows/master${PartialLink.substring(1)}`
    console.log('Downloading Binary Files...'.blue)
    const DL = new Downloader({
        url:DownloadLink,
        directory:folder,
        onProgress: percentage => {
            if(percentage % 2 == 0)
                console.log(`Downloading Binary Files ${percentage}%`.blue)
        }
    })
    await DL.download()
    console.log('Download Complete'.green)
    console.log('Extracting Binary Files...'.blue)
    await UnpackBin(folder).catch(err => {console.log(err); process.exit(-1)})
    console.log('Binary Files Extracted'.green)
}

const SetupBin = async (folder) => {
    await DownloadBin(folder)
}
module.exports.SetupBin = SetupBin
module.exports.SetupResources = SetupResources