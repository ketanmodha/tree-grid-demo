const fs = require('fs');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

const dbJson = require('../data');
const helper = require('../utils/helper.js');

const getColumns = () => {
    return new Promise((resolve, reject) => {
        try {
            const columnsDb = dbJson.getColumns();
            resolve(columnsDb);
        } catch (error) {
            reject(error);
        }
    });
}

const getColumn = (id) => {
    return new Promise((resolve, reject) => {
        let columnsDb = dbJson.getColumns();
        helper.mustBeInArray(columnsDb, id)
            .then(post => resolve(post))
            .catch(err => reject(err))
    })
}

const columnHalValidInsetData = (data) => {
    const columns = ["title", "dataType", "defaultValue", "alignment", "backgroundColor", "textColor", "fontSize", "isSorted", "sortDirection", "isHidden", "isFreezed"];

    const columnCount = Object.keys(data).length;

    const hasAllKeys = columns.every(item => data.hasOwnProperty(item));

    if (hasAllKeys === false) {
        return { valid: false, message: "Missing column fields" };
    }
    else if (columnCount != columns.length) {
        return { valid: false, message: "Column fields count does not match" };
    } else {
        if (!helper.dataTypes.includes(data.dataType)) {
            return { valid: false, message: "Data type value is invalid" };
        } else if (!helper.alignments.includes(data.alignment)) {
            return { valid: false, message: "Alignment value is invalid" };
        } else if (!helper.sortDirections.includes(data.sortDirection) && data.sortDirection != false && data.sortDirection != null) {
            return { valid: false, message: "Sort direction value is invalid" };
        } else {
            return { valid: true, message: "" };
        }
    }
}

const insertColumn = (newcolumn) => {
    return new Promise((resolve, reject) => {

        const checkData = columnHalValidInsetData(newcolumn);

        if (checkData.valid === false) {
            reject({ message: checkData.message });
        } else {

            let columnsDb = dbJson.getColumns();
            const dateCreateUpdate = {
                createdAt: helper.getNewDate(),
                updatedAt: helper.getNewDate(),
            }
            newcolumn = {
                id: uuidv4(),
                ...newcolumn,
                ...dateCreateUpdate
            };
            columnsDb.push(newcolumn);

            try {
                dbJson.writeData("COLUMNS", columnsDb);
                resolve(newcolumn);
            } catch (error) {
                reject(error);
            }
        }
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

const updateColumn = (id, newcolumn) => {
    return new Promise((resolve, reject) => {
        let columnsDb = dbJson.getColumns();
        let postsDb = dbJson.getPosts();
        helper.mustBeInArray(columnsDb, id)
            .then(post => {

                const checkData = columnHalValidInsetData(newcolumn);

                if (checkData.valid === false) {
                    reject({ message: checkData.message });
                } else {

                    const index = columnsDb.findIndex(p => p.id == post.id);
                    const dateCreateUpdate = {
                        updatedAt: helper.getNewDate(),
                    }

                    const defaultValue = newcolumn.defaultValue;
                    const newDataType = newcolumn.dataType;
                    const prevDataType = columnsDb[index].dataType;

                    if (prevDataType != newDataType) {
                        postsDb = postsDb.map(post => {
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

                    columnsDb[index] = { ...columnsDb[index], ...newcolumn, ...dateCreateUpdate };

                    try {
                        dbJson.writeData("COLUMNS", columnsDb);

                        if (prevDataType != newDataType) {
                            dbJson.writeData("POSTS", postsDb);
                        }

                        resolve(columnsDb[index]);
                    } catch (error) {
                        reject(error);
                    }
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

const deleteColumn = (id) => {
    return new Promise((resolve, reject) => {
        let columnsDb = dbJson.getColumns();
        let postsDb = dbJson.getPosts();
        helper.mustBeInArray(columnsDb, id)
            .then(() => {
                columnsDb = columnsDb.filter(p => p.id !== id);

                postsDb.map(item => {
                    delete item[id];
                    return item;
                })

                try {
                    dbJson.writeData("COLUMNS", columnsDb);
                    dbJson.writeData("POSTS", postsDb);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            })
            .catch(err => reject(err));
    })
}

const visibleColumns = (columnsVisible) => {
    return new Promise((resolve, reject) => {
        let columnsDb = dbJson.getColumns();
        if (columnsVisible.length == 0) {
            reject({ message: "No columns given to set visibility" });
        } else {
            columnsVisible.map(column => {
                const columnFound = columnsDb.find(i => i.id === column.columnId);
                columnFound.isHidden = column.isHidden;
                columnFound.updatedAt = helper.getNewDate();
            })

            try {
                dbJson.writeData("COLUMNS", columnsDb);
                resolve(true);
            } catch (err) {
                reject(err);
            }
        }
    })
}

const freezeColumn = (column) => {
    return new Promise((resolve, reject) => {
        let columnsDb = dbJson.getColumns();
        const columnFound = columnsDb.find(i => i.id === column.columnId);
        if (!columnFound) {
            reject({ message: "Column id does not found" });
        } else {
            columnFound.isFreezed = column.freeze;
            columnFound.updatedAt = helper.getNewDate();

            try {
                dbJson.writeData("COLUMNS", columnsDb);
                resolve(true);
            } catch (err) {
                reject(err);
            }
        }
    })
}

const sortingColumns = (columnsSorting) => {
    return new Promise((resolve, reject) => {
        let columnsDb = dbJson.getColumns();

        if (columnsSorting.length == 0) {
            reject({ message: "No columns given to sort" });
        } else {
            columnsSorting.map(column => {
                const columnFound = columnsDb.find(i => i.id === column.columnId);
                columnFound.isSorted = column.isSorted;
                columnFound.sortDirection = column.isSorted ? column.sortOrder : null;
                columnFound.updatedAt = helper.getNewDate();
            })

            try {
                dbJson.writeData("COLUMNS", columnsDb);
                resolve(true);
            } catch (err) {
                reject(err);
            }
        }
    })
}

const sequencingColumns = (columnIds) => {
    return new Promise((resolve, reject) => {
        let columnsDb = dbJson.getColumns();
        if (columnIds.length == 0) {
            reject({ message: "No columns given to set sequence/order" });
        } else {
            columnsDb.map(column => {
                const columnIndex = columnIds.findIndex(id => id === column.id);

                if (columnIndex >= 0) {
                    column.sequence = columnIndex + 1;
                    column.updatedAt = helper.getNewDate();
                } else {
                    column.sequence = 99;
                    column.updatedAt = helper.getNewDate();
                }
                return column;
            })

            try {
                dbJson.writeData("COLUMNS", columnsDb);
                resolve(true);
            } catch (err) {
                reject(err);
            }
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
    sequencingColumns,
}
