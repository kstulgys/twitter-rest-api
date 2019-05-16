const mongoose = require("mongoose")
// const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    token: {
      type: String,
      required: true,
      unique: true
    },
    tokenSecret: {
      type: String,
      required: true,
      unique: true
    }
    // twitterId: {
    //   type: String,
    //   required: true,
    //   unique: true
    // },
    // photoUrl: {
    //   type: String,
    //   required: true
    // }
  },
  { timestamps: true }
)

module.exports.User = mongoose.model("user", userSchema)

// userSchema.pre("save", function(next) {
//   if (!this.isModified("token")) {
//     return next()
//   }

//   bcrypt.hash(this.password, 8, (err, hash) => {
//     if (err) {
//       return next(err)
//     }

//     this.password = hash
//     next()
//   })
// })

// userSchema.methods.checkPassword = function(password) {
//   const passwordHash = this.password
//   return new Promise((resolve, reject) => {
//     bcrypt.compare(password, passwordHash, (err, same) => {
//       if (err) {
//         return reject(err)
//       }

//       resolve(same)
//     })
//   })
// }

// export const User = mongoose.model("user", userSchema)
