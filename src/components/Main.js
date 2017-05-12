require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//获得图片信息
let imageData = require('json!../sources/imageData.json');

//将真实图片与json数据绑定
imageData = ((imageDataArr) => {
	for (let i = imageDataArr.length - 1; i >= 0; i--) {
		let singleImageData = imageDataArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDataArr[i] = singleImageData;
	}
	return imageDataArr;
})(imageData);

class ImageFigure extends React.Component {
	constructor(props) {
        super(props);  
        
        this.times = 0;
        this.state = {
        	front: true,
        }
    }
    handleClick() {
		 this.props.clicked(this.props.index);
		 this.times++;

		 if(this.times > 1){
		 	 let figure = this.refs.figure;
		 	    

			 if(this.state.front){
				 	figure.style.transform = "translate(-60%,-50%) rotateY(180deg)";
				 	
				 	this.setState({front: false});
			 
			 }else{
				 	figure.style.transform = "translate(-60%,-50%) rotateY(0deg)";
				 	
				 	this.setState({front: true});
			 }
		 }
		 

		 
    }
	componentDidMount() {
		
		
	}
	render() {
		return (
			<figure className="img-figure" ref="figure" onClick={this.handleClick.bind(this)}>
				
					<div className="front">
						<img src={this.props.data.imageURL} />
						<figcaption>
							<h6 className="img-title">{this.props.data.title}</h6>
						</figcaption>
					</div>
					
					<div className="desc">
						{this.props.data.desc}
					</div>
				
			</figure>
		);
	}
}

class ImageGallery extends React.Component {
	constructor(){
		super();

		

		this.state = {
			clicked: {"index":0}
		}
	}
  computePos(arrLength,index) {
  	let xPos = 0,yPos = 0,
  	arrLen = arrLength/2;

  	if(index < arrLen){
    	xPos = Math.pow(((arrLen/2-index > 0)? arrLen/2-index:index-arrLen/2),2)*24;
    	yPos = index*80;
	        	
   	}else{
    	xPos = Math.pow((((arrLength*3)/4-index > 0)? (arrLength*3)/4-index:index-(arrLength*3)/4),2)*24;
    	xPos = this.refs.imgSec.offsetWidth -xPos -300;
    	yPos = (index-6)*80;
	       
	}
	return [xPos,yPos]
  }
  setPos(domNode,index,xPos,yPos,bool=false) {
  	if(!bool){
  		domNode.style = "top:" + yPos + "px;" 
				  + "left:" + xPos + "px;"
				  + "transform: rotate(" + Math.pow(-1,index)*45 + "deg);";
  	}else{
  		domNode.style = "top:" + yPos + "px;" 
						  + "left:" + xPos + "px;"
						  + "transform:translate(-60%,-50%)";
  	}
  	
  }

  setClickedIndex(index) {
  	this.setState({clicked:{"index":index}});
  }
  
  changePos(imageFigures,imgDataLen,index,xPos,yPos) {
  	[xPos,yPos] = this.computePos(imgDataLen,this.state.clicked.index);
	this.setPos(imageFigures[this.state.clicked.index],this.state.clicked.index,xPos,yPos)

	xPos = this.refs.imgSec.offsetWidth/2;
	yPos = this.refs.imgSec.offsetHeight/2;

	this.setPos(imageFigures[index],index,xPos,yPos,true);
	this.setClickedIndex(index);
  }

  componentDidMount() {
	let navBtns = this.refs.controllerNav.getElementsByTagName('li'),
		imageFigures = this.refs.imgSec.children,
		imgDataLen = imageData.length,
		xPos = 0,
		yPos = 0;

		Array.prototype.forEach.call(navBtns,(item,index) => {
			
			[xPos,yPos] = this.computePos(imgDataLen,index);
		    this.setPos(imageFigures[index],index,xPos,yPos);
			

		    item.onclick = () => {
		    	this.changePos(imageFigures,imgDataLen,index,xPos,yPos);
		    }
		    	
			imageFigures[index].onclick = () => {
		    	this.changePos(imageFigures,imgDataLen,index,xPos,yPos);
		    }
		});

		
  }

  render() {
  	let ImageFigures = [],
  		controllerLis = [];
	Array.prototype.forEach.call(imageData,(item,index) => {
			ImageFigures.push(<ImageFigure key={index} 
				data={item} 
				index={index} 
				clicked={this.setClickedIndex.bind(this)}/>);
			controllerLis.push(<li key={index}></li>);
	});
    return (
      <section className="stage">
        <section className="img-sec" ref="imgSec">
        	{ImageFigures}
        </section>
        <nav className="controller-nav">
        	<ul ref="controllerNav">
        		{controllerLis}
        	</ul>
        </nav>
      </section>
    );
  }
}

ImageGallery.defaultProps = {
};

export default ImageGallery;
