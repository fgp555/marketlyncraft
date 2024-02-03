const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const ejs = require("ejs");

const app = express();

// Configure express-session middleware
app.use(session({ secret: "your-secret-key", resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: "157768130286-n2i1st3g3i289ei1c6gmur5hc51b99da.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Store user information in session
      return done(null, profile);
    }
  )
);

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
  res.redirect("/");
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
  // Render index.ejs with user information if authenticated
  res.render("index", { user: req.user });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
