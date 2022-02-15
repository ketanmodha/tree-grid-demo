const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const helper = require('../helpers/helper.js');

let columns = require('../data/columns.json');
let posts = require('../data/posts.json');

const filename = './data/columns.json';
const filename_posts = './data/posts.json';

function getColumns() {
    return new Promise((resolve, reject) => {
        if (columns.length === 0) {
            reject({
                message: 'no columns available',
                status: 202
            });
        }
        resolve(columns);
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
        // const id = { id: uuidv4() }
        const dateCreateUpdate = {
            createdAt: helper.newDate(),
            updatedAt: helper.newDate()
        }
        newcolumn = {
            id: uuidv4(),
            ...newcolumn,
            ...dateCreateUpdate
        };
        columns.push(newcolumn);
        helper.writeJSONFile(filename, columns);
        resolve(newcolumn);
    })
}

function runRecursive(input, columnTitle, columnDatatype) {
    return new Promise((resolve, reject) => {
        input.forEach(element => {
            if (columnDatatype == 'TEXT') {
                element[columnTitle] = String(element[columnTitle]);
            }
            if (columnDatatype == 'NUMBER') {
                element[columnTitle] = parseInt(element[columnTitle]);
            }
            if (columnDatatype == 'BOOLEAN') {
                element[columnTitle] = Boolean(element[columnTitle]);
            }
            if (columnDatatype == 'DATE') {
                if (moment(element[columnTitle]).isValid()) {
                    element[columnTitle] = new Date(element[columnTitle]);
                } else {
                    element[columnTitle] = new Date();
                }
            }
            if (element.hasOwnProperty('subtasks')) {
                let data = element.subtasks;
                return runRecursive(data, columnTitle, columnDatatype);
            }
        });
        resolve(input);
    });
}

function updateColumn(id, newcolumn) {
    return new Promise((resolve, reject) => {

        helper.mustBeInArray(columns, id)
            .then(post => {
                const index = columns.findIndex(p => p.id == post.id)
                id = { id: post.id }
                const dateCreateUpdate = {
                    createdAt: post.createdAt,
                    updatedAt: helper.newDate()
                }

                if (columns[index].dataType != newcolumn.dataType) {

                    // TODO : Verify logics to update existing date
                    new Promise((resolve, reject) => {
                        posts.forEach(element => {
                            if (newcolumn.dataType == 'TEXT') {
                                element[newcolumn.title] = String(element[newcolumn.title])
                                if (element['subtasks'].length > 0) {
                                    runRecursive(element['subtasks'], newcolumn.title, newcolumn.dataType).then((f_data) => {
                                        resolve(posts);
                                    });
                                };
                            }
                            if (newcolumn.dataType == 'NUMBER') {
                                element[newcolumn.title] = parseInt(element[newcolumn.title])
                                if (element['subtasks'].length > 0) {
                                    runRecursive(element['subtasks'], newcolumn.title, newcolumn.dataType).then((f_data) => {
                                        resolve(posts);
                                    });
                                };
                            }
                            if (newcolumn.dataType == 'DATE') {
                                if (moment(element[newcolumn.title]).isValid()) {
                                    element[newcolumn.title] = new Date(element[newcolumn.title])
                                } else {
                                    element[newcolumn.title] = new Date();
                                }
                                if (element['subtasks'].length > 0) {
                                    runRecursive(element['subtasks'], newcolumn.title, newcolumn.dataType).then((f_data) => {
                                        resolve(posts);
                                    });
                                };
                            }
                            if (newcolumn.dataType == 'BOOLEAN') {
                                element[newcolumn.title] = Boolean(element[newcolumn.title])
                                if (element['subtasks'].length > 0) {
                                    runRecursive(element['subtasks'], newcolumn.title, newcolumn.dataType).then((f_data) => {
                                        resolve(posts);
                                    });
                                };
                            }
                        });

                    }).then((data) => {
                        console.log("POSTs are updated");
                        helper.writeJSONFile(filename_posts, data)
                    }).catch(err => {
                        console.log("ERR::", err)
                    });
                }

                columns[index] = { ...id, ...newcolumn, ...dateCreateUpdate }
                helper.writeJSONFile(filename, columns)

                resolve(columns[index]);
            })
            .catch(err => {
                reject(err);
            })
    })
}

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
                    helper.writeJSONFile(filename, columns);
                    helper.writeJSONFile(filename_posts, posts);
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
                columnFound.updatedAt = helper.newDate();
            })
        }

        try {
            helper.writeJSONFile(filename, columns);
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
        columnFound.updatedAt = helper.newDate();

        try {
            helper.writeJSONFile(filename, columns);
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
                columnFound.updatedAt = helper.newDate();
            })
        }

        try {
            helper.writeJSONFile(filename, columns);
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
