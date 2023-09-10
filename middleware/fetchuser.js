const jwt = require("jsonwebtoken");
const JWT_SECRET = "n83bf929bf845hdi93hb";


const fetchuser = (req , res, next)=>{
    // get the user from jwt token 
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({error:"Invalid Token"});
    }
    try{
        const data = jwt.verify(token,JWT_SECRET)
        // console.log(data.user.id)
        req.user = data.user
        next()
    }catch(err){
        res.status(401).send({ error: err.message });
    }
}

module.exports = fetchuser