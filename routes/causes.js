const express = require('express');
const router = express.Router();

router.get('/causes', (req, res) => {
    var data={
        user:req.user
    }
    res.render('content/causes',{data:data});
});

router.get('/education', (req, res) => {
    var data={
        user:req.user
    }
    res.render('content/education',{data:data});
});

router.get('/health', (req, res) => {
    var data={
        user:req.user
    }
    res.render('content/health',{data:data});
});

router.get('/women', (req, res) => {
    var data={
        user:req.user
    }
    res.render('content/women',{data:data});
});

module.exports = router; 