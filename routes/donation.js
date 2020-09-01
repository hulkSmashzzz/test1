const express = require('express');
const router = express.Router();

router.get('/donation', (req, res) => {
    var data={
        user:req.user
    }
    res.render('content/donation',{data:data});
});

module.exports=router;