// declaration the variables



// 1. selector and declaration variables
let mainContainer = document.getElementById("mainContainer");
let category = document.querySelector(".category");
let cantrols = document.querySelector(".cantrols");
let sliderContainer = document.querySelector(".slide-container");
let slide = document.querySelector(".slid-card");
let mainPoster = document.querySelectorAll(".main-poster");
let wrapper = document.querySelector(".wrapper");
let cardWrapper = document.querySelector(".card-wraper");
let closePlaylist = document.querySelector("#close-playlist");
let upSongContainer = document.querySelector(".up-song-container");
let upSongCardContainer = document.querySelector(".song-list");
let footer = document.querySelector(".footer");
let music = new Audio("audio/pathaan.mp3");

// 2. music cantrols and buttons variables
let playBtn = document.getElementById("play");
let pervious = document.getElementById("backward");
let next = document.getElementById("forward");
let audioLoop = document.getElementById("loop");
let audioShuffle = document.getElementById("shuffle");
let songSlider = document.getElementById("songSlider");
let volumeBtn = document.getElementById("volume");
let volumeBar = document.getElementById("volume-bar");
let upSongList = document.getElementById("upcoming-song-list");
let playBTn1 = document.getElementsByClassName("play-btn")[0];
let playBTn2 = document.getElementsByClassName("play-btn")[1];
let goBack = document.getElementById("go-back");
let listPlayBtn = document.getElementById("list-play");

// 3. song detail variables
let currentSongPoster = document.getElementById("currentSongPoster");
let currentSongName = document.getElementById("current-song");
let currentSongMovie = document.getElementById("current-song-movie");
let songCurrentTime = document.getElementById("current-time");
let songDuration = document.getElementById("song-length");
let upNextSong = document.querySelector(".up-song-name");

// 4. flag and important data variables
let counter = 1;
let PauseSong = true;
let shuffle = false;
let songData = "";
let songCategoryPosition = 0;
let songPosition = 0;
let currentPage = "main";


// functions and main logic

// ************************************ main page ***************************************

//  auto scroll cards slider

let slideWidth = slide.scrollWidth;
sliderContainer.scrollLeft = slideWidth * 0.5;

const slider = () => {
  if (counter != 9) {
    sliderContainer.style = `scroll-behavior: smooth`;
    sliderContainer.scrollLeft += slideWidth;
    counter++;
  } else {
    sliderContainer.style = `scroll-behavior: auto`;
    sliderContainer.scrollLeft = slideWidth * 0.5;
    sliderContainer.style = `scroll-behavior: smooth`;
    sliderContainer.scrollLeft = slideWidth * 1.5;
    counter = 2;
  }
};

setInterval(() => {
  slider();
}, 5000);

//   page load event

window.addEventListener("load", pageLoad);
function pageLoad() {
  // fetch data from json
  let data = fetch("gaana.json");

  data
    .then((res) => res.json())

    .then((res) => {
      let data = res.songs;
      songData = data;

      createSection(data);
    })

    .catch((error) => {
      console.log(error);
    });
}

//   create the song categorys section

function createSection(data) {
  // forEach for gate all categorys
  let categoryPosition = 0;
  data.forEach((element) => {
    // create the song cards

    let songCard = "";
    let i = 0;
    element.songList.forEach((list) => {
      songCard += `<div class="song-card" onclick="songDetail('${categoryPosition},${i}')">
        <div class="img-container">
          <img
          src=${list.poster}
          alt=${list.title}
        />
        <div class="play-svg-container">
          <img src="/images/play.svg" alt="" class="play-svg">
        </div>
        </div>
        <h4 class="song-name">${list.title}</h4>
      </div>`;
      i++;
    });
    categoryPosition++;

    // create the song container for the song card

    let div = document.createElement("div");
    div.className = "song-category";
    div.innerHTML = `
      <h2 class="category-name">${element.category}</h2>
        <div class="song-list">
        <i class="fa-solid fa-chevron-left scroll-btn scroll-left" onclick="scrolLeft(event.target)"></i>
        <i class="fa-solid fa-chevron-right scroll-btn scroll-right" onclick="scrollRight(event.target)"></i>
          ${songCard}
        </div>
      `;

    // append the category sections in DOM
    mainContainer.append(div);
  });
}

//   current play song details

function songDetail(songDetail) {
  songCategoryPosition = songDetail.split(",")[0];
  songPosition = songDetail.split(",")[1];
  if (songData[songCategoryPosition].songList[songPosition].type == "music") {
    let currentSong =
      songData[songCategoryPosition].songList[songPosition].song;
    playSong(songCategoryPosition, songPosition);
  } else {
    songCategoryPosition = 0;
    songPosition = 0;
    playlistPage(songCategoryPosition, songPosition);
  }
}

//   play song and ubdate current song data

function playSong(songCategoryPosition, songPosition) {
  // ubdate current song poster
  currentSongPoster.src =
    songData[songCategoryPosition].songList[songPosition].poster;

  // ubdate current song name
  currentSongName.innerHTML =
    songData[songCategoryPosition].songList[songPosition].title;

  // ubdate current song movie name
  currentSongMovie.innerHTML =
    songData[songCategoryPosition].songList[songPosition].movie;

  // ubdate the next song
  if (songPosition < songData[songCategoryPosition].songList.length - 1) {
    upNextSong.innerHTML =
      songData[songCategoryPosition].songList[Number(songPosition) + 1].title;
  } else {
    upNextSong.innerHTML =
      songData[songCategoryPosition].songList[Number(songPosition)].title;
  }

  // ubdate and play the song
  music.src = songData[songCategoryPosition].songList[songPosition].song;
  music.play();
  playBtn.classList.replace("fa-circle-play", "fa-circle-pause");
  PauseSong = false;
}

//   buttons and cantrols

// scrollin left or right onClick button in song list

function scrollRight(e) {
  e.parentElement.scrollLeft += 1000;
}
function scrolLeft(e) {
  e.parentElement.scrollLeft -= 1000;
}

// defolt play song and play pause the play button

playBtn.addEventListener("click", btnClickPlay);
function btnClickPlay() {
  if (PauseSong) {
    music.currentTime == 0 ? playSong(0, 0) : music.play();
    playBtn.classList.replace("fa-circle-play", "fa-circle-pause");
    listPlayBtn.classList.replace("fa-circle-play", "fa-circle-pause");
    playBTn1.innerHTML = "Pause";
    playBTn2.innerHTML = "Pause";
    PauseSong = false;
  } else {
    music.pause();
    playBtn.classList.replace("fa-circle-pause", "fa-circle-play");
    listPlayBtn.classList.replace("fa-circle-pause", "fa-circle-play");
    playBTn1.innerHTML = "Play All";
    playBTn2.innerHTML = "Play All";
    PauseSong = true;
  }
}

// previous song change

pervious.addEventListener("click", () => {
  if (songPosition >= 1) {
    songPosition--;
    playSong(songCategoryPosition, songPosition);
  }
});

// next song change

next.addEventListener("click", () => {
  if (songPosition < songData[songCategoryPosition].songList.length - 1) {
    songPosition++;
    playSong(songCategoryPosition, songPosition);
  }
});

// audio loop

audioLoop.addEventListener("click", () => {
  if (music.loop) {
    audioLoop.style.color = "#e7e6e6";
    music.loop = false;
  } else {
    audioLoop.style.color = "#e72c30";
    music.loop = true;
  }
});

// audio shuffle

audioShuffle.addEventListener("click", () => {
  if (shuffle) {
    audioShuffle.style.color = "#e7e6e6";
    shuffle = false;
  } else {
    audioShuffle.style.color = "#e72c30";
    shuffle = true;
  }
});

// ubdate current time of the song and song slider
music.addEventListener("timeupdate", () => {
  let currentTime = Math.floor(music.currentTime);
  let minutes = Math.floor(currentTime / 60);
  let seconds = currentTime % 60;

  let minutesStr = minutes.toString().padStart(2, "0");
  let secondsStr = seconds.toString().padStart(2, "0");

  songCurrentTime.innerHTML = `${minutesStr}:${secondsStr}`;
  // song slider ubdate
  songSlider.value = (music.currentTime / music.duration) * 100;
  // ubdate up song list
  document.querySelector(
    ".current-time"
  ).innerHTML = `${minutesStr}:${secondsStr}`;
  document.querySelector(".slider").value =
    (music.currentTime / music.duration) * 100;
});

// ubdate the song duration
music.addEventListener("loadedmetadata", () => {
  let duration = Math.floor(music.duration);
  let minutes = Math.floor(duration / 60);
  let seconds = duration % 60;

  let minutesStr = minutes.toString().padStart(2, "0");
  let secondsStr = seconds.toString().padStart(2, "0");

  // ubdate up song list
  songDuration.innerHTML = `${minutesStr}:${secondsStr}`;
  document.querySelector(
    ".song-duration"
  ).innerHTML = `${minutesStr}:${secondsStr}`;
});

// slider audio time change
songSlider.addEventListener("input", function () {
  music.currentTime = music.duration * (songSlider.value / 100);
});

// volume bar
volumeBar.addEventListener("input", () => {
  music.volume = volumeBar.value / 100;
});

// *********************************** playlist page *********************************

// close playlist page
closePlaylist.addEventListener("click", () => {
  currentPage = "main";
  mainContainer.style = "display: block";
  category.style = "display: block";
  wrapper.style = "display: none";
});

//   open playlist page and create song card

function playlistPage(songCategoryPosition, songPosition) {
  currentPage = "playlist";
  wrapper.style = "display: block";
  mainContainer.style = "display: none";
  category.style = "display: none";
  window.scrollBy(0, -1000);

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 270) {
      document.querySelector(".hide-container").style.display = "block";
    } else {
      document.querySelector(".hide-container").style.display = "none";
    }
  });

  // playlist main posters
  mainPoster[0].src =
    songData[songCategoryPosition].songList[songPosition].poster;
  mainPoster[1].src =
    songData[songCategoryPosition].songList[songPosition].poster;

  // create song cards
  let songCard = "";
  songData[0].songList.forEach((element, i) => {
    songCard += `<div class="list-song-card" onclick="songDetail('${0},${i}')">
 <span class="index">${i + 1}</span>
 <div class="song-detail">
   <img src=${element.poster} alt="${element.title}" />
   <div class="name-container">
     <h4 class="song-name">${element.title}</h4>
     <p class="artist-name">${element.artist}</p>
   </div>
 </div>
 <p class="movie-name">${element.movie}</p>
 <i class="fa-regular fa-heart"></i>
 <i class="fa-solid fa-ellipsis-vertical"></i>
 <span class="list-song-duration">00:00</span>
</div>`;
  });
  cardWrapper.innerHTML = songCard;
}

playBTn1.addEventListener("click", btnClickPlay);
playBTn2.addEventListener("click", btnClickPlay);

// ****************************** up song page *************************************

// back to main page
goBack.addEventListener("click", () => {
  currentPage = "main";
  mainContainer.style = "display: block";
  cantrols.style = "display: block;display:flex";
  category.style = "display: block";
  wrapper.style = "display: none";
  upSongContainer.style = "display: none";
  footer.style = "display: block";
});

// go to upSongList page
upSongList.addEventListener("click", () => {
  currentPage = "upSongList";
  mainContainer.style = "display: none";
  category.style = "display: none";
  wrapper.style = "display: none";
  cantrols.style = "display: none";
  upSongContainer.style = "display: block;display:flex";
  footer.style = "display: none";

  // upSongCard create
  let upSongCard = "";
  songData[songCategoryPosition].songList.forEach((element, i) => {
    upSongCard += `<div class="up-song-list" song-position = "${1},${i}" draggable="true">
  <i class="fa-solid fa-bars"></i>
  <img src=${element.poster} alt="${element.title}" />
  <div class="list-song-detail">
    <div class="list-song-name">${element.title}</div>
    <div class="list-movie">${element.movie}</div>
  </div>
  <i class="fa-solid fa-xmark"></i>
  <i class="fa-solid fa-ellipsis-vertical"></i>
  <span class="list-song-duration">00:00</span>
</div>`;
  });
  upSongCardContainer.innerHTML = upSongCard;

  // drag animation
  new Sortable(upSongCardContainer, {
    animation: 200,
  });

  let arr = [];
  let currentChild = "0";
  let dCPosition = songCategoryPosition;
  let dSongP = 0;

  // function for give song detail and play function calling
  function dragPlay(currentChild) {
    let dragSongPosition = document
      .getElementById(currentChild)
      .getAttribute("song-position");
    let positionArr = dragSongPosition.split(",");
    // dCPosition = Number(positionArr[0]);
    dSongP = Number(positionArr[1]);
    playSong(dCPosition, dSongP);
    ubdateDetail(dCPosition, dSongP);
  }

  // foreach for addeventlistner and give id
  upSongCardContainer.childNodes.forEach((element, i) => {
    element.id = i;
    arr.push(element.id);
    element.addEventListener("click", () => {
      currentChild = element.id;
      dragPlay(element.id);
      listPlayBtn.classList.replace("fa-circle-play", "fa-circle-pause");
    });
  });

  // rearrange id on drag over
  upSongCardContainer.addEventListener("dragend", () => {
    arr = [];
    upSongCardContainer.childNodes.forEach((element, i) => {
      arr.push(element.id);
    });
  });

  // ubdate song name and poster etc
  ubdateDetail(songCategoryPosition, songPosition);
  function ubdateDetail(dCPosition, dSongP) {
    let songPath = songData[songCategoryPosition].songList[dSongP];
    document.querySelector(".up-song-card img").src = songPath.poster;
    document.querySelector(".up-song-card .song-detail .song-name").innerHTML =
      songPath.title;
    document.querySelector(
      ".up-song-card .song-detail .artist-name"
    ).innerHTML = songPath.artist;
  }

  // play button
  listPlayBtn.addEventListener("click", btnClickPlay);

  // previous song play button
  document.getElementById("list-backward").addEventListener("click", () => {
    if (arr.indexOf(currentChild) >= 1) {
      let crrPlay = arr.indexOf(currentChild);
      let prePlay = crrPlay - 1;
      currentChild = arr[prePlay];
      dragPlay(arr[prePlay]);
    }
  });

  // next song play button
  document.getElementById("list-forward").addEventListener("click", () => {
    if (arr.indexOf(currentChild) < arr.length - 1) {
      let crrPlay = arr.indexOf(currentChild);
      let nextPlay = crrPlay + 1;
      currentChild = arr[nextPlay];
      dragPlay(arr[nextPlay]);
    }
  });

  // slider to song current time change
  document.querySelector(".slider").addEventListener("input", function () {
    music.currentTime =
      music.duration * (document.querySelector(".slider").value / 100);
  });

  // music loop
  document.querySelector('.loop').addEventListener("click", () => {
    if (music.loop) {
      document.querySelector('.loop').style.color = "#e7e6e6";
      music.loop = false;
    } else {
      document.querySelector('.loop').style.color = "#e72c30";
      music.loop = true;
    }
  });
});
