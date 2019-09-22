import express from "express";
import hbs from "express-handlebars";
import logger from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import session from "express-session";
import captionRoute from "./routes/caption";
// import http from "http";

var MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv").config();

const app = express();

const port = process.env.PORT || 4500;

export const mongo_uri = "mongodb://localhost:27017/caption";
export const connect = mongoose.connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use("/static", express.static("static"));
// Use `.hbs` for extensions and find partials in `views/partials`.
app.engine("html", require('ejs').renderFile);

app.set("view engine", "html");
app.set("views", __dirname + "/views");

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
	session({
		secret: process.env.SECRET_KEY,
		saveUninitialized: true,
		resave: true,
		store: new MongoDBStore({
			uri: "mongodb://localhost:27017/caption",
			collection: "captionSessions"
		})
	})
);

app.listen(4500, () => {
    console.log('Caption app listening on port 4500!')
  });

app.use('/', captionRoute);
// app.use('/caption', captionRoute);