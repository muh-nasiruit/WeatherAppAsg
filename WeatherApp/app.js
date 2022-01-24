const main_form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const error_msg = document.querySelector(".top-banner .msg");
const cityList = document.querySelector(".ajax-section .cities");
const hider = document.querySelector(".page-footer .hider");

const apiKey = "15a0e5073fff698667328d64e23983ac";
let topCitiesAPIResult = [];
let counter = 0;
let counter2 = 0;

// On load/start
const topCities = ["Karachi", "Lahore", "Islamabad"];

for (let i = 0; i < topCities.length; i++) {
  fetchCityInfo(topCities[i]);
}

function fetchCityInfo(city) {
  const urlFresh = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetch(urlFresh)
  .then(response => response.json())
  .then(data => {
    topCitiesAPIResult.push(data);
    
    const { main, name, sys, weather } = data;

    const li = document.createElement("li");
    li.classList.add("city");

    li.innerHTML = dataProcessor(main, name, sys, weather);
    cityList.appendChild(li);
    counter += 1;
    // Saving to local storage
    if (counter == 3) {
      localStorage.setItem('topCitiesPK', JSON.stringify(topCitiesAPIResult));
      // retrieved using JSON.parse(localStorage.topCitiesPK)
    }
  })
  .catch(() => {
    if (!(localStorage.topCitiesPK)) {
      error_msg.textContent = "Data retrieval failed!";
      return;
    }
    if (localStorage.topCitiesPK) {
      const newCities = JSON.parse(localStorage.topCitiesPK);
      if (newCities.length === 3) {
        // console.log(JSON.parse(localStorage.topCitiesPK));
        if (counter === 0) localDataProcess(newCities)
        counter += 1
        return;
      }
    }
  });
};

// Retrieves data from local storage (error or no network)
function localDataProcess(arr) {
  for (let i = 0; i < arr.length; i++) {
    const { main, name, sys, weather } = arr[i];
    
    const li = document.createElement("li");
    li.classList.add("city");
    
    li.innerHTML = dataProcessor(main, name, sys, weather);
    cityList.appendChild(li);
  }
}

// On search click
main_form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;

  //check if there's already a city
  const listItems = cityList.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);
  // console.log(listItemsArray);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter(el => {
      let content = "";
      if (inputVal.includes(",")) {
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      error_msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
      } ...otherwise be more specific by providing the country code as well`;
      main_form.reset();
      input.focus();
      return;
    }
  }
  
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;
  
  fetch(url)
  .then(response => response.json())
  .then(data => {
      // Storing searched city data to local storage
      localStorage.setItem('searchedCity', JSON.stringify(data));
      const { main, name, sys, weather } = data;

      const li = document.createElement("li");
      li.classList.add("city");

      li.innerHTML = dataProcessor(main, name, sys, weather);
      cityList.innerHTML = "";
      cityList.appendChild(li);
      hider.style = "display: block";
      // console.log(localStorage);
    })
    .catch(() => {
      error_msg.textContent = "Please enter a valid city.";
    });

  error_msg.textContent = "";
  main_form.reset();
  input.focus();
});

// returns markup of the processed data
function dataProcessor(main, name, sys, weather) {
  const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
    weather[0]["icon"]
  }.svg`;

  const markup = `
  <h2 class="city-name" data-name="${name},${sys.country}">
  <span>${name}</span>
  <sup>${sys.country}</sup>
  </h2>
  <div class="city-temp">${Math.round(main.temp)}<sup><sup>o</sup>C</sup></div>
  <figure>
  <img class="city-icon" src="${icon}" alt="${
    weather[0]["description"]
  }">
  <figcaption>${weather[0]["description"]}</figcaption>
  </figure>
  `;
  return markup;
};