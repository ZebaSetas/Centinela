const path = require('path')
const fs = require('fs');

const getFolderAndFilename = (globalFilename) => {
    throwErrorIfPathNotExists(globalFilename)
    var array = globalFilename.split(path.sep)
    var name = array.pop()
    var folder = array.pop()
    return `../${folder}/${name}`
}

const getFolderPath = (globalFilename) => {
    throwErrorIfPathNotExists(globalFilename)
    var folders = globalFilename.split(path.sep)
    var folderPath = ''
    for (var posArray = 0; posArray < (folders.length - 2); posArray++) {
        folderPath += folders[posArray] + '/'
    }
    var lastFolder = folders[folders.length - 2]
    folderPath += lastFolder
    return folderPath
}

const throwErrorIfPathNotExists = (filePath) => {
    if (!fileExist(filePath))
        throw new Error('La dirección de archivo ' + filePath + ' no existe')
}

const fileExist = (filePath) => {
    return fs.existsSync(filePath)
}

const createFile = (filePath) => {
    if (!fileExist(filePath)) fs.mkdirSync(filePath)
}

module.exports = {
    getFolderAndFilename,
    getFolderPath,
    fileExist,
    createFile
}