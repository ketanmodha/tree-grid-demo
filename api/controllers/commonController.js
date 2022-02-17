const helper = require('../utils/helper.js');

const getDataTypes = () => {
    return helper.dataTypes;
};

const getAlignments = () => {
    return helper.alignments;
};

const getSortDirections = () => {
    return helper.sortDirections;
};

module.exports = {
    getDataTypes,
    getAlignments,
    getSortDirections,
};
