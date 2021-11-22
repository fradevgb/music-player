const wrapper = document.querySelector('.wrapper');
const musicImg = wrapper.querySelector('.img-area img');
const musicName = wrapper.querySelector('.song-details .name');
const musicArtist = wrapper.querySelector('.song-details .artist');
const playPauseBtn = wrapper.querySelector('.play-pause');
const prevBtn = wrapper.querySelector('#prev');
const nextBtn = wrapper.querySelector('#next');
const mainAudio = wrapper.querySelector('#main-audio');
const progressArea = wrapper.querySelector('.progress-area');
const progressBar = wrapper.querySelector('.progress-bar');
const musicList = wrapper.querySelector('.music-list');
const moreMusicBtn = wrapper.querySelector('#more-music');
const closeMoreMusic = wrapper.querySelector('#close');
const repeatBtn = wrapper.querySelector('#repeat-plist');

let musicIndex = Math.floor(Math.random() * allMusic.length + 1);
let isMusicPaused = true;

window.addEventListener('load', () => {
  loadMusic(musicIndex);
});

function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `images/${allMusic[indexNumb - 1].src}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

/* play music function */
function playMusic() {
  wrapper.classList.add('paused');
  playPauseBtn.querySelector('i').innerText = 'pause';
  mainAudio.play();
}

/* pause music function */
function pauseMusic() {
  wrapper.classList.remove('paused');
  playPauseBtn.querySelector('i').innerText = 'play_arrow';
  mainAudio.pause();
}

/* prev music function */
function prevMusic() {
  musicIndex--;
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

/* next music function */
function nextMusic() {
  musicIndex++;
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

/* play or pause button event */
playPauseBtn.addEventListener('click', () => {
  const isMusicPlay = wrapper.classList.contains('paused');
  isMusicPlay ? pauseMusic() : playMusic();
  playingSong();
});

prevBtn.addEventListener('click', () => {
  prevMusic();
});

nextBtn.addEventListener('click', () => {
  nextMusic();
});

mainAudio.addEventListener('timeupdate', (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;

  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector('.current-time'),
    musicDuration = wrapper.querySelector('.max-duration');

  mainAudio.addEventListener('loadeddata', () => {
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });

  //update playing song current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener('click', (e) => {
  let progressWidth = progressArea.clientWidth;
  console.log({ progressWidth });
  let clickedOffsetX = e.offsetX;
  console.log(clickedOffsetX);
  let songDuration = mainAudio.duration;
  console.log(songDuration);

  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic();
  playingSong();
});

repeatBtn.addEventListener('click', () => {
  let getText = repeatBtn.innerText;

  switch (getText) {
    case 'repeat':
      repeatBtn.innerText = 'repeat_one';
      repeatBtn.setAttribute('title', 'Song looped');
      break;
    case 'repeat_one':
      repeatBtn.innerText = 'shuffle';
      repeatBtn.setAttribute('title', 'Playback Shuffled');
      break;
    case 'shuffle':
      repeatBtn.innerText = 'repeat';
      repeatBtn.setAttribute('title', 'Playlist looped');
      break;
  }
});

mainAudio.addEventListener('ended', () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case 'repeat':
      nextMusic();
      break;
    case 'repeat_one':
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case 'shuffle':
      let randIndex = Math.floor(Math.random() * allMusic.length + 1);
      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex == randIndex);
      musicIndex = randIndex;
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});
