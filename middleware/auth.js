const jwt = require("jsonwebtoken");

// import the secret key of your api
const JWT_SECRET = process.env.JWT_SECRET

// Below middleware function is going to protect different routes of our application
function auth(req, res, next){

    // get the Authorization header from the incoming request
    const authHeader = req.headers.authorization;
    // console.log("The contents of the header: ", authHeader)

    const token = authHeader && authHeader.split(' ')[1];
    // console.log("The token is: ", token);

    // check whether the sent request constains the authorization token
    if(!token) res.status(401).json({message : "No authorization token provided"})

    
    // check whether the token provided is valid or not
    try{
        // verify the token using the secret key (JWT_SECRET)
        // if the token is valid, decode it and store user info in req.user
        const decoded = jwt.verify(token, JWT_SECRET);

        // console.log("decoded: ", decoded)
        req.user = decoded;

        // if the token has been verified and it is correct move to the next step
        next();
    }
    catch(err){
        res.status(403).json({message : "Invalid token"})
    }


};




// export the module
module.exports = auth;