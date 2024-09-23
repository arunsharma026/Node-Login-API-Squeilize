// const userregisteController = require('../controllers/userRegisterController.js');
const usersLoginController = require('../controllers/usersController.js')
const express = require('express');
const router = express.Router();

router.post('/addUser', usersLoginController.registration)
router.post('/userLogin', usersLoginController.userLogin)
router.post('/userLogOut', usersLoginController.userLogout)


module.exports = router;