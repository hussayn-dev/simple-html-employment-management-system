const mongoose = require('mongoose')
const  validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    
    name : {
        type: String,
        required: true,
        },
    email : {
        type : String,
        required: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error ('Email is not valid')
            }
        },
        lowercase : true
        
    },
    password : {
        type: String,
        required : true,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error("Password can't be password")
            }
        },
        trim : true,
        minlength : 6
    },
    role : {
        type : String,
        required : true,
    },
    tokens : [
        {
            token : {
                type: String,
            }
        }
    ]
    }, {
        timestamps: true
    })
    userSchema.virtual('tasks', {
        ref: 'Task',
        localField:  '_id',
        foreignField: 'owner'
         
    })
    userSchema.methods.generateAuthToken = async function  ( ) {
        const user = this
        const token =  jwt.sign({_id : user._id.toString()}, process.env.JSON_WEB_TOKEN)
        
         user.tokens.push({token})
            await user.save()
        return token
     
    }
    userSchema.pre('save',  async function(next) {
        const  user = this
     
     if(user.isModified('password')) {
         user.password = await bcrypt.hash(user.password, 10)
     
     }
     next()
     })
    

    const User = mongoose.model('User', userSchema )
    module.exports = User; 