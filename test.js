const express=require('express')
const bodyparser=require('body-parser')
const bcrypt=require('bcrypt-nodejs')
const cors=require('cors')
const app=express();
const knex = require('knex');
const Clarifai = require('clarifai');

const clarifai_app = new Clarifai.App({
	apiKey:'b69ad8d6a28d4e4fac81c7b1862fe74d',

});

const db=knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'apple',
    password : '',
    database : 'project'
  }
});
app.use(bodyparser.json());
app.use(cors());



app.get('/',(req,res)=>{
	res.send(database.users);
})
app.post('/signin',(req,res)=>{
  if(!req.body.email||!req.body.password){
    return res.status(400).json("incorrect form submisson");
  }
	db.select('email','hash')
	.from('login')
	.where('email','=',req.body.email)
	.then(data=>{
		const isValid=bcrypt.compareSync(req.body.password,data[0].hash)
		if(isValid){
			return db.select('*').from('users')
			.where('email','=',req.body.email)
			.then(user=>{
				res.json(user[0])
			})
			.catch(err=>res.status(400).json("unable to fetch user"));
		}
		else{
			res.status(400).json("Password incorrect");
		}
	})
	.catch(err=>res.status(400).json("Wrong Credentials"))
})

app.post('/register',(req,res)=>{
  if(!req.body.email||!req.body.password||!req.body.name){
    return res.status(400).json("Please enter all fields to register");
  }
	const hash=bcrypt.hashSync(req.body.password);
	db.transaction(trx=>{
		trx.insert({
			hash:hash,
			email:req.body.email
		})
		.into('login')
		.returning('email')
		.then(LoginEmail=>{
			return db('users')
			.returning('*')
			.insert({
				name:req.body.name,
				email:LoginEmail[0],
				joined:new Date()
			})
			.then(user=>{
				res.json(user[0]);
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})

	  .catch(err=>res.status(400).json("user already registered!"));
})
app.get('/profile/:id',(req,res)=>{
	const{id}=req.params;
	db.select('*').from('users').where({
		id:id
	})
	.then(user=>{
		if(user.length){
		res.json(user[0]);
		}
		else{
		res.status(400).json("profile id does not exist");
		}
	})
	.catch(err=>{
		res.status(400). json("error");
	})

})
app.post('/imageURL',(req,res)=>{
  clarifai_app.models
  .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
  .then(data=>{
    res.json(data);
  })
  .catch(err=>res.status(400).json("Unable to work with API"))
})
app.put('/image',(req,res)=>{
	db('users').where('id','=',req.body.id)
	.increment('entries',1)
	.returning('entries')
	.then(entries=>res.json(entries[0]))
	.catch(err=>res.status(400).json("error!"));

})


app.listen(process.env.PORT || 1994,()=>{
	console.log(`server is listening on port: ${process.env.PORT}`);
})
