const router = require('express').Router();
const userController = require('../controller/userController');

router.get('/', userController.getUser);
router.put('/:id', userController.updateUser);
router.put('/:id/follow/', userController.followUser);
router.put('/:id/unfollow/', userController.unfollowUser);
router.delete('/:id', userController.deleteUser);

module.exports = router