const { json } = require('express/lib/response');
let columns = require('../data/columns.json');
var _ = require('lodash');

function mustBeInteger(req, res, next) {
    const id = req.params.id

    if (!Number.isInteger(parseInt(id))) {
        res.status(400).json({ message: 'ID must be an integer' })
    } else {
        next()
    }
}
function checkFieldsPost(req, res, next) {
    const col = columns.map((col) => {
        return col.title;
    });
    const tmp = Object.keys(req.body).map((item) => {
        return item;
    })
    Promise.all([col, tmp]).then((result) => {
        if (result.length > 0) {
            if (result[0].length > 0 && result[1].length > 0) {
                const _res = _.isEqual(result[0].sort(), result[1].sort());
                console.log("_res 1", _res);
                if (_res) {
                    next()
                } else {
                    res.status(400).json({ message: 'fields are not good' })
                }
            }
        }

    })

}

module.exports = {
    mustBeInteger,
    checkFieldsPost
}