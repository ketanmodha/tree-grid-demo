const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const dbJson = require('../data');
const helper = require('../utils/helper.js');

const getPosts = () => {
    return new Promise((resolve, reject) => {
        try {
            const postsDb = dbJson.getPosts();
            resolve(postsDb);
        } catch (error) {
            reject(error);
        }
    });
}

const getPost = (id) => {
    return new Promise((resolve, reject) => {
        let postsDb = dbJson.getPosts();
        helper.mustBeInArray(postsDb, id)
            .then(post => resolve(post))
            .catch(err => reject(err))
    })
}

const insertPost = (newPost) => {

    const refColumnId = newPost.refColumnId;
    const isChild = newPost.isChild;
    let columnDataToAdd = newPost.columnDataToAdd;

    return new Promise((resolve, reject) => {
        let postsDb = dbJson.getPosts();

        // Add empty childrens if do not have childrens
        columnDataToAdd = columnDataToAdd.map(i => {
            i.id = i.id ? i.id : uuidv4();
            i.createdAt = helper.getNewDate();
            i.updatedAt = helper.getNewDate();
            if (!i.childrens) {
                i.childrens = [];
            } else {
                formatInsertChildren(i);
            }
            return i;
        });

        // No reference Id found - Then add to bottom of array - This can occurs if not data is added , i.e. First Item
        // First Post
        if (!refColumnId) {
            postsDb = postsDb.concat(columnDataToAdd);
        } else if (isChild === false) {
            // Add Next
            // Chech if id exist in the parent hierarchy
            const rootIndexFound = postsDb.findIndex(item => item.id === refColumnId);

            if (rootIndexFound != -1) {
                // ID matches in parent hierarchy
                let j = 1;
                columnDataToAdd.map(item => {
                    postsDb.splice(rootIndexFound + j, 0, item);
                    j++;
                })
            } else {
                // Check in children recursively for matching id
                postsDb.map(item => {
                    mapChildrens(item, refColumnId, columnDataToAdd);
                })
            }
        } else {
            // Add as children
            postsDb = addAsChildren(postsDb, refColumnId, columnDataToAdd);
        }

        try {
            dbJson.writeData("POSTS", postsDb);
            resolve(columnDataToAdd);
        } catch (error) {
            reject(error);
        }
    })
}

const updatePost = (id, updateData) => {
    return new Promise((resolve, reject) => {
        let postsDb = dbJson.getPosts();
        postsDb = postsDb.map(post => {
            let newPost = post;
            if (post.id == id) {
                newPost = {
                    ...post,
                    ...updateData,
                    childrens: post.childrens ? [...post.childrens] : [],
                    updatedAt: helper.getNewDate()
                }

                return newPost;
            } else {
                newPost.childrens = updateChildrens(post.childrens, id, updateData);
                return newPost;
            }

        })

        try {
            dbJson.writeData("POSTS", postsDb);
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

const deletePosts = (postIds) => {
    return new Promise((resolve, reject) => {
        let postsDb = dbJson.getPosts();
        postsDb = postsDb.filter(p => {
            if (p.childrens) {
                p.childrens = deleteChildrens(p.childrens, postIds)
            }
            if (!postIds.includes(p.id)) {
                return true;
            } else {
                return false;
            }
        });

        try {
            dbJson.writeData("POSTS", postsDb)
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

// Add as childern to posts
const addAsChildren = (array, id, object) => array && array.map(o => o.id == id
    ? { ...o, childrens: o.childrens && o.childrens.length > 0 ? [...o.childrens.concat(object)] : object }
    : { ...o, childrens: addAsChildren(o.childrens, id, object) }
);

// Mapping childerns
const mapChildrens = (data, refColumnId, columnDataToAdd) => {
    let rootIndexFound = -1;
    if (data.childrens) {
        rootIndexFound = data.childrens.findIndex(item => item.id === refColumnId);
        if (rootIndexFound == -1) {
            data.childrens.map(item => {
                mapChildrens(item, refColumnId, columnDataToAdd);
            })
        }
    }
    if (rootIndexFound != -1) {
        let j = 1;
        columnDataToAdd.map(item => {
            data.childrens.splice(rootIndexFound + j, 0, item);
            j++;
        })
    }
};

// Format insert childerns
const formatInsertChildren = (data) => {
    data.id = data.id ? data.id : uuidv4();
    data.createdAt = helper.getNewDate();
    data.updatedAt = helper.getNewDate();
    if (data.childrens) {
        data.childrens.map(item => {
            formatInsertChildren(item);
        })
    }
};

// Update childerns
const updateChildrens = (childrens, id, updateData) => {
    if (childrens) {
        childrens = childrens.map(post => {
            let newPost = post;
            if (post.id == id) {
                newPost = {
                    ...post,
                    ...updateData,
                    childrens: post.childrens ? [...post.childrens] : [],
                    updatedAt: helper.getNewDate()
                }

                return newPost;
            } else {
                newPost.childrens = updateChildrens(post.childrens, id, updateData);
                return newPost;
            }
        })
    }
    return childrens;
};

const deleteChildrens = (childrens, postIds) => {
    if (childrens) {
        childrens = childrens.filter(p => {
            if (p.childrens) {
                p.childrens = deleteChildrens(p.childrens, postIds)
            }
            if (!postIds.includes(p.id)) {
                return true;
            } else {
                return false;
            }
        });
    }
    return childrens;
};

module.exports = {
    insertPost,
    getPosts,
    getPost,
    updatePost,
    deletePosts
}
