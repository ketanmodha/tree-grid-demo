const express = require('express')
const router = express.Router()
const column = require('../models/column.model')
const m = require('../helpers/middlewares')

/* All columns */
router.get('/', async (req, res) => {
    await column.getcolumns()
    .then(columns => res.json(columns))
    .catch(err => {
        if (err.status) {
            res.status(err.status).json({ message: err.message })
        } else {
            res.status(500).json({ message: err.message })
        }
    })
})

/* A column by id */
router.get('/:id', m.mustBeInteger, async (req, res) => {
    const id = req.params.id

    await column.getcolumn(id)
    .then(column => res.json(column))
    .catch(err => {
        if (err.status) {
            res.status(err.status).json({ message: err.message })
        } else {
            res.status(500).json({ message: err.message })
        }
    })
})

/* Insert a new column */
router.post('/',  async (req, res) => {
    await column.insertcolumn(req.body)
    .then(column => res.status(201).json({
        message: `The column #${column.id} has been created`,
        content: column
    }))
    .catch(err => res.status(500).json({ message: err.message }))
})

/* Update a column */
router.put('/:id', m.mustBeInteger,async (req, res) => {
    const id = req.params.id

    await column.updatecolumn(id, req.body)
    .then(column => res.json({
        message: `The column #${id} has been updated`,
        content: column
    }))
    .catch(err => {
        if (err.status) {
            res.status(err.status).json({ message: err.message })
        }
        res.status(500).json({ message: err.message })
    })
})

/* Delete a column */
router.delete('/:id', m.mustBeInteger, async (req, res) => {
    const id = req.params.id

    await column.deletecolumn(id)
    .then(column => res.json({
        message: `The column #${id} has been deleted`
    }))
    .catch(err => {
        if (err.status == 404) {
            res.status(err.status).json({ message: err.message })
        }else{
            res.status(500).json({ message: err.message })
        }
    })
})

module.exports = router