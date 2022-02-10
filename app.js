//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlparser: true });

const articleSchema =  new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

/////////    Request targetting all Articles

//CREATING CHAINABLE
app.route("/articles")

   .get( function (req, res) {
   Article.find(function (err, foundArticles) {
    //console.log(foundArticles);
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
    });
   })

   .post(function (req, res) {
    console.log(req.body.title);
   console.log(req.body.content);

   const newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
   });

   newArticle.save(function (err) {
    if (!err) {
      res.send("Succesfully added articles");
    } else {
      res.send(err);
    }
   });
   })

   .delete(function(req ,res)
   {
     Article.deleteMany(function(err){
     if(!err){
     res.send("Succesfully delted all the articles");
     } else{
     res.send(err);
     }
    });

  });

///// Request targetting specific  Articles

 app.route("/articles/:articleTitle")

  //  req.params.articleTitle

  .get(function(req,res){

    Article.findOne({title: req.params.articleTitle},function(err,foundArticle){
     if(foundArticle){
       res.send(foundArticle);
     }else{
       res.send("No articles matching that title was found");
     }
   });
   })

   .put(function(req,res){
     Article.findOneAndUpdate(
       {title:req.params.articleTitle}, //CONDITON
       {title: req.body.title, content: req.body.content},
        {new: true},
         function (err){
         if(!err){
          res.send("Succesfully Updated articles");
          }
        }
     );
   })

  .patch(function(req,res){

    //req.body={title:}
    Article.update(
      {title:req.params.articleTitle},
      {$set : req.body},
      function(err){
        if(!err){
        res.send("Succesfully Updated Article")
       }else{
        res.send(err);
       }
      }
    );
  })

  .delete(function(req,res){

    Article.deleteOne(
      {title:req.params.articleTitle},
      function(err){
        if(!err){
          res.send("Succesfully Deleted");
        }else{
        res.send(err);
        }
      }
    );
  });





 app.listen(4000, function () {
  console.log("Server started on port 4000");
 });
