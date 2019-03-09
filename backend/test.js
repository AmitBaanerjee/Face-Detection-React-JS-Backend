const express=require('express')
const bodyparser=require('body-parser')
const bcrypt=require('bcrypt-nodejs')
const cors=require('cors')
const app=express();

app.use(bodyparser.json());
app.use(cors());


const database=
{
	users:[
		{
		id:"1",
		name:'amit',
		email:'amit@gmail.com',
		password:'test',
		joined:new Date(),
		entries:0
		},
		{
		id:"2",
		name:'aman',
		email:'amam@gmail.com',
		password:'test11',
		joined:new Date(),
		entries:0
		}
	]
}

app.get('/',(req,res)=>{
	res.send(database.users);
})
app.post('/signin',(req,res)=>{
	if(req.body.email===database.users[0].email &&
		req.body.password===database.users[0].password){
		res.json(database.users[0]);
	}
	else{
		res.status(400).json("could not login!")
	}
})

app.post('/register',(req,res)=>{
	database.users.push({
		id:3,
		name:req.body.name,
		email:req.body.email,
		password:req.body.password,
		joined:new Date()
	})
	res.json(database.users[database.users.length-1]);
})
app.get('/profile/:id',(req,res)=>{
	const{id}=req.params;
	let flag=false;
	database.users.forEach(user=>{
		if(user.id=== id){
			flag=true;
			return res.json(user);
		}
	})
	if(!flag){
		res.status(400).json("user not found ");
	}
})
app.put('/image',(req,res)=>{
	const{id}=req.body;
	let flag=false;
	database.users.forEach(user=>{
		if(user.id=== id){
			flag=true;
			user.entries++;
			return res.json(user.entries);
		}
	})
	if(!flag){
		res.status(400).json("user not found ");
	}
})


app.listen(1994,()=>{
	console.log("server running");
})