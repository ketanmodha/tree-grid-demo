const fs = require('fs');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

const helper = require('../helpers/helper.js');

let columns = require('../data/columns.json');
let posts = require('../data/posts.json');

const dataPathColumns = './data/columns.json';
const dataPathPosts = './data/posts.json';

function getColumns() {
    return new Promise((resolve, reject) => {
        try {
            const columns = fs.readFileSync(dataPathColumns);
            resolve(JSON.parse(columns));
        } catch (error) {
            reject(error);
        }
    });
}

function getColumn(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(columns, id)
            .then(post => resolve(post))
            .catch(err => reject(err))
    })
}

function insertColumn(newcolumn) {
    return new Promise((resolve, reject) => {
        const dateCreateUpdate = {
            createdAt: helper.getNewDate(),
            updatedAt: helper.getNewDate(),
        }
        newcolumn = {
            id: uuidv4(),
            ...newcolumn,
            ...dateCreateUpdate
        };
        columns.push(newcolumn);
        helper.writeJSONFile(dataPathColumns, columns);
        resolve(newcolumn);
    })
}

const parseDataToDIfferentFormat = (value, newDataType, prevDataType, defaultValue) => {

    if (newDataType == 'TEXT') {
        return String(value);
    } else if (newDataType == 'NUMBER') {
        if (prevDataType == "TEXT") {
            return parseInt(value);
        } else {
            return defaultValue;
        }
    } else if (newDataType == 'BOOLEAN') {
        return defaultValue;
    } else if (newDataType == 'DATE') {
        if (moment(value, ["YYYY/MM/DD", moment.ISO_8601]).isValid()) {
            return helper.getNewDate(value);
        } else {
            return defaultValue;
        }
    } else {
        return value;
    }
}

function updateColumn(id, newcolumn) {
    return new Promise((resolve, reject) => {

        helper.mustBeInArray(columns, id)
            .then(post => {
                const index = columns.findIndex(p => p.id == post.id);
                const dateCreateUpdate = {
                    updatedAt: helper.getNewDate(),
                }

                const defaultValue = newcolumn.defaultValue;
                const newDataType = newcolumn.dataType;
                const prevDataType = columns[index].dataType;

                if (prevDataType != newDataType) {
                    posts = posts.map(post => {
                        const formatedValue = parseDataToDIfferentFormat(post[id], newDataType, prevDataType, defaultValue);

                        let newPost = {
                            ...post,
                            [`${id}`]: formatedValue,
                            childrens: post.childrens ? [...post.childrens] : [],
                            updatedAt: helper.getNewDate()
                        }

                        newPost.childrens = updateChildrens(post.childrens, id, newDataType, prevDataType, defaultValue);
                        return newPost;
                    });
                }

                columns[index] = { ...columns[index], ...newcolumn, ...dateCreateUpdate };

                try {
                    helper.writeJSONFile(dataPathColumns, columns);

                    if (prevDataType != newDataType) {
                        helper.writeJSONFile(dataPathPosts, posts);
                    }

                    resolve(columns[index]);
                } catch (error) {
                    reject(error);
                }
            })
            .catch(err => {
                reject(err);
            })
    })
}

// Update childerns
const updateChildrens = (childrens, id, newDataType, prevDataType, defaultValue) => {
    if (childrens) {
        childrens = childrens.map(post => {
            const formatedValue = parseDataToDIfferentFormat(post[id], newDataType, prevDataType, defaultValue);
            let newPost = {
                ...post,
                [`${id}`]: formatedValue,
                childrens: post.childrens ? [...post.childrens] : [],
                updatedAt: helper.getNewDate()
            }

            newPost.childrens = updateChildrens(post.childrens, id, newDataType, prevDataType, defaultValue);
            return newPost;
        })
    }
    return childrens;
};

function deleteColumn(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(columns, id)
            .then(() => {
                columns = columns.filter(p => p.id !== id);

                posts.map(item => {
                    delete item[id];
                    return item;
                })

                try {
                    helper.writeJSONFile(dataPathColumns, columns);
                    helper.writeJSONFile(dataPathPosts, posts);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            })
            .catch(err => reject(err));
    })
}

function visibleColumns(columnsVisible) {

    return new Promise((resolve, reject) => {
        if (columnsVisible.length > 0) {
            columnsVisible.map(column => {
                const columnFound = columns.find(i => i.id === column.columnId);
                columnFound.isHidden = column.isHidden;
                columnFound.updatedAt = helper.getNewDate();
            })
        }

        try {
            helper.writeJSONFile(dataPathColumns, columns);
            resolve(true);
        } catch (err) {
            reject(err);
        }
    })
}

function freezeColumn(column) {

    return new Promise((resolve, reject) => {

        const columnFound = columns.find(i => i.id === column.columnId);
        columnFound.isFreezed = column.freeze;
        columnFound.updatedAt = helper.getNewDate();

        try {
            helper.writeJSONFile(dataPathColumns, columns);
            resolve(true);
        } catch (err) {
            reject(err);
        }
    })
}

function sortingColumns(columnsSorting) {

    return new Promise((resolve, reject) => {
        if (columnsSorting.length > 0) {
            columnsSorting.map(column => {
                const columnFound = columns.find(i => i.id === column.columnId);
                columnFound.isSorted = column.isSorted;
                columnFound.sortDirection = column.isSorted ? column.sortOrder : null;
                columnFound.updatedAt = helper.getNewDate();
            })
        }

        try {
            helper.writeJSONFile(dataPathColumns, columns);
            resolve(true);
        } catch (err) {
            reject(err);
        }
    })
}

module.exports = {
    insertColumn,
    getColumns,
    getColumn,
    updateColumn,
    deleteColumn,

    visibleColumns,
    freezeColumn,
    sortingColumns,
}
