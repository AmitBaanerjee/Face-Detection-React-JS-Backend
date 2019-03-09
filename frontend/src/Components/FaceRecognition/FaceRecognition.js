import React from 'react';
import './FaceRecognition.css';
const FaceRecognition=({imageURL,box})=>{
	return(
		<div className='center ma'>
			<div className='absolute mt2'>	
				<img id='inputimage' src={imageURL} alt='' widhth='300px' height='300px'/>
				<div className='bounding-box' style={{top:box.toprow,right:box.rightcol,bottom:box.bottomrow,left:box.leftcol}}>
				</div>
			</div>
		</div>
		);
}
export default FaceRecognition;