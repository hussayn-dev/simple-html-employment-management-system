const mongoose = require('mongoose')
const validator = require('validator')
const User = require('./user')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required : true,
        trim: true
    },
    completed : {
        type: Boolean,
        default: false
    },
    owner :  {
   type:   mongoose.Schema.Types.ObjectId,
    required : true,
    ref: 'User'
    }
}, {
    timestamps: true
})


// taskSchema.statics.findUser = async (name) => {
//     const user =  await User.findOne({name})
//     if(!user) {   
// throw new Error('User not found')
// }
// return user
// }


const Task = mongoose.model('Task', taskSchema )
module.exports = Task;