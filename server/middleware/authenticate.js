const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authCookie = req.cookies.jwt
 
  if (!authCookie) {
    return res.sendStatus(401);
  }
  
  try {
    const decode = jwt.verify(authCookie, process.env.ACCESS_TOKEN_SECRET);
    req.userInfo = decode.UserInfo;
    console.log(decode)
    next();
  } catch (err) {
    res.sendStatus(401);
  }
};


module.exports = authenticate