const fs = require('fs')
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
    }
}