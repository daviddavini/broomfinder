export function timeToSeconds(time) {
  let h, m, s;
  [h, m, s] = time.split(":");
  [h, m, s] = [parseInt(h), parseInt(m), parseInt(s)];
  return (h * 60 + m) * 60 + s;
}

export function between(a, b, c) {
  return a <= b && b <= c;
}

export const DAY_CODES = ["U", "M", "T", "W", "R", "F", "S"];
const DAY_STRT_TIME = "00:00:00";
export const DAY_STRT_TIME_SECS = timeToSeconds(DAY_STRT_TIME);
const DAY_STOP_TIME = "23:59:59";
export const DAY_STOP_TIME_SECS = timeToSeconds(DAY_STOP_TIME);

export const BLDG_POSITIONS = {
  "BIO SCI ": {
    latitude: 34.0674,
    longitude: -118.4404,
  },
};

export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
