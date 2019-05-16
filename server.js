require("dotenv").config()
const express = require("express")
const Twitter = require("twitter")
const { json, urlencoded } = require("body-parser")
const cors = require("cors")
// const { connect } = require("./utils/db")
const morgan = require("morgan")
const config = require("./config")
const passport = require("passport")
const TwitterStrategy = require("passport-twitter").Strategy
const { createToken, verifyUser } = require("./utils/auth")
// const { User } = require("./resources/user/user.model")
// import jobRouter from './resources/job/job.router'
// import userRouter from './resources/user/user.router'

// import { signup, signin, protect } from './utils/auth'

function getClient(token, tokenSecret) {
  return new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: token,
    access_token_secret: tokenSecret
  })
}

const app = express()

app.use(
  require("express-session")({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan("dev"))

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: `${config.serverUrl}/auth/twitter/callback`
    },
    async function(token, tokenSecret, profile, cb) {
      const username = profile.username
      const userToken = await createToken({ token, tokenSecret, username })
      console.log("userToken", userToken)
      cb(null, { userToken })
    }
  )
)

passport.serializeUser(function(user, cb) {
  cb(null, user)
})

passport.deserializeUser(function(obj, cb) {
  cb(null, obj)
})

app.get("/success", (req, res) => {
  //   console.log(req.user.userToken)
  res.redirect(`${config.clientUrl}/?token=${req.user.userToken}`)
})

app.get("/failure", (req, res) => {
  res.redirect("https://1q33jn2pl3.codesandbox.io/")
})

app.get("/auth/twitter", passport.authenticate("twitter"))

app.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", {
    successRedirect: "/success",
    failureRedirect: "/failure"
  })
)

app.post("/timeline", verifyUser, (req, res) => {
  //   console.log("req.user", req.user)
  const client = getClient(req.user.token, req.user.tokenSecret)
  //   var params = { screen_name: "nodejs" }
  client.get("statuses/user_timeline", function(error, tweets, response) {
    if (!error) {
      //   console.log(tweets)
      res.json({ tweets })
    }
  })
})

app.post("/node", verifyUser, (req, res) => {
  //   console.log("req.user", req.user)
  const client = getClient(req.user.token, req.user.tokenSecret)
  var params = { screen_name: "nodejs" }
  client.get("statuses/user_timeline", params, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      // console.log(tweets)
      res.json({ tweets })
    }
  })
})

app.post("/search", verifyUser, (req, res) => {
  //   console.log("req.user", req.user)
  const client = getClient(req.user.token, req.user.tokenSecret)
  client.get("search/tweets", { q: req.body.query }, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      // console.log(tweets)
      res.json({ tweets })
    }
  })
})

module.exports.start = async () => {
  try {
    // await connect()
    app.listen(config.port, () => {
      console.log(`REST API is live on port: ${config.port}`)
    })
  } catch (e) {
    console.error(e)
  }
}

// app.post('/signup', signup)
// app.post('/signin', signin)

// app.use('/api', protect)
// app.use('/api/job', jobRouter)
// app.use('/api/user', userRouter)

// app.use('/api/item', itemRouter)
// app.use('/api/list', listRouter)

// app.use((req, res, next) => {
//   const { userId } = req.session
//   if (userId) {
//     res.locals.user = USERS.find(user => user.id === userId)
//   }
//   next()
// })
// app.post('/signup', signup)
// app.post('/signin', signin)
// app.post('/signout', signout)
// app.use('/favorite', favoriteRouter)

// // FALLBACK
// app.get('/*', (req, res) => res.redirect(WEBSITE));
// const port = process.env.PORT || 3000
