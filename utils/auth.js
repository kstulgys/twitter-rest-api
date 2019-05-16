const config = require("../config")
const { User } = require("../resources/user/user.model")
const jwt = require("jsonwebtoken")
// import USERS from '../resources/data/users'

module.exports.newToken = newToken = userData => {
  return jwt.sign({ ...userData }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

module.exports.verifyToken = verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

module.exports.createToken = createToken = async ({
  token,
  tokenSecret,
  username
}) => {
  if (!token || !tokenSecret || !username) {
    return res
      .status(400)
      .send({ message: "You need to have a Twitter account" })
  }

  try {
    // const user = await User.create({ token, tokenSecret, email })
    return await newToken({ token, tokenSecret, username })
  } catch (e) {
    // return res.status(500).end()
    throw new Error("Could not generate a token")
  }
}

module.exports.verifyUser = async (req, res, next) => {
  console.log("req.body", req.body)
  const { authToken } = req.body

  if (!authToken) {
    return res.status(401).end()
  }

  let payload
  try {
    payload = await verifyToken(authToken)
  } catch (e) {
    return res.status(401).end()
  }

  req.user = payload
  next()

  //   const user = await User.findById(payload.id)
  //     .lean()
  //     .exec()

  //   if (!user) {
  //     return res.status(401).end()
  //   }
}

// export const protect = async (req, res, next) => {
//   const bearer = req.headers.authorization

//   if (!bearer || !bearer.startsWith("Bearer ")) {
//     return res.status(401).end()
//   }

//   const token = bearer.split("Bearer ")[1].trim()
//   let payload
//   try {
//     payload = await verifyToken(token)
//   } catch (e) {
//     return res.status(401).end()
//   }

//   const user = await User.findById(payload.id)
//     .select("-password")
//     .lean()
//     .exec()

//   if (!user) {
//     return res.status(401).end()
//   }

//   req.user = user
//   next()
// }
