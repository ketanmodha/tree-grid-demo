# API

## Setup and Running apis

Make sure you have Node and NPM installed both with `node -v && npm -v`.  
Install packages with `npm install`.  
Run server with `npm run dev` for using **Nodemon**.

If you use a Node version ≤ 8.2.1, you will need to add the " - harmony" flag for using spread operator in the package.json file.

`"dev": "node_modules/.bin/nodemon --harmony -e js"`

## List of apis

1. Common
    - List of possible data types values - `GET`
    - List of possible alignment values - `GET`
    - List of possible sort direction values - `GET`

2. Columns
    - All Columns - `GET`
    - Column by uuid - `GET`
    - Create new column - `POST`
    - Update existing column by uuid - `PUT`
    - Delete column by uuid - `DELETE`
    - Column visibility update - Multiple - `POST`
    - Column freeze/unfreeze - Single - `POST`
    - Column sorting update - Multiple - `POST`
    - Column sequence/order update - Multiple - `POST`

3. Posts
    - All Posts - `GET`
    - Post by uuid - `GET`
    - Create new post - First post - `POST`
    - Create new post - Add NEXT - `POST`
    - Create new post - Add CHILD - `POST`
    - Update post by uuid - `PUT`
    - Delete post by uuids - `DELETE`
    - Paste Next/Child - `POST`
