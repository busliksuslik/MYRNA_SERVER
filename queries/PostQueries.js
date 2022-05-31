const queryTool = require('../tools/QueryTool')
const {pool} = require("../connector");

const getAllUserPosts = (user_id) =>{
    return queryTool.getMany(pool, `SELECT * FROM posts WHERE author = ${user_id}`)
}
const getAllUserComments = (user_id) => {
    return queryTool.getMany(pool, `SELECT * FROM comments WHERE author = ${user_id}`)
}
const deletePost = (post_id) => {
    queryTool.insert(pool, `UPDATE posts SET deleted = true WHERE id = ${post_id}`)
}
const getPostById = (post_id) => {
    return queryTool.getOne(pool, `SELECT * FROM posts WHERE id = ${post_id}`)
}
const getAllPosts = () =>{
    return queryTool.getMany(pool,`SELECT * FROM posts WHERE deleted = 0 ORDER BY id DESC`)
}
const getPostsByUserId = (user_id) => {
    return queryTool.getMany(pool,`SELECT * FROM posts WHERE author = ${user_id}`)
}
const getSubscribedPosts = (user_id) => {
    return queryTool.getMany(pool,`
            SELECT * FROM posts 
            WHERE author IN (
                SELECT subscribed_id
                FROM subscriptions
                WHERE user_id = ${user_id}
            )`)
}

module.exports = {
    getAllUserPosts,
    getAllUserComments,
    deletePost,
    getPostById,
    getAllPosts,
    getPostsByUserId,
    getSubscribedPosts
}