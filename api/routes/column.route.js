const express = require('express');
const column = require('../models/column.model');

const router = express.Router();

/* Get all columns */
router.get('/', async (req, res) => {
    await column.getColumns()
        .then(columns => res.json(columns))
        .catch(err => {
            if (err.status) {
                return res.status(err.status).json({ message: err.message });
            } else {
                return res.status(500).json({ message: err.message });
            }
        });
})

/* Get column by id */
router.get('/:id', async (req, res) => {
    const id = req.params.id

    await column.getColumn(id)
        .then(column => res.json(column))
        .catch(err => {
            if (err.status) {
                return res.status(err.status).json({ message: err.message });
            } else {
                return res.status(500).json({ message: err.message });
            }
        });
})

/* Insert a new column */
router.post('/', async (req, res) => {
    await column.insertColumn(req.body)
        .then(column => res.status(201).json({
            message: `The column #${column.id} has been created`,
            content: column
        }))
        .catch(err => res.status(500).json({ message: err.message }));
})

/* Update a column */
router.put('/:id', async (req, res) => {
    const id = req.params.id;

    await column.updateColumn(id, req.body)
        .then(column => res.json({
            message: `The column #${id} has been updated`,
            content: column
        }))
        .catch(err => {
            if (err.status) {
                return res.status(err.status).json({ message: err.message });
            }
            return res.status(500).json({ message: err.message });
        });
})

/* Delete a column */
router.delete('/:id', async (req, res) => {
    const id = req.params.id

    await column.deleteColumn(id)
        .then(() => res.json({
            message: `The column #${id} has been deleted`
        }))
        .catch(err => {
            if (err.status == 404) {
                return res.status(err.status).json({ message: err.message });
            } else {
                return res.status(500).json({ message: err.message });
            }
        });
})


/* Choose column visibility/hidden */
/**
 * body :
 * [
 *     {
 *         columnId: "796f1f4f-8683-4dc9-8de8-9fbe5adc4f84",
 *         isHidden: true
 *     },
 *     {
 *         columnId: "796f1f4f-8683-4dc9-8de8-9fbe5adc4f85",
 *         isHidden: false
 *     }
 * ]
 */

router.post('/visibility', async (req, res) => {

    await column.visibleColumns(req.body)
        .then(() => res.json({
            message: `The column visibility has been updated`,
        }))
        .catch(err => {
            if (err.status) {
                return res.status(err.status).json({ message: err.message });
            }
            return res.status(500).json({ message: err.message });
        });
})


/* Choose column freeze/unfreeze */
/**
 * body :
 * {    columnId: "796f1f4f-8683-4dc9-8de8-9fbe5adc4f85", 
 *      freeze: true [FREEZE], false, [UNFREEZE]
 * }
 */
router.post('/freeze', async (req, res) => {

    await column.freezeColumn(req.body)
        .then(() => res.json({
            message: `The column freeze/unfreeze has been updated`
        }))
        .catch(err => {
            if (err.status) {
                return res.status(err.status).json({ message: err.message });
            }
            return res.status(500).json({ message: err.message });
        });
})

/* Choose column sorting */
/**
 * body :
 * [
 *     {
 *         columnId: "796f1f4f-8683-4dc9-8de8-9fbe5adc4f84",
 *         isSorted: true,
 *         sortOrder: "ASC"
 *     },
 *     {
 *         columnId: "796f1f4f-8683-4dc9-8de8-9fbe5adc4f85",,
 *         isSorted: true,
 *         sortOrder: "DESC"
 *     }
 * ]
 */

router.post('/sorting', async (req, res) => {

    await column.sortingColumns(req.body)
        .then(() => res.json({
            message: `The column sorting has been updated`,
        }))
        .catch(err => {
            if (err.status) {
                return res.status(err.status).json({ message: err.message });
            }
            return res.status(500).json({ message: err.message });
        });
})

module.exports = router