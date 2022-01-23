/*SEARCH BY USING A CITY NAME (e.g. athens) OR A COMMA-SEPARATED CITY NAME ALONG WITH THE COUNTRY CODE (e.g. athens,gr)*/
const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");
const hider = document.querySelector(".page-footer .hider");
// const testBt = document.getElementsByClassName("buttonPress")[0];
// console.log(list);
/*SUBSCRIBE HERE FOR API KEY: https://home.openweathermap.org/users/sign_up*/
const apiKey = "ad5bec3ecba1f605b73a79110be9cf78";

form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;

  //check if there's already a city
  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);
  console.log(listItemsArray);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter(el => {
      let content = "";
      //athens,gr
      if (inputVal.includes(",")) {
        //athens,grrrrrr->invalid country code, so we keep only the first part of inputVal
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        //athens
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
      } ...otherwise be more specific by providing the country code as well 😉`;
      form.reset();
      input.focus();
      return;
    }
  }
  
  //ajax here
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;
  
  fetch(url)
  .then(response => response.json())
  .then(data => {
      const { main, name, sys, weather } = data;
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        weather[0]["icon"]
      }.svg`;

      const li = document.createElement("li");
      li.classList.add("city");
      const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${
        weather[0]["description"]
      }">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      `;
      li.innerHTML = markup;
      list.innerHTML = "";
      list.appendChild(li);
      hider.style = "display: block";
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city 😩";
    });

  msg.textContent = "";
  form.reset();
  input.focus();
});

// testBt.addEventListener("click", () => {
//   const topCities = ["Karachi", "Lahore", "Islamabad"];
//   topCities.forEach(fetchCityInfo);
  
//   function fetchCityInfo(city) {
//     const urlFresh = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
//     fetch(urlFresh)
//     .then(response => response.json())
//     .then(data => {
//       // const { main, name, sys, weather } = data;
//       console.log(data);
//       // const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
//       //   weather[0]["icon"]
//       // }.svg`;
  
//       // const li = document.createElement("li");
//       // li.classList.add("city");
//       // const markup = `
//       //   <h2 class="city-name" data-name="${name},${sys.country}">
//       //     <span>${name}</span>
//       //     <sup>${sys.country}</sup>
//       //   </h2>
//       //   <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
//       //   <figure>
//       //     <img class="city-icon" src="${icon}" alt="${
//       //   weather[0]["description"]
//       // }">
//       //     <figcaption>${weather[0]["description"]}</figcaption>
//       //   </figure>
//       // `;
//       // li.innerHTML = markup;
//       // list.appendChild(li);
//     })
//     .catch(console.log('Error'));
//   };
// });

const topCities = ["Karachi", "Lahore", "Islamabad"];
topCities.forEach(fetchCityInfo);

function fetchCityInfo(city) {
  const urlFresh = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetch(urlFresh)
  .then(response => response.json())
  .then(data => {
    const { main, name, sys, weather } = data;
    console.log(main, name, sys, weather);
    const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
      weather[0]["icon"]
    }.svg`;

    const li = document.createElement("li");
    li.classList.add("city");
    const markup = `
      <h2 class="city-name" data-name="${name},${sys.country}">
        <span>${name}</span>
        <sup>${sys.country}</sup>
      </h2>
      <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
      <figure>
        <img class="city-icon" src="${icon}" alt="${
      weather[0]["description"]
    }">
        <figcaption>${weather[0]["description"]}</figcaption>
      </figure>
    `;
    li.innerHTML = markup;
    list.appendChild(li);
  })
  .catch(console.log('Error'));
};

// $.get('result.html').then(function(responseData) {
//   //responseData is the contents of the other page. Do whatever you want with it.
//   // $('#someElem').append(responseData);
//   console.log(responseData);
// });