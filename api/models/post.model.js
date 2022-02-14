const { promise } = require('protractor')
const { hasOwnProperty } = require('tslint/lib/utils')
let posts = require('../data/posts.json')
const filename = './data/posts.json'
const helper = require('../helpers/helper.js')

function getPosts() {
    return new Promise((resolve, reject) => {
        if (posts.length === 0) {
            reject({
                message: 'no posts available',
                status: 202
            })
        }

        resolve(posts)
    })
}

function getPost(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(posts, id)
        .then(post => resolve(post))
        .catch(err => reject(err))
    })
}
function insertPost(newPost) {
    return new Promise((resolve, reject) => {
        const id = { id: helper.getNewId(posts) }
        const date = { 
            createdAt: helper.newDate(),
            updatedAt: helper.newDate()
        } 
        newPost = { ...id, ...date, ...newPost }
        posts.push(newPost)
        helper.writeJSONFile(filename, posts)
        resolve(newPost)
    })
}
// function insertPost(newPost) {
//     return new Promise((resolve, reject) => {
//         const id = { id: helper.getNewId(posts,newPost) }
//         console.log("id",id);
//         var tmp_id = 1;
//         if(newPost.hasOwnProperty('subtasks')){
//             newPost.subtasks.forEach(element => {
//                 element.id =  parseInt(tmp_id) + parseInt(id.id);
//                 tmp_id++;
//             });
//         }
//         const date = { 
//             createdAt: helper.newDate(),
//             updatedAt: helper.newDate()
//         } 
//         newPost = { ...id, ...date, ...newPost }
//         console.log("newPost---->",newPost);
//         posts.push(newPost)
//         helper.writeJSONFile(filename, posts)
//         resolve(newPost)
//     })
// }


// function insertPost(newPost) {
//     return new Promise((resolve, reject) => {
//         const id = { id: helper.getNewId(posts) }
//         console.log("id",id);
//         let taskId = {...id}
//         if(newPost.hasOwnProperty("subtasks") && newPost.subtasks.length > 0){
//             new Promise((resolve, reject) => {
//                  newPost.subtasks.forEach(element => {
//                     taskId.id = element.id = parseInt(taskId.id) + 1;
//                 });
//                 resolve(newPost);
//             }).then((data) => {
//                 console.log("data",data);
//                 const date = { 
//                     createdAt: helper.newDate(),
//                     updatedAt: helper.newDate()
//                 } 
//                 data = { ...id, ...date, ...data }
//                 posts.push(data)
//                 helper.writeJSONFile(filename, posts)
//                 resolve(data)
//             });
//         }
//         return false;
        
//     })
// }

function updatePost(id, newPost) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(posts, id)
        .then(post => {
            const index = posts.findIndex(p => p.id == post.id)
            id = { id: post.id }
            const date = {
                createdAt: post.createdAt,
                updatedAt: helper.newDate()
            } 
            posts[index] = { ...id, ...date, ...newPost }
            helper.writeJSONFile(filename, posts)
            resolve(posts[index])
        })
        .catch(err => reject(err))
    })
}

function deletePost(id) {
    var id = parseInt(id);
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(posts, id)
        .then(() => {
            posts = posts.filter(p => p.id !== id)
            helper.writeJSONFile(filename, posts)
            resolve()
        })
        .catch(err => reject(err))
    })
}

module.exports = {
    insertPost,
    getPosts,
    getPost, 
    updatePost,
    deletePost
}