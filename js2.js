const express = require('express')
const app = express()

server = require('http').createServer(app)
io = require('socket.io').listen(server)

app.set('view engine','ejs');

//opening home h2.html page using express
app.use(express.static(__dirname+'/public_static'))

//app.set('port',process.env.PORT || 5000)
server.listen(process.env.PORT || 3000);
console.log('Server Running...on 3000');

var Datastore=require('nedb')
var db=new Datastore({filename:'store.db',autoload:true})


app.get('/',function(req,res){
	res.render('homepage')
})

app.get('/signupsubmit',function(req,res){
	var d={
		'name':req.query.firstname,
		'email':req.query.email,
		'password':req.query.pwd,
		'mobile':req.query.mobile
	}
db.insert(d,function(err,newdoc){
	console.log(newdoc)
	res.render('signup')
})
})

app.get('/loginsubmit',function(req,res){

	db.find({'name':req.query.name,'password':req.query.password},function(err,resu1){
		if(resu1.length>0){
			db.find({},function(err2,resu2){
			res.render('login',{result1:resu1,result2:resu2})
			//console.log(result)
			})	
		}else{
		res.render('new2')
		 }
	})

})

app.get('/search',function(req,res){
	db.find({'name':req.query.search,'password':req.query.pwd},function(err,result){
		if(result.length>0){
		res.render('xyz',{results:result})
	}
	})
})

app.get('/chat/:name',function(req,res){
	var a=req.params.name;
	db.find({'name':a},function(err,result){
		res.render('chat',{result:result})
	})
	
})

//*************SOCKET.IO******************//

io.sockets.on('connection',function(socket){
	console.log('socket connected ...')
	
	
        
	socket.on('send message',function(data){
	console.log('message sent');
	io.sockets.emit('new message',{msg:data})
	});
})




/*app.listen(app.set('port'), function () {
  console.log('Example app listening on port 5000!')
})*/






