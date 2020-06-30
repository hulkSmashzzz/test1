const express = require('express');
const router = express.Router();

router.get('/gallery', (req, res) => {
    var data={
        user:req.user
    }
    res.render('content/gallery',{data:data});
});

module.exports=router;