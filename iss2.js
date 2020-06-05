/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');
const fetchMyIP = function(callback) { 
  // use request to fetch IP address from JSON API
  const URLIP = `https://api.ipify.org?format=json`;
  request(URLIP, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = JSON.parse(body);
    const ipAddress = data["ip"];
    callback(null, ipAddress);
  });
};
const fetchCoordsByIP = function (ip, callback) {
  //const URLForCoord = `https://ipvigilante.com/${ip}`;
  request( `https://ipvigilante.com/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }   
    const { latitude, longitude } = JSON.parse(body).data; 
      callback(null, { latitude, longitude });
  });
}; 
/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS pass times: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = JSON.parse(body);
    //console.log(data);
    const passes = data.response;
    callback(null, passes);
  });
};
module.exports = { 
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes
 };

/*const fetchCoordsByIP = function(ip, callback) {
  const URLForCoord = `https://ipvigilante.com/json/${ip}`;
  request(URLForCoord, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const info = JSON.parse(body);
    let coordinates = {};
    coordinates[`latitude`] = info.data.latitude;
    coordinates[`longitude`] = info.data.longitude;
    callback(null, coordinates);
    const info = JSON.parse(body);
    console.log(info);
    coordinates['latitude'] = info['latitude'];
    coordinates['longitude'] = info['longitude'];
    callback(null, coordinates);
    
  });
};


*/

