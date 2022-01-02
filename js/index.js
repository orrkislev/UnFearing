// -------------------------------------------
// ----------   FIREBASE   -------------------
// -------------------------------------------
const firebaseConfig = {
	apiKey: "AIzaSyBV6-co92N09b-7saPX9TkKdxkZc6oEMp0",
	authDomain: "unfearing-651e4.firebaseapp.com",
	projectId: "unfearing-651e4",
	storageBucket: "unfearing-651e4.appspot.com",
	messagingSenderId: "757703595803",
	appId: "1:757703595803:web:baaba33adefa395d5025be"
};
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage()



// ------------------------------------------
// --------------- ELEMENTS -----------------
// ------------------------------------------
const mainBtn = $('#movebutton');
const cameraPreview = document.getElementById('camera');
const gifContainer = $('#grid');
const vid = document.getElementById('background');
let isWaiting = false;
let timeouts = {};


// --------------------------------------------
// ------------------ GIFS --------------------
// --------------------------------------------
storageRef = storage.ref('/')
let allGifCount
storageRef.listAll().then((res)=>{
	allGifCount = res.items.length
	res.items.forEach(ref=>{
		ref.getDownloadURL().then(url=>{
			newEl = `<img class='recorded' src='${url}'>`
			gifContainer.append(newEl)
		})
	})
})



// ------------------------------------------
// ------------------ STATES  ---------------
// ------------------------------------------
const states = {START:0,READY:1,WAITING:2,DONE:3}
let state = states.START

mainBtn.click(()=>{
	if (state==states.START){
		console.log('start')
		vid.src = 'video/unfearing-short.mp4'
		startWebcam()
		mainBtn.html('Start Recording');
		state = states.READY
	} else if (state==states.READY){
		mainBtn.click(()=>{});
		state = states.WAITING
		startCountdown()
	}
})

function startDance(){
	vid.currentTime = 0;
	startRecording();
	mainBtn.html('DANCE!')
	setTimeout(endRecording,39000)
}
function endRecording(){
	stopRecording()
	mainBtn.hide()
	cameraPreview.style.display = 'none';
	vid.pause();
	mainBtn.html("Let's move together!")
}


// --------------------------------------------
// ------------------ COUNTDOWN ---------------
// --------------------------------------------
let countdown
function startCountdown(){
	countdown=4
	updateCountdown()
}
function updateCountdown(){
	countdown--
	if (countdown>0){
		mainBtn.html('Ready?! ' + countdown)
		setTimeout(updateCountdown,1000)
	} else {
		startDance()
	}
}



// -----------------------------------------
// ---------------- WEBCAM -----------------
// -----------------------------------------
let camera,recorder

async function startWebcam(){
	camera = await navigator.mediaDevices.getUserMedia({ video: true,el: cameraPreview.id,quality: 2,width: 320,height: 240})
	cameraPreview.srcObject = camera;
	cameraPreview.play();
}

function stopRecordingCallback() {
	storage.ref('/').child((allGifCount+1).toString()+'.gif').put(recorder.getBlob())
	recorder.camera.stop();
	recorder.destroy();
	recorder = null;
}

function startRecording(){
	if (!camera) return
	recorder = RecordRTC(camera, { type: 'gif', frameRate: 12, quality: 1, width: 360, hidden: 240, });
	recorder.startRecording();
	recorder.camera = camera;
};

function stopRecording(){
	recorder.stopRecording(stopRecordingCallback);
}