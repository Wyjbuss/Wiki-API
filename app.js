const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost:27017/wikiDB", {
	useNewUrlParser: true
});
const articleSchema = {
	title: String,
	content: String
};
const Article = mongoose.model("Article", articleSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static("public"));

//TODO
// chaninable route handelers **************************************************
app.route("/articles")
	.get(function(req, res) { // get and read get from the server and read from the database
		Article.find({}, function(err, foundArticles) { // reading from the database
			if (!err) {
				res.send(foundArticles);

			} else {
				res.send(err);
			}
		});
	})
	.post(function(req, res) {
		const article = new Article({
			title: req.body.title,
			content: req.body.content
		})
		article.save(function(err) {
			if (!err) {
				res.send("Successfully added a new article")

			} else {
				res.send(err);
			}
		});

	})
	.delete(function(req, res) {
		Article.deleteMany({}, function(err) {
			if (!err) {
				res.send("Successfully deleted all articles")
			} else {
				res.send(err);
			}
		});
	});
// END CHAINABLE ROUTS *********************************************************

//channing spacific articles **************************************************
app.route("/articles/:spacificArticle")
	//spaces are "%20" in the url. see url encoding documentaion on w3schools.
	.get(function(req, res) {
		// use lodash (_) to make this work without spacific casing on the letters
		spacificArticle = req.params.spacificArticle;
		Article.findOne({
			title: spacificArticle
		}, function(err, foundArticle) { // reading from the database
			if (!err) {
				res.send(foundArticle);

			} else {
				res.send(err);
			}
		});
	})
	// PUT request replace the whole thing
	// if we dont provide a value for title or content then the article
	// wont have a title or a content at all. We would use PATCH instead
	.put(function(req, res) {
		// update from CRUD for our database
		// update({what to update?},{what part will be updated?},{overwrite:true})
		Article.update({
			title: req.params.spacificArticle
		}, {
			title: req.body.title,
			content: req.body.content
		}, {
			overwrite: true
		}, function(err) {
			if (!err) {
				res.send("Successfully updated article");
			};
		});
	})
	.patch(function(req, res) {
		//specifying $set we can fill in what we want to update, title or content
		// or both. since we cant to let the client or person using postman
		// to decide on the fly what is to be updated, we can say req.body
		// and it will fill in what it can based on the peramiers it was given
		Article.update({
			title: req.params.spacificArticle
		}, {
			$set: req.body
		}, function(err) {
			if (!err) {
				res.send("Successfully updated article")
			} else {
				res.send(err);
			}
		});
	})
	.delete(function(req, res) {
		Article.deleteOne({
			title: req.params.spacificArticle
		}, function(err) {
			if (!err) {
				res.send("Successfully deleted article")
			} else {
				res.send(err);
			}
		});
	});
// END OF /articles/:spacificArticle *******************************************

// GET and READ
// GET getting all the articles on the article route
app.get("/articles", function(req, res) { // get and read get from the server and read from the database
	Article.find({}, function(err, foundArticles) { // reading from the database
		if (!err) {
			res.send(foundArticles);

		} else {
			res.send(err);
		}
	});
});

//POST and CREAT
// using postman i can post content to my database
app.post("/articles", function(req, res) {
	const article = new Article({
		title: req.body.title,
		content: req.body.content
	});
	article.save(function(err) {
		if (!err) {
			res.send("Successfully added a new article")

		} else {
			res.send(err);
		}
	});

});

//DELETE
app.delete("/articles", function(req, res) {
	Article.deleteMany({}, function(err) {
		if (!err) {
			res.send("Successfully deleted all articles")
		} else {
			res.send(err);
		}
	});
});

app.listen(3000, function() {
	console.log("Server started on port 3000");
});
