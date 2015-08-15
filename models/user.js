var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

/**
 * Create a schema (blueprint) for all users in the database.
 * If you want to collect additional info, add the fields here.
 * We are setting required to true so that if the field is not
 * given, the document is not inserted. Unique will prevent
 * saving if a duplicate entry is found.
 */

// Review Schema for posting user reviews. 

var reviewSchema = mongoose.Schema ({
  title       : {type : String},
  createdBy   : {type : mongoose.Schema.ObjectId, ref: "user"}, // guy who left review
  postedOn    : {type : mongoose.Schema.ObjectId, ref: "user"}, // guy who took review
  dateCreated : {type : Number},
  body        : {type : String},
  date        : {type : String}

});

 // data based on this schema reside mostly in profiles for Open-Wifi
var userSchema = mongoose.Schema({

  username       : { type : String, required: true, unique: true, default : "username"},
  name           : { type : String, required : true, default : "User Name"},
  email          : { type : String, required: true, unique: true },
  password       : { type : String, required: true}, 
  description    : { type : String, default : "add in description"},
  status         : { type : String, default : "I've Got Open Wifi" }, 
  profilePic     : { type : String,}, // url 
  socialSite1    : { type : String }, // anchors wrapped in image url.
  socialSite2    : { type : String },
  socialSite3    : { type : String },
  reviews        : { type : Object },
  wifiSchedule   : { type : Array  }, 
  wifiProvider   : { type : String, default : "CenturyLink" },
  wifiBandwidth  : { type : String, default : "120bit/s" },
  addOns         : { type : String, default : "something"},
  location       : { type : Object, default : "Street Address, City, State" },
  reviews        : [reviewSchema]

});

/**
 * This allows us to hook into the pre-save DB flow. Our
 * callback will be called whenever a new user is about to
 * be saved to the database so that we can encrypt the password.
 */
userSchema.pre('save', function(next){

  // First, check to see if the password has been modified. If not, just move on.
  if(!this.isModified('password')) return next();

  // Store access to "this", which represents the current user document
  var user = this;

  // Generate an encryption "salt." This is a special way of increasing the
  // encryption power by wrapping the given string in a secret string. Something
  // like "secretpasswordsecret" and then encrypting that result.
  bcrypt.genSalt(10, function(err, salt){

    // If there was an error, allow execution to move to the next middleware
    if(err) return next(err);

    // If we are successful, use the salt to run the encryption on the given password
    bcrypt.hash(user.password, salt, function(err, hash){

      // If there was an error, allow execution to move to the next middleware
      if(err) return next(err);

      // If the encryption succeeded, then replace the un-encrypted password
      // in the given document with the newly encrypted one.
      user.password = hash;

      // Allow execution to move to the next middleware
      return next();
    });
  });
});


/**
 * Method on the user schema that allows us to hook into the
 * bcrypt system to compare an encrypted password to a given
 * password. This process doesn't involve unencrypting the stored
 * password, but rather encrypts the given one in the same way and
 * compares those values
 */
userSchema.methods.comparePassword = function(candidatePassword, next){
  // Use bcrypt to compare the unencrypted value to the encrypted one in the DB
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    // If there was an error, allow execution to move to the next middleware
    if(err) return next(err);

    // If there is no error, move to the next middleware and inform
    // it of the match status (true or false)
    return next(null, isMatch);
  });
};

// Our user model
var User = mongoose.model('user', userSchema);

// Make user model available through exports/require
module.exports = User;