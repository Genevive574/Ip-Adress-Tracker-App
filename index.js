const ipAddress = document.getElementById("ipAddress");
const ipLocation = document.getElementById("location");
const timezone = document.getElementById("timezone");
const isp = document.getElementById("isp");
const form = document.querySelector('form');
const myMap = L.map('map').setView([51.505, -0.09], 13);


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(myMap);


const myIcon = L.icon({
  iconUrl: 'images/icon-location.svg',
  iconSize: [40, 50],
  iconAnchor: [20, 25],
})

let myMarker


const mapDisplay = (lat, lng) => {
  myMap.setView([lat, lng], 16)

  
  if (myMarker != null) myMarker.remove()

  myMarker = L.marker([lat, lng], { icon: myIcon })

  myMarker.addTo(myMap)
}
  

const getData = (inputValue = '', searchType = 'IP') => {
  const timestamp = new Date().getTime();
  const url =
    searchType === 'IP'
    ? `https://geo.ipify.org/api/v2/country,city?apiKey=at_Im3vFXZJXL4EUAVPlWa4jSmOgcQOt&ipAddress=${inputValue}&timestamp=${timestamp}`
    : `https://geo.ipify.org/api/v2/country,city?apiKey=at_Im3vFXZJXL4EUAVPlWa4jSmOgcQOt&domain=${inputValue}&timestamp=${timestamp}`

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
    ipAddress.innerText = data.ip;
    ipLocation.innerText = `${data.location.region}, ${data.location.city}`;
    timezone.innerText = `UTC ${data.location.timezone}`;
    isp.innerText = data.isp;
    mapDisplay(data.location.lat, data.location.lng);
  })
  .catch((error) => {
    ipAddress.innerText = '__';
    ipLocation.innerText = '__';
    timezone.innerText = '__';
    isp.innerText = '__';

    const myInput = form.ipInput;
    myInput.classList.add('error');

    setTimeout(() => myInput.classList.remove('error'), 3000);
    console.error(error)
  })
}

const regexIp = /^\b([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b(\.\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b){3}$/
const regexDomain = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/


form.addEventListener('submit', (e) => {
  e.preventDefault()

  const myInput = form.ipInput

  if (myInput.value.match(regexIp)) {
    getData(myInput.value);
  }

  if (myInput.value.match(regexDomain)) {
    getData(myInput.value,  'DOMAIN');
  }

  if (!myInput.value.match(regexDomain) && !myInput.value.match(regexIp)) {
    myInput.classList.add('error')

    setTimeout(() => myInput.classList.remove('error'), 3000)
  }


  form.reset();
});
  

getData()