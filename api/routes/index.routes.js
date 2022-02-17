const express = require('express');
const router = express.Router();

const commonRoutes = require('./common.routes');
const postRoutes = require('./post.routes');
const columnRoutes = require('./column.routes');

router.use('/api/v1/common', commonRoutes);
router.use('/api/v1/posts', postRoutes);
router.use('/api/v1/columns', columnRoutes);

module.exports = router;
