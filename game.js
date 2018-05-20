var imgPool=[
	'https://picsum.photos/200/?image=1',
	'https://picsum.photos/200/?image=8',
	'https://picsum.photos/200/?image=12',
	'https://picsum.photos/200/?image=16',
	'https://picsum.photos/200/?image=20',
	'https://picsum.photos/200/?image=24',
	'https://picsum.photos/200/?image=28',
	'https://picsum.photos/200/?image=32',
	'https://picsum.photos/200/?image=36',
	'https://picsum.photos/200/?image=40',
	'https://picsum.photos/200/?image=44',
	'https://picsum.photos/200/?image=48',
	'https://picsum.photos/200/?image=52',
	'https://picsum.photos/200/?image=56',
	'https://picsum.photos/200/?image=60',
	'https://picsum.photos/200/?image=64',
	'https://picsum.photos/200/?image=68',
	'https://picsum.photos/200/?image=72',
	'https://picsum.photos/200/?image=76',
	'https://picsum.photos/200/?image=80',
	'https://picsum.photos/200/?image=84',
	'https://picsum.photos/200/?image=88',
	'https://picsum.photos/200/?image=92',
	'https://picsum.photos/200/?image=96',
	'https://picsum.photos/200/?image=100'
]

var choosenPool = [];

var playImgPool = [];

var score=0;

function getRandomImgPool(pool,count){
	var tempArr=pool.slice();
	var processedPool=[]

	for (var i=1; i<=count; i++){
		var rand= Math.floor(Math.random() * tempArr.length) ;
		// processedPool["img"+i]=tempArr[rand];
		processedPool.push(tempArr[rand]);
		tempArr.splice(rand,1);
	}
	return processedPool;
}

document.addEventListener('DOMContentLoaded', ()=>{
	choosenPool=getRandomImgPool(imgPool, 9);
	playImgPool=getRandomImgPool(choosenPool,9)

	var loaderDiv= document.createElement("div");
	loaderDiv.classList.add('loader');

	var rowDiv = document.getElementById("row");

	loadImages(choosenPool).then(
		(data)=>{
			console.log(data);
			showImagesAndStartTimer(data);
			rowDiv.removeChild(loaderDiv);
		}).catch((err)=>{
			console.log(err);
		})

	
	rowDiv.appendChild(loaderDiv);

})

function showImagesAndStartTimer(images){
	var tempImages= images.slice();
	var gridImgDivs=document.getElementsByClassName('grid');
	for (const elem of gridImgDivs){
		elem.children[0].src=tempImages.pop().src;
	}

	var timerDiv = document.getElementById('timer');
	var count=20;
	var id = setInterval(()=>{
		if(count===0){
			clearInterval(id);
			hideGridImages();
			showPlayImg();
			timerDiv.innerHTML='';
		}
		else{
			timerDiv.innerHTML="Images will be gone in "+count;
			count--;
		}
	}, 1000)
}

function hideGridImages(){
	var gridImgDivs = document.getElementsByClassName('grid');
	for (const elem of gridImgDivs){
		elem.children[0].src='./placeholder_play.jpg';
	}
}

function showPlayImg(){
	var randomImgElement = document.getElementById('singleImg');
	randomImgElement.src=playImgPool.pop();
}

function loadImages(pool){
	var count=0;
	var promiseArr=[];
	for (const x of pool){
		
		var promise = new Promise((resolve, reject)=>{
			var image = new Image();

			image.onload = function(){
				resolve(image);
			}

			image.onerror = function(){
				let message ='Could not load image at ' + x;
      			reject(new Error(message))
			}

			image.src=x;
		})

		promiseArr.push(promise);
		count++;
	}
	if(count == pool.length){
		return new Promise((resolve,reject)=>{
			Promise.all(promiseArr).then((imageDataArr)=>{
				resolve(imageDataArr)
			}).catch((err)=> {
				reject(err);
			})
		})
	}
}

function drop(event){
	event.preventDefault();
	var selectedDiv=event.currentTarget;
	selectedDiv.classList.remove('highlight');
	var data=event.dataTransfer.getData("img");

	var randomImgElement = document.getElementById(data);
	var scoreDiv = document.getElementById('score');

	if(randomImgElement.currentSrc == choosenPool[8 - +event.target.parentNode.id ]){
		event.target.src = randomImgElement.currentSrc;

		//show green background effect
		score++;
		scoreDiv.innerHTML = "Total Score: " + score;

		if(score<2){
			//showing next image to play with
			randomImgElement.src = playImgPool.pop();
		}
		else{
			var playImgParent = randomImgElement.parentNode
			while (playImgParent.hasChildNodes()) {
			    playImgParent.removeChild(playImgParent.lastChild);
			}
			// playImgParent.removeChild(randomImgElement);
			var winDiv = document.createElement('div');
			winDiv.classList.add('winner');
			winDiv.appendChild(document.createTextNode('Congrates, You Did it'));

			playImgParent.appendChild(winDiv);

		}

	}
	else{
		var parentNode = event.target.parentNode;
		var wrongDiv = generateSingletonDiv();

		parentNode.appendChild(wrongDiv)
		setTimeout(()=>{
			parentNode.removeChild(wrongDiv)
		},2000)
	}
}

function generateSingletonDiv(){
	if(wrongDiv){
		return wrongDiv;
	}
	var wrongDiv = document.createElement('div');
	var span = document.createElement('span');
	span.classList.add('wrongText');
	span.appendChild(document.createTextNode('Wrong Box'))
	wrongDiv.appendChild(span);
	wrongDiv.classList.add('wrong');
	return wrongDiv;
}

function drag(event){
	event.dataTransfer.setData("img", event.target.id)
}

function allowDrop(ev) {
    ev.preventDefault();
    var selectedDiv=ev.currentTarget;
	selectedDiv.classList.add('highlight');
}

function dragLeave(ev){
    var selectedDiv=ev.currentTarget;
	selectedDiv.classList.remove('highlight');
}