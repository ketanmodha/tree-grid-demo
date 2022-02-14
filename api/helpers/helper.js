const fs = require('fs');
const newDate = () => new Date().toString();

const getNewId = (array) => {
    if (array.length > 0) {
        if (array[array.length - 1].subtasks.length > 0) {
            let subTask = array[array.length - 1].subtasks;
            return subTask[subTask.length - 1].id + 1;
        } else {
            return array[array.length - 1].id + 1;
        }
    } else {
        return 1
    }
}

function mustBeInArray(array, id) {
    return new Promise((resolve, reject) => {
        const row = array.find(r => r.id == id);
        if (!row) {
            reject({
                message: 'Please use valid ID',
                status: 404
            });
        }
        resolve(row);
    })
}

function writeJSONFile(filename, content) {
    fs.writeFileSync(filename, JSON.stringify(content), 'utf8', (err) => {
        if (err) {
            console.log(err);
        }
    })
}

module.exports = {
    getNewId,
    newDate,
    mustBeInArray,
    writeJSONFile
};
