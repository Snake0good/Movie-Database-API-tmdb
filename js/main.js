let API_KEY = config.API_KEY

let fetchedMovies = false;
//Example fetch using pokemonapi.co
document.querySelector('#random').addEventListener('click', () => {
  fetchedMovies = true;
  getRandomChoice()
})


function getRandomChoice(){
  // const choice = document.querySelector('#search-box').value.trim()
  // console.log(choice)

  let pageNum = Math.ceil(Math.random() * 495)

  console.log('pageNum', pageNum)
  const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${pageNum}`


  const baseImgUrl = `https://image.tmdb.org/t/p/w500/`

  // quick-fix => clear the 20 movies
  document.querySelector('.movie-container').innerHTML = ``

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)

        

        let movieList = data.results
        // get results of popular movies
        movieList.map((movie, index) => {
          let newMovieDiv = document.createElement('div')
          newMovieDiv.classList.add('single-movie')

          // below you're deleting ${index} before ${pageNum}
          newMovieDiv.innerHTML = `
            <img class="movie-pic index-${index}${pageNum}" src="" alt="">
              <div class="bottom-movie">
                <h2 class="movie-name movie-name-${index}${pageNum}">Movie</h2>
                <h3><span class="rating rating-${index}${pageNum}"></span></h3>
                <p class="desc show-desc desc-${index}${pageNum}">description</p>
                <p class="hidden movie-id-${index}${pageNum}"></p>
            </div>
          `

          document.querySelector('.movie-container').appendChild(newMovieDiv)

          // load pic, title, rating, description in the list of movies
          if(movieList[index].poster_path === null) {
            document.querySelector(`.index-${index}${pageNum}`).src = `${baseImgUrl}${movieList[index].backdrop_path}`
          } else {
            document.querySelector(`.index-${index}${pageNum}`).src = `${baseImgUrl}${movieList[index].poster_path}`
          }
          document.querySelector(`.movie-name-${index}${pageNum}`).textContent = movieList[index].title
          document.querySelector(`.rating-${index}${pageNum}`).textContent = movieList[index].vote_average
          document.querySelector(`.desc-${index}${pageNum}`).textContent = movieList[index].overview
          document.querySelector(`.movie-id-${index}${pageNum}`).textContent = movieList[index].id


        })

        displayBigMovie(movieList, pageNum);


      })
      .catch(err => {
          console.log(`error ${err}`)
      });
      
}





// =========== change the color scheme ========= //
let blackColor = document.querySelector('#black')
let blueColor = document.querySelector('#blue')
let yellowColor = document.querySelector('#yellow')
let greenColor = document.querySelector('#green')
let mainBGColor = document.documentElement.style
let mainTextColor = document.documentElement.style

blackColor.addEventListener('click', function() {
  mainBGColor.setProperty('--main-background-color', 'black')
  mainTextColor.setProperty('--main-text-color', 'yellow')
})
blueColor.addEventListener('click', function() {
  mainBGColor.setProperty('--main-background-color', 'blue')
  mainTextColor.setProperty('--main-text-color', 'white')
})
yellowColor.addEventListener('click', function() {
  mainBGColor.setProperty('--main-background-color', 'yellow')
  mainTextColor.setProperty('--main-text-color', 'black')
})
greenColor.addEventListener('click', function() {
  mainBGColor.setProperty('--main-background-color', 'green')
  mainTextColor.setProperty('--main-text-color', 'white')
})




// ======== close-open the settings page ======== //
const openSettingsButton = document.querySelector('#settings')
const settingsContainer = document.querySelector('#settings-container');

openSettingsButton.addEventListener('click', function() {
  settingsContainer.style.width = '100%'
  settingsContainer.style.paddingLeft = '75px'
})

document.querySelector('#close-settings').addEventListener('click', function() {
  settingsContainer.style.width = '0'
  settingsContainer.style.paddingLeft = '0'
})

// ====== close-opn the profile page ======= //
const openProfileBtn = document.querySelector("#profile")
const profileContainer = document.querySelector("#profile-container")

openProfileBtn.addEventListener('click', function() {
  profileContainer.style.width = '100%'
  profileContainer.style.paddingLeft = '75px'
})

document.querySelector('#close-profile').addEventListener('click', function() {
  profileContainer.style.width = '0'
  profileContainer.style.paddingLeft = '0'
})


document.querySelector('#profile-pic-input').addEventListener('change', (event) => {
  let output = document.querySelector('#profile-pic-img');
  output.src = URL.createObjectURL(event.target.files[0]);
  output.onload = function() {
    URL.revokeObjectURL(output.src) // free memory
  }
}); 






// =========== Full Movie Page ============ //

function displayBigMovie(data, pageNum) {
  console.log('you clicking displayBigMovie')
  console.log(data)
  let movieClicked = document.querySelectorAll('.single-movie')

  if (fetchedMovies === true) {
    console.log(movieClicked.length)
    for(let i=0; i<movieClicked.length; i++) {
      movieClicked[i].addEventListener('click', (e) => {
        document.querySelector('#full-movie-title').innerText = document.querySelector(`.movie-name-${i}${pageNum}`).innerText
        document.querySelector('#full-movie-pic').src = document.querySelector(`.index-${i}${pageNum}`).src
        document.querySelector('#full-movie-description').innerText = document.querySelector(`.desc-${i}${pageNum}`).innerText

        openFullMovie();

        // add the possibility to click and change the color of the heart
        addLoveItListener();


        // this is another API call for the video
        let movie_id = document.querySelector(`.movie-id-${i}${pageNum}`).innerText

        const videoUrl = `https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=${API_KEY}&language=en-US`

        fetch(videoUrl)
            .then(res => res.json()) // parse response as JSON
            .then(data => {
              console.log(data)

              let youtube_id = ""
              for (let i=0; i<data.results.length; i++) {
                if (data.results[i].type==="Teaser") {
                  youtube_id = data.results[i].key
                } else {
                  youtube_id = data.results[0].key
                }
              }


              console.log(data.results[0].key)
              // this is the movie?
              let youtubeLink = `<iframe id="movie-full" width="560" height="315" src="https://www.youtube.com/embed/${youtube_id}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              `
              document.querySelector('#movie-full').innerHTML = youtubeLink


            })
            .catch(err => {
                console.log(`error ${err}`)
        });
      })
    }
  }

  closeFullMovie(); 
}



// ========= Open-Close Full Move Page ======= //
const fullMovieContainer = document.querySelector("#full-movie-page-container")

function closeFullMovie() {
  document.querySelector("#close-full-movie").addEventListener('click', () => {
    fullMovieContainer.style.width = '0'
  })
}


function openFullMovie() {  
  fullMovieContainer.style.width = '100%'
}





////! ===== clicked love it and make the heart red ======= ////
function addLoveItListener() {
  const hearts = document.querySelectorAll('#love-it')
  for (let i=0; i<hearts.length; i++) {
    hearts.addEventListener('click', (e) => {
      hearts[i].classList.toggle('clicked-love-it')
    })
  }
}