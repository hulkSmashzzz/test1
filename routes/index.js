const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    var data={
        user:req.user
    }
    res.render('content/index',{data:data});
});





module.exports = router; 