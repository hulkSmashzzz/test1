const express = require('express');
const router = express.Router();
var ObjectId =require('mongodb').ObjectId;
var formidable = require('formidable');
var fs=require('fs');

var MongoClient=require("mongodb").MongoClient;
MongoClient.connect('mongodb+srv://hulk:hulk@cluster0.fr8yj.mongodb.net/test?retryWrites=true&w=majority',{useUnifiedTopology: true },
   function(error,client ){
     var newblog= client.db("Event");
     console.log("Db connected");


     router.get('/events', (req, res) => {
        newblog.collection('collectionEvent').find().toArray(function(error,posts){
        posts=posts.reverse();    
        var data={
            user:req.user,
            posts:posts
        } ;   
        res.render('content/events',{data:data});
    });
    }); 

router.get('/posts',function(req,res){
  res.render('admin/posts'); 
  });
  router.post('/do-posts',function(req,res){
      newblog.collection('collectionEvent').insertOne(req.body,function(error,document){
          res.send({
              text:"Posted Successfully",
              _id:document.insertedId
          });
     });  
  });
  
  
 router.get('/posts/:id',function(req,res){
    newblog.collection('collectionEvent').findOne({"_id": ObjectId(req.params.id)},function(err,post){
    var data={
        user:req.user,
        post:post
    } ;      
     res.render('content/eventContent',{data:data});
    });  
   });   
router.post('/posts/do-comment',function(req,res){
    newblog.collection("collectionEvent").updateOne({"_id": ObjectId(req.body.post_id)},{
       $push:{
          "comments":{username:req.body.username,comment:req.body.comment}
       }
    },function(err,post){
      res.send({
        text:"comment successful",
        _id:post.insertedId
    });
    });
  });


router.post('/do-image-upload',function(req,res){

       var formData=new formidable.IncomingForm();
       formData.parse(req,function(error,fields,files){
       var oldPath=files.file.path; 
       var newPath="assets/img/imageEvent/"+files.file.name;
       console.log(oldPath);
       fs.rename(oldPath,newPath,function(err){ 
        if (err) throw err
        //console.log('Successfully renamed - AKA moved!')
        res.send("/"+newPath);
       })
   });
}); 
  

 });
module.exports = router; 