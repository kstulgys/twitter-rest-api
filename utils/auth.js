const config = require("../config")
const jwt = require("jsonwebtoken")

const newToken = userData => {
  return jwt.sign({ ...userData }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

const verifyToken = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })
}

const createToken = async ({ token, tokenSecret, id }) => {
  if (!token || !tokenSecret || !id) {
    throw new Error("invalid")
  }

  try {
    return await newToken({ token, tokenSecret, id })
  } catch (e) {
    throw new Error(e.message)
  }
}

const verifyUser = async (req, res, next) => {
  const { authToken } = req.body

  if (!authToken) {
    return res.status(401).end()
  }

  let payload
  try {
    payload = await verifyToken(authToken)
  } catch (e) {
    console.log(e)
    return res.status(401).end()
  }

  req.user = payload
  next()
}

module.exports = {
  verifyToken,
  newToken,
  createToken,
  verifyUser
}
