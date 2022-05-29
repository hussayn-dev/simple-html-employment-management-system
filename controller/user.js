const bcrypt = require("bcrypt");
const passport = require("passport");
const validator = require('validator')
const jwt = require('jsonwebtoken')


const User = require("../models/user");
const MyError = require("../utilities/utils");


exports.signUp = async(req, res, next)=>{
    try {
        req.body.password = `${req.body.name}${process.env.DEFAULT_PASSWORD}`
        const userExist =   await User.findOne({email : req.body.email})
        if(userExist) return res.json({error: 'Email exists try signing up with another email or sign Up  with that email'})
        if(!validator.isEmail(req.body.email))res.json({error : 'Email is not valid'}) 
    const user = new User(req.body)
  await user.save()
 res.json({user, status : 'Saved'})
    } catch (error) {
next(new MyError("Couldn't create"))
    }
}
exports.login  =  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect:  '/user/login',
    failureFlash : true
})
exports.register = (req, res)=> {
    res.render('register')
}
exports.me = (req, res) => {
    const user = req.user
    res.render('me', {user})
}
exports.uLogin =  async(req, res) => {
    res.render('login')
}
exports.display = async (req, res, next)=> {
    try {
        let searchResult = await User.find().sort({
            createdAt : 'desc'      
        })
        searchResult = searchResult.filter(search => {
            return search.email !== req.user.email
        })
            res.render('display' , {searchResult} )
    } catch (error) {
        next(new MyError("Couldn't get Employees"))
    }

    }
exports.delete = async (req, res, next)=> { 
    try {
       
        const user = await User.findById(req.params.id)
        await user.remove()
        res.redirect('/user/display')
    } catch (error) {
      next(new MyError('Not Deleted'))
    }
    }
exports.logout = async(req, res) => {
    req.logOut()
    res.redirect('/user/login')
}
exports.edit = async(req, res, next) => {
    try{
      if(req.body.newpass && !req.body.newpassConfirm) return {error : "Please Insert Confirm Password"}
     if(req.body.oldpass.trim().length !== 0) {
      const isMatch =  await bcrypt.compare(req.body.oldpass, req.user.password)
      if(!isMatch) return res.json({error : " Old Password Incorrect"})
      if(req.body.newpass !== req.body.newpassConfirm) return res.json({error : "Password doesnt Match"})
      req.body.password = req.body.newpass
    }
        const user = await User.findOne({email : req.body.email})
        if(user) return res.json({error :  "User exists input another email"})

const array = ['name', 'email', 'password']
array.forEach(update => {
    
     if(req.body[update] !== undefined) {
         if(req.body[update].trim().length !== 0)

        req.user[update] = req.body[update]
    }
})

await req.user.save()
res.redirect('/user/me')
    } catch {
next(new MyError('Update failed', 500))
    }

}

