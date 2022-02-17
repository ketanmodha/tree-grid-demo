const fs = require('fs');

const dataPathColumns = './data/columns.json';
const dataPathPosts = './data/posts.json';

const getColumns = () => {
    const data = fs.readFileSync(dataPathColumns);
    return JSON.parse(data);
}

const getPosts = () => {
    const data = fs.readFileSync(dataPathPosts);
    return JSON.parse(data);
}

const writeData = (type, data) => {

    let filename;
    if (type === "COLUMNS") {
        filename = dataPathColumns;
    } else if (type === "POSTS") {
        filename = dataPathPosts;
    }

    if (filename) {
        fs.writeFileSync(filename, JSON.stringify(data), 'utf8', (err) => {
            if (err) {
                console.log(err);
            }
        })
    }
}

module.exports = {
    getColumns,
    getPosts,
    writeData,
}
