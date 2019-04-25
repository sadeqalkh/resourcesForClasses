/*
	Server to trigger a local Rube Goldberg machine, when it receives a
	signal from the remote site that is its predecessor:

	- receiver waits for an HTTP request, and sends back an HTTP response.
	- receiver can either start the local machine immediately, or start a 
		countdown until it starts. 
		The countdown means you can run it in your own primetime.
  - if the receiver gets another request during the countdown, 
		it just responds with the remaining time.
  - at the end of the countdown, the receiver starts the machine.
  
	Context: node.js

	Based on many things:
	- Blink example at 
		https://www.w3schools.com/nodejs/nodejs_raspberrypi_blinking_led.asp

	Created 25 April 2019
	by Michael Shiloh
*/

/* HTTP server talks to browser */
const http = require('http')
const express = require('express'); // web server application
const app = express();        // instantiate express server
const httpServer = http.Server(app);  // connects http library to server
const HTTP_SERVER_PORT = 8000; 

var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(4, 'out'); //use GPIO pin 4, and specify that it is output

// Express creates the simple web page
// The argument says where to find pages and scripts
app.use(express.static('public'));  

/* HTTP callback functions */

httpServer.listen(HTTP_SERVER_PORT, () => {
  console.log('httpServer: Listening at', httpServer.address());
  LED.writeSync(0); // Turn LED off
});

httpServer.on('connection', () => {
  console.log("httpServer: An HTTP client has connected")
  //var blinkInterval = setInterval(blinkLED, 250); //run the blinkLED function every 250ms
  //setTimeout(endBlink, 5000); //stop blinking after 5 seconds

  // now check the time, and if it's not time yet, don't blink
  var currtime = Date.now();
  console.log(currtime );

  // if it's time to run, do it
  //if (compare the current time to the desired time) {
    LED.writeSync(1); //set pin state to 1 (turn LED on)
  //}


});


/*
function blinkLED() { //function to start blinking
  if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
    LED.writeSync(1); //set pin state to 1 (turn LED on)
  } else {
    LED.writeSync(0); //set pin state to 0 (turn LED off)
  }
}

function endBlink() { //function to stop blinking
  clearInterval(blinkInterval); // Stop blink intervals
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport GPIO to free resources
}
*/