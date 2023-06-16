const router = require('express').Router();
const postController = require('../controller/postController');

router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.put('/:id/like', postController.likePost);
router.get('/:id', postController.getPost);
router.get('/timeline/:userId', postController.getTimeline);
router.get('/profile/:username', postController.getUserPosts);

module.exports = router