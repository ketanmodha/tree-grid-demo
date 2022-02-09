let columns = require('../data/columns.json')
const filename = './data/columns.json'
const helper = require('../helpers/helper.js')

function getcolumns() {
    return new Promise((resolve, reject) => {
        if (columns.length === 0) {
            reject({
                message: 'no columns available',
                status: 202
            })
        }

        resolve(columns)
    })
}

function getcolumn(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(columns, id)
        .then(post => resolve(post))
        .catch(err => reject(err))
    })
}

function insertcolumn(newcolumn) {
    return new Promise((resolve, reject) => {
        const id = { id: helper.getNewId(columns) }
        const date = { 
            createdAt: helper.newDate(),
            updatedAt: helper.newDate()
        } 
        newcolumn = { ...id, ...date, ...newcolumn }
        columns.push(newcolumn)
        helper.writeJSONFile(filename, columns)
        resolve(newcolumn)
    })
}

function updatecolumn(id, newcolumn) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(columns, id)
        .then(post => {
            const index = columns.findIndex(p => p.id == post.id)
            id = { id: post.id }
            const date = {
                createdAt: post.createdAt,
                updatedAt: helper.newDate()
            } 
            columns[index] = { ...id, ...date, ...newcolumn }
            helper.writeJSONFile(filename, columns)
            resolve(columns[index])
        })
        .catch(err => reject(err))
    })
}

function deletecolumn(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(columns, id)
        .then(() => {
            columns = columns.filter(p => p.id !== id)
            helper.writeJSONFile(filename, columns)
            resolve()
        })
        .catch(err => reject(err))
    })
}

module.exports = {
    insertcolumn,
    getcolumns,
    getcolumn, 
    updatecolumn,
    deletecolumn
}