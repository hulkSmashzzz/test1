
const express = require('express');
const router = express.Router();

router.get('/contact', (req, res) => {
    var data={
        user:req.user
    }
    res.render('content/contact',{data:data});
});

module.exports=router;