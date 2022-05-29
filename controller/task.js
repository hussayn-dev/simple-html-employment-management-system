const Task = require("../models/task")
const MyError = require('../utilities/utils')
const User = require('../models/user')



exports.getUserTask = async (req, res, next)=> {
    try {
      const user = await User.findById(req.params.id)
      const match = {}
      if(req.query.completed) {
       match.completed = req.query.completed === 'true'
       }
       await user.populate({
         path: 'tasks',
         match, 
         options :{
             sort : "desc"
         }
     })
    const tasks = user.tasks
     res.render('usertask', {tasks})
    } catch (error) {
        next(new MyError('Could not find task', 404))
    }
  }
exports.createTask = async(req, res, next)=> {
    try {
        let msg = {}
        req.body.completed = false;;
        const user = await User.findOne({name: req.body.name })
        if(!user) return res.json({error: "User can't be found"})
        req.body.owner = user._id
        const task = new Task(req.body)
        await task.save()
//   msg. success = 'Created Successfully'
res.send('done')
    } catch (error) {
next(new MyError('Error creating user'))
    }
    
}
exports.checkTask = async(req, res, next) => {
    try {
    await req.user.populate('tasks')
    const tasks = req.user.tasks
   res.render('task', {tasks})
 
    } catch (error) {
 next(new MyError({error : "Can't get Task"}))
    }
  }
exports.editTask = async (req, res, next) => {
      try {
        const task = await Task.findById(req.params.id)
        if(!task) return res.json({message : "Could not find task"})
        Object.keys(req.body).forEach(async update => {
          task[update] = req.body[update]
       })   
       await task.save()
       if(req.user.role === 'admin') {
res.redirect('back')
       } else {
        res.redirect('/task/me')
       }
     
      } catch (error) {
          next(new MyError("Didn't update, try later"))
      }
  
  }
 exports.deleteTask = async(req, res, next) => {
      try {
        const task = await Task.findByIdAndDelete(req.params.id)
        res.json(task)
      } catch (error) {
      next(new MyError("Couldn't Delete"), 500)    
      }
 
  }