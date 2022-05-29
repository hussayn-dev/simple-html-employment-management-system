const jwt =  require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.header['Authorization']
    const token = authHeader &&  authHeader.split(' ')[1]
    if(token == null) return res.status(401)
       jwt.verify(token, process.env.JSON_WEB_TOKEN, (err, user)=> {
           if(err) return res.status(403)
           req.user = user
       })
}

const adminCheck = (req, res, next)=> {
    if(req.user.role === 'admin') return next()
   return res.json({error : 'Not an Admin'})
}
const notAdmin = (req, res, next)=> {
    if(req.user.role !== 'admin') return next()
   return res.json({error : ' Admin'})
}
const isLoggedIn = (req, res,next) => {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/user/login')
}
const notLoggedIn = (req, res, next) => {
if(!req.isAuthenticated()) {
    return next()
}
res.redirect('/')
}

module.exports = {isLoggedIn, notLoggedIn, adminCheck, notAdmin}