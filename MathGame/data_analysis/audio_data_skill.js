// أصوات بسيطة (اختيارية)
const clickSound = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_ae227b42a3.mp3");
const successSound = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_84e61fce5c.mp3");

function playClick(){ clickSound.currentTime=0; clickSound.play(); }
function playSuccess(){ successSound.currentTime=0; successSound.play(); }
