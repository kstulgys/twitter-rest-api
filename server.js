require("dotenv").config()
const express = require("express")
const Twitter = require("twitter")
const { json, urlencoded } = require("body-parser")
const cors = require("cors")
const morgan = require("morgan")
const config = require("./config")
const passport = require("passport")
const TwitterStrategy = require("passport-twitter").Strategy
const { createToken, verifyUser } = require("./utils/auth")


const app = express()
app.use(passport.initialize())
app.use(passport.session())
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan("dev"))


// console.log(config)

function getClient(token, tokenSecret) {
  return new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: token,
    access_token_secret: tokenSecret
  })
}


app.use(
  require("express-session")({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
  })
)

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: `${config.serverUrl}/auth/twitter/callback`
    },
    async function (token, tokenSecret, profile, cb) {
      const id = profile.id
      const userToken = await createToken({ token, tokenSecret, id })
      console.log("userToken", userToken)
      cb(null, { userToken })
    }
  )
)

passport.serializeUser(function (user, cb) {
  cb(null, user)
})

passport.deserializeUser(function (obj, cb) {
  cb(null, obj)
})

app.get("/success", (req, res) => {
  res.redirect(`${config.clientUrl}/?token=${req.user.userToken}`)
})

app.get("/failure", (req, res) => {
  res.redirect(config.clientUrl)
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
  const client = getClient(req.user.token, req.user.tokenSecret)
  client.get("statuses/user_timeline", function (
    error,
    tweets,
    response
  ) {
    if (error) {
      console.log(error)
    }
    res.json({ tweets })
  })
})

app.post("/home", verifyUser, (req, res) => {
  const client = getClient(req.user.token, req.user.tokenSecret)
  client.get("statuses/home_timeline", function (
    error,
    tweets,
    response
  ) {
    if (error) {
      console.log(error)
    }
    res.json({ tweets })
  })
})

app.post("/user", verifyUser, (req, res) => {
  const client = getClient(req.user.token, req.user.tokenSecret)
  var params = { user_id: req.user.id }
  client.get("/users/show", params, function (
    error,
    user,
    response
  ) {
    if (error) {
      console.log(error)
    }
    res.json({ user })
  })
})


app.post("/search", verifyUser, (req, res) => {
  const client = getClient(req.user.token, req.user.tokenSecret)
  var params = { q: req.body.query, result_type: 'popular' }
  client.get("search/tweets", params, function (
    error,
    tweets,
    response
  ) {
    if (error) {
      console.log(error)
    }
    res.json({ tweets })
  })
})

app.post("/update", verifyUser, (req, res) => {
  const client = getClient(req.user.token, req.user.tokenSecret)
  var params = { status: req.body.update }
  client.post('statuses/update', params, function (error, tweet, response) {
    if (error) {
      console.log(error)
    }
    res.json({ tweet })
  });
})

app.post("/favorites", verifyUser, (req, res) => {
  const client = getClient(req.user.token, req.user.tokenSecret)
  var params = { screen_name: req.body.name }
  client.get('favorites/list', params, function (error, tweets, response) {
    if (error) {
      console.log(error)
    }
    console.log(tweets)
    res.json({ tweets })
  });
})

app.post("/favorite", verifyUser, (req, res) => {
  const client = getClient(req.user.token, req.user.tokenSecret)
  var params = { id: req.body.id }
  client.post('favorites/create', params, function (error, tweet, response) {
    if (error) {
      console.log(error)
    }
    console.log(tweet)
    res.json({ tweet })
  });
})

app.post("/unfavorite", verifyUser, (req, res) => {
  const client = getClient(req.user.token, req.user.tokenSecret)
  var params = { id: req.body.id }
  client.post('favorites/destroy', params, function (error, tweet, response) {
    if (error) {
      console.log(error)
    }
    console.log(tweet)
    res.json({ tweet })
  });
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
