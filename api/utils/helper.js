const moment = require('moment');
const fs = require('fs');

const dataTypes = ["TEXT", "NUMBER", "DATE", "BOOLEAN"];
const alignments = ["LEFT", "CENTER", "RIGHT", "JUSTIFY"];
const sortDirections = ["ASC", "DESC"];

const getNewDate = (value = null) => {
    if (value) {
        return moment(value, ["YYYY/MM/DD", moment.ISO_8601]).format();
    } else {
        // return new Date().toString();
        return moment().format();
    }
}

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

const mustBeInArray = (array, id) => {
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

module.exports = {
    dataTypes,
    alignments,
    sortDirections,

    getNewId,
    getNewDate,
    mustBeInArray,
};
