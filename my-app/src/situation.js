import { timeToSeconds } from "./utilities";

function getPosition(options) {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

async function getSituation() {
  let situation = {};
  let date = new Date();
  situation.now_time = date.toLocaleTimeString("en-US", {
    hour12: false,
  });
  //////////
  situation.now_time = "12:30:00";

  situation.now_time_secs = timeToSeconds(situation.now_time);
  situation.now_day = date.getDay();

  // let now_lat, now_lon;
  const pos = await getPosition();
  situation.now_lat = pos.coords.latitude;
  situation.now_lon = pos.coords.longitude;
  console.log(pos);

  //////////
  situation.now_day = 5;

  situation.now_lat = 34.068963;
  situation.now_lon = -118.442286;

  return situation;
}

export default getSituation;
