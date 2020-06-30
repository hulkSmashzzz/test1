var express=require("express"); 
var bodyParser=require("body-parser"); 
const mongoose = require('mongoose'); 
const morgan = require('morgan')
const path = require('path');

const connectDB=require('./db/connection');
const cookieParser = require('cookie-parser');
//const expressHandlebars = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
var socket = require('socket.io');

require('./config/passport');
var User = require('./models/user');

require('dotenv').config()

var app=express();
module.exports.app = app;
app.use(morgan('dev'));
var server = app.listen(3000, () => console.log('Server started listening on port 3000!'));
connectDB();

// mongoose.Promise = global.Promise;
// mongoose.set('useUnifiedTopology', true);
// mongoose.set('useNewUrlParser', true);
// mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost:27017/April_30'); 

// var db=mongoose.connection; 
// db.on('error', console.log.bind(console, "connection error")); 
// db.once('open', function(callback){ 
// 	console.log("connection succeeded"); 
// }) 



//var path = require('path');
app.use(bodyParser.json()); 
//app.use(express.static(__dirname + '/')); 

app.use(bodyParser.urlencoded({ 
	extended: false
})); 


/*MODIFIED START*/ 
//app.set('views', path.join(__dirname, 'html'));
//app.engine('handlebars', expressHandlebars({ defaultLayout: 'layout' }));
//app.set('view engine', 'handlebars');
app.set('view engine', 'ejs');
      
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//app.use(express.static(path.join(__dirname, 'assets')));
app.use('/assets',express.static(path.join(__dirname, 'assets')));


app.use(session({
  cookie: { maxAge: 60000 },
  secret: 'codeworkrsecret',
  saveUninitialized: false,
  resave: false
}));
app.use(function(req,res,next){
  res.locals.isAuthenticated=req.isAuthenticated();
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success');
  res.locals.error_messages = req.flash('error');
  res.locals.isAuthenticated = req.user ? true : false;
  next();
});


//app.use('/',require('./routes/index'));
app.use(require('./routes/index'));
app.use('/users',require('./routes/users'))
app.use(require('./routes/about'));

app.use(require('./routes/causes'));
app.use(require('./routes/events'));
app.use(require('./routes/contact'));
app.use(require('./routes/gallery'));
app.use(require('./routes/donation.js'));

var io =socket(server);

io.on("connection",function(socket){

  console.log('user connected',socket.id);

  socket.on("new_post",function(formdata){
    socket.broadcast.emit("new_post",formdata);
    console.log(formdata);
  });

  socket.on("new_comment",function(comment){
   io.sockets.emit("new_comment",comment);  
  });
 });



// catch 404 and forward to error handler
// app.use((req, res, next) => {
//   res.render('notFound lol');
// });
//app.set( 'port', ( process.env.PORT || 3000 ));

// Start node server
//app.listen( app.get( 'port' ), function() {
  //console.log( 'Node server is running on port ' + app.get( 'port' ));
  //});

// const port = process.env.PORT || 3000;
// app.listen(port);
//app.listen(3000, () => console.log('Server started listening on port 3000!'));
