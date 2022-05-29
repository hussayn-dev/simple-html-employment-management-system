const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const user = require('../controller/user')
const initializePassport = require('../config/passport')
const passport = require("passport")
const {isLoggedIn, notLoggedIn,adminCheck} = require('../auth/auth')

initializePassport(passport)
const bcrypt = require('bcrypt')
const MyError = require('../utilities/utils')

router.route('/register')
.get(isLoggedIn, adminCheck, user.register)
.post(user.signUp)
// User logs in
router.route('/login')
.get( notLoggedIn, user.uLogin)
.post(user.login)
router.get('/me' , isLoggedIn, user.me)

// User update  I'll com e back to  this 
router.patch('/edit', isLoggedIn, user.edit )
////////
// user logs out
router.post('/logout', user.logout)



// Admin checks info of his employees
router.delete('/:id', user.delete)
router.get('/display' ,  isLoggedIn, adminCheck, user.display)



module.exports = router