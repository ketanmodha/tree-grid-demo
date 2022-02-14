const { resolve } = require('dns')
const { reject } = require('lodash')
const { promise } = require('protractor')
let columns = require('../data/columns.json')
let posts = require('../data/posts.json')
const filename = './data/columns.json'
const filename_posts = './data/posts.json'
const helper = require('../helpers/helper.js')
const moment = require('moment');

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
function runRecursive(input,columnTitle,columnDatatype) {
    console.log(columnTitle,columnDatatype);
    return new Promise((resolve,reject) => {
        input.forEach(element => {
            if(columnDatatype == 'text'){
                element[columnTitle] = String(element[columnTitle]);
            }
            if(columnDatatype == 'number'){
                element[columnTitle] = parseInt(element[columnTitle]);
            }
            if(columnDatatype == 'Boolean'){
                element[columnTitle] = Boolean(element[columnTitle]);
            }
            if(columnDatatype == 'date'){
                console.log(element[columnTitle],moment(element[columnTitle]).isValid());
                if(moment(element[columnTitle]).isValid()){
                    element[columnTitle] = new Date(element[columnTitle]);
                }else{
                    element[columnTitle] = new Date();
                }
            }
            if(element.hasOwnProperty('subtasks')){
                let data = element.subtasks;
                return runRecursive(data,columnTitle,columnDatatype);
            }
        });
        resolve(input);
    });

    
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
            if(columns[index].Datatype != newcolumn.Datatype){
                new Promise ((resolve,reject) => {
                    posts.forEach(element => {
                        //console.log("element",element[newcolumn.title]);
                        if(newcolumn.Datatype == 'text'){
                            element[newcolumn.title] = String(element[newcolumn.title])
                            if(element['subtasks'].length > 0){
                               runRecursive(element['subtasks'],newcolumn.title,newcolumn.Datatype).then((f_data)=>{
                                    resolve(posts);
                               });
                            };
                        }
                        if(newcolumn.Datatype == 'number'){
                            element[newcolumn.title] = parseInt(element[newcolumn.title])
                            if(element['subtasks'].length > 0){
                               runRecursive(element['subtasks'],newcolumn.title,newcolumn.Datatype).then((f_data)=>{
                                    resolve(posts);
                               });
                            };
                        }
                        if(newcolumn.Datatype == 'date'){
                            //element[newcolumn.title] = moment(element[newcolumn.title]).isValid;
                            //element[newcolumn.title] = new Date(element[newcolumn.title])
                            if(moment(element[newcolumn.title]).isValid()){
                                element[newcolumn.title] = new Date(element[newcolumn.title])
                            }else{
                                element[newcolumn.title] = new Date();
                            }
                            if(element['subtasks'].length > 0){
                               runRecursive(element['subtasks'],newcolumn.title,newcolumn.Datatype).then((f_data)=>{
                                    resolve(posts);
                               });
                            };
                        }
                        if(newcolumn.Datatype == 'Boolean'){
                            element[newcolumn.title] = Boolean(element[newcolumn.title])
                            if(element['subtasks'].length > 0){
                               runRecursive(element['subtasks'],newcolumn.title,newcolumn.Datatype).then((f_data)=>{
                                    resolve(posts);
                               });
                            };
                        }
                    });
                    
                }).then((data)=>{
                    columns[index] = { ...id, ...date, ...newcolumn }
                    console.log("columns",columns);
                    helper.writeJSONFile(filename, columns)
                    helper.writeJSONFile(filename_posts, data)
                });
            }
            resolve(columns[index]);
            // id = { id: post.id }

            // const date = {
            //     createdAt: post.createdAt,
            //     updatedAt: helper.newDate()
            // } 
            // columns[index] = { ...id, ...date, ...newcolumn }
            // helper.writeJSONFile(filename, columns)
            // resolve(columns[index])
        })
        .catch(err => reject(err))
    })
}
function deletecolumn(id) {
    var id = parseInt(id);
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