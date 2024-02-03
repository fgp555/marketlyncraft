const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");

const app = express();

// Configure express-session middleware
app.use(session({ secret: "your-secret-key", resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));

let clientID = process.env.clientID;

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: process.env.callbackURL,
      // callbackURL: process.env.callbackURL_FGPLOL,
    },
    (accessToken, refreshToken, profile, done) => {
      // Store user information in session
      return done(null, profile);
    }
  )
);

console.info(process.env.callbackURL)

// Serialize user information into the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user information from the session
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Set view engine to ejs
app.set("view engine", "ejs");

// Define routes

// Redirect to Google for authentication
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback route after authentication
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
  // Successful authentication, redirect home.
  res.redirect("/profile");
});

// Logout route
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Home route
app.get("/", (req, res) => {
  // Log user object to the console
  console.log("User Object:", req.user);

  // Render index.ejs with user information if authenticated
  res.render("index", { user: req.user });
});

// profile route
app.get("/profile", ensureAuthenticated, (req, res) => {
  // Render profile.ejs with user information if authenticated
  res.render("profile", { user: req.user });
});

// profile route
app.get("/download", ensureAuthenticated, (req, res) => {
  // Render download.ejs with user information if authenticated
  res.render("download", { user: req.user });
});

// profile route
app.get("/videos", ensureAuthenticated, (req, res) => {
  // Render videos.ejs with user information if authenticated
  res.render("videos", { user: req.user });
});

// Middleware to ensure the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/google"); // Redirect to Google authentication if not authenticated
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
