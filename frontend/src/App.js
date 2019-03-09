import React, { Component } from 'react';
import './App.css';
import Navigation from './Components/Navigation/Navigation.js'
import Logo from './Components/logo/Logo.js'
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm.js'
import Rank from './Components/Rank/Rank.js'
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.js';
import Signin from './Components/Signin/Signin.js';
import Register from './Components/Register/Register.js';

const app = new Clarifai.App({
	apiKey:'b69ad8d6a28d4e4fac81c7b1862fe74d',
	
});
const particle_parameters={
            		particles: {
            			number:{
            				value:173,
            				density:{
            					enable:true,
            					value_area:800

            				}
            			}
            }
        }

class App extends Component {
	constructor(){
		super();
		this.state={
			input:'',
			imageURL:'',
			box:{},
			route:'signin',
			isSignedin:false,
			user:{
				id:'',
				name:'',
				email:'',
				joined:'',
				entries:0
			}
		}
	}
	
	loadUser=(data)=>{
		this.setState({
			user:{
				id:data.id,
				name:data.name,
				email:data.email,
				joined:data.joined,
				entries:data.entries
			}
		})
	}
	onInputChange=(event)=>{
		this.setState({input:event.target.value});
	}
	onSubmit=()=>{
		this.setState({imageURL:this.state.input});
		app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
		.then(response=>{
			if(response){
				fetch('http://localhost:1994/image',{
					method:'put',
					headers:{'Content-Type':'application/json'},
					body:JSON.stringify({
					id:this.state.user.id
					})
				})
				.then(response=>response.json())
				.then(count=>{
					this.setState(Object.assign(this.state.user,{entries:count}))
				})
			}
			this.displaybox(this.calcbox(response));
		})
	    
	}
	calcbox=(data)=>{
		const boxdimensions=data.outputs[0].data.regions[0].region_info.bounding_box;
		const image=document.getElementById('inputimage');
		const width=Number(image.width);
		const height=Number(image.height);
		return{
			leftcol:boxdimensions.left_col*width,
			toprow:boxdimensions.top_row*height,
			rightcol:width-(boxdimensions.right_col*width),
			bottomrow:height-(boxdimensions.bottom_row*height)
		}	
	}
	displaybox=(box)=>{
		this.setState({box:box});
	}
	onRoutechange=(value)=>{
		if(value==='signout'){
			this.setState({isSignedin:false});
		}
		else if(value=== 'home'){
			this.setState({isSignedin:true});
		}
		this.setState({route:value});
	}
  render() {
    return (
      <div className="App">
      <Particles className="particlecss"
              params={particle_parameters}
        />
        <Navigation onRoutechange={this.onRoutechange} isSignedin={this.state.isSignedin}/>
        {
	        this.state.route==='home'
	        ?
	    	<div>
		        <Logo/>
		       	<Rank name={this.state.user.name} entries={this.state.user.entries}/>
		        <ImageLinkForm 
		        onInputChange={this.onInputChange} 
		        onSubmit={this.onSubmit}
		        />
		        <FaceRecognition  imageURL={this.state.imageURL} box={this.state.box}/>
		    </div>
      		:
      		(
      			this.state.route=== 'signin' 
      			?
      			<Signin loadUser={this.loadUser} onRoutechange={this.onRoutechange}/>
      			:
      			<Register loadUser={this.loadUser} onRoutechange={this.onRoutechange}/>
      		)
      	}
      </div>
    );
  }
}

export default App;
