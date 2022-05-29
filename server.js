require('dotenv').config()
const express = require('express')
const app = express()
require('./config/config')
const methodOverride = require('method-override')
const userRouter = require('./routes/user')
const taskRouter = require('./routes/task')
const ejs = require('ejs')
const flash = require('express-flash')
const session = require('express-session')
const  bodyParser = require('body-parser')
const passport = require('passport')
const {isLoggedIn} = require('./auth/auth')



app.use(bodyParser.urlencoded({ extended: false }))

app.use(methodOverride('_method'))
const initializePassport = require('./config/passport')
const User = require('./models/user')
initializePassport(passport)

app.use(express.json())
app.set('view engine', 'ejs')
app.use(flash())
app.use(session({
    secret : 'secret',
    resave : false,  
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/user', userRouter)
app.use('/task', taskRouter)


app.get('/' , isLoggedIn,  async(req, res) => {
    let employees = await User.find({role:"Employee"})
    msg = {}
    if (req.user.role === 'admin') return res.render('index', {user: req.user, msg, employees})
    return res.render('employee',{user: req.user, employees} )
})



app.use(function(error, req, res, next){

    return res.status(error.status).json({
        message: error.message,   
    })
   });
app.listen(4190, () => {

console.log('I don dey run 00000 on 4190')
})