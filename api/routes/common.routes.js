const express = require('express');

const commonController = require('../controllers/commonController');

const router = express.Router();
const helper = require('../utils/helper.js');

router.get('/data-types', async (req, res) => {
    res.json(commonController.getDataTypes());
});

router.get('/alignments', async (req, res) => {
    res.json(commonController.getAlignments());
});

router.get('/sort-direction', async (req, res) => {
    res.json(commonController.getSortDirections());
});

module.exports = router;
