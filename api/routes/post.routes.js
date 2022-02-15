const express = require('express');
const post = require('../models/post.model');

const router = express.Router();

/* Get all posts */
router.get('/', async (req, res) => {
    await post.getPosts()
        .then(posts => res.json(posts))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({ message: err.message })
            } else {
                res.status(500).json({ message: err.message })
            }
        })
})

/* Get post by id */
router.get('/:id', async (req, res) => {
    const id = req.params.id

    await post.getPost(id)
        .then(post => res.json(post))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({ message: err.message })
            } else {
                res.status(500).json({ message: err.message })
            }
        })
})

/* Insert a new post */
/**
 * Body:
 * {
 *      refColumnId: "",
 *      isChild: false,
 *      columnDataToAdd: [{
 *          "796f1f4f-8683-4dc9-8de8-9fbe5adc4f81" : 1,
 *          "796f1f4f-8683-4dc9-8de8-9fbe5adc4f82" : "Task One",
 *          "796f1f4f-8683-4dc9-8de8-9fbe5adc4f83" : "2022/02/14", -- YYYY/MM/DD
 *          "796f1f4f-8683-4dc9-8de8-9fbe5adc4f84" : "5",
 *          "796f1f4f-8683-4dc9-8de8-9fbe5adc4f85" : "ACTIVE",
 *          "796f1f4f-8683-4dc9-8de8-9fbe5adc4f86" : false,
 *          childrens: []
 *      }]
 * }
 */
router.post('/', async (req, res) => {
    await post.insertPost(req.body)
        .then(post => res.status(201).json({
            message: `The posts has been updated`,
            content: post
        }))
        .catch(err => res.status(500).json({ message: err.message }))
})

/**
 * Update a post
 * Body:
 * {
 *      "796f1f4f-8683-4dc9-8de8-9fbe5adc4f81" : 1,
 *      "796f1f4f-8683-4dc9-8de8-9fbe5adc4f82" : "Task One",
 *      "796f1f4f-8683-4dc9-8de8-9fbe5adc4f83" : "2022/02/14", -- YYYY/MM/DD
 *      "796f1f4f-8683-4dc9-8de8-9fbe5adc4f84" : "5",
 *      "796f1f4f-8683-4dc9-8de8-9fbe5adc4f85" : "ACTIVE",
 *      "796f1f4f-8683-4dc9-8de8-9fbe5adc4f86" : false,
 * }
 */
router.put('/:id', async (req, res) => {
    const id = req.params.id

    await post.updatePost(id, req.body)
        .then(post => res.json({
            message: `The post #${id} has been updated`,
            content: post
        }))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({ message: err.message })
            }
            res.status(500).json({ message: err.message })
        })
})

/* Delete Posts */
/**
 * Body:
 * [ "796f1f4f-8683-4dc9-8de8-9fbe5adc4f81", "796f1f4f-8683-4dc9-8de8-9fbe5adc4f82" ]
 */
router.delete('/', async (req, res) => {
    await post.deletePosts(req.body)
        .then(() => res.json({
            message: `The posts has been deleted`
        }))
        .catch(err => {
            console.log("err");
            if (err.status == 404) {
                res.status(err.status).json({ message: err.message })
            } else {
                res.status(500).json({ message: err.message })
            }

        })
})

/* Drag and Drop post to another place */
/**
 * Body:
 * {
 *      refColumnId: "796f1f4f-8683-4dc9-8de8-9fbe5adc4f81",
 *      isChild: true,
 *      columnDataToAdd: [{
 *          "id" : "1",
 *          "796f1f4f-8683-4dc9-8de8-9fbe5adc4f81" : 1,
 *          "796f1f4f-8683-4dc9-8de8-9fbe5adc4f82" : "Task One",
 *          "796f1f4f-8683-4dc9-8de8-9fbe5adc4f83" : "2022/02/14", -- YYYY/MM/DD
 *          "796f1f4f-8683-4dc9-8de8-9fbe5adc4f84" : "5",
 *          "796f1f4f-8683-4dc9-8de8-9fbe5adc4f85" : "ACTIVE",
 *          "796f1f4f-8683-4dc9-8de8-9fbe5adc4f86" : false,
 *          childrens: []
 *      }]
 * }
 */
router.post('/drag-drop', async (req, res) => {

    const dragPostId = req.body.columnDataToAdd[0].id;

    await post.deletePosts([dragPostId])
        .then(async () => {
            await post.insertPost(req.body)
                .then(post => res.status(201).json({
                    message: `The posts has been updated`,
                    content: post
                }))
                .catch(err => res.status(500).json({ message: err.message }))
        })
        .catch(err => {
            console.log("err");
            if (err.status == 404) {
                res.status(err.status).json({ message: err.message })
            } else {
                res.status(500).json({ message: err.message })
            }

        })
})

module.exports = router