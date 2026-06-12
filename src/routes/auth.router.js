const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');


const router = express.Router()

router.post('/login', authController.loginUser)
router.post('/logout', authController.logoutUser)
router.get('/me', authMiddleware.authUser , authController.getUser)


// router.get(
//     '/test-admin',
//     authMiddleware.authUser,
//     allowRoles('deepak_admin'),
//     (req, res) => {
//         res.status(200).json({
//             message: 'Admin Access Granted'
//         });
//     }
// );



module.exports = router