const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')



function initialize(passport)  {
    const authenticateUser= async (email, password, done) => {
        const user  = await User.findOne({email})
        if(user == null) {
            return done(null, false, {message: 'No user with that email'})
        }
        try {
            if(await bcrypt.compare(password, user.password)) {
                const token = await user.generateAuthToken()
                console.log(token)
                return done(null, user)

            } else {
                return done(null, false, {message : "Password incorrect"})
            }
        } catch (error) {
            return done(error)
        }

    }


passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))
passport.serializeUser((user, done) => done(null, user._id))
passport.deserializeUser(async (id, done) => done(null, await User.findById(id)))
}


module.exports = initialize