const express = require('express');
const router = express.Router();

router.get('/about', (req, res) => {
    var data={
        user:req.user
    }
    res.render('content/about',{data:data});
});

module.exports=router;