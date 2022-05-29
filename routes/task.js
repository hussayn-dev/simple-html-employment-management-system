const express = require('express')
const router = new express.Router()

const {isLoggedIn, adminCheck, notAdmin} = require('../auth/auth')


const task = require('../controller/task')
const Task = require('../models/task')

router.use(isLoggedIn)
// User checks his tasks
router.get('/me',notAdmin, task.checkTask)
//  admin and user edits a task  admin edits the description,  user edits 
router.route('/userTask/:id')
       .patch(task.editTask)       
router.use(adminCheck)
// admin checks users tasks
router.route('/userTask/:id')
// Admin creates a task and assign it to user
.get(task.getUserTask)
//admin deletes a task
.delete(task.deleteTask )
router.post('/employee', task.createTask)










//
// admin creates task and assigns it to employer
// admin checks tasks for user
//user checks task
//user completes // updates tasks
// 



module.exports = router
