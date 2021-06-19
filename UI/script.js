let userID;
let MQTTButton; 
 
let broker = {
  hostname: "",
  port: 443 
} 
  
let client = { 
  clientID: "mqttdriver",
  username: "mqttcar",
  password: ""
}
let dirTopic = "direction";
let idTopic = "ID"
let currentIDTopic = "currentID"
let timerTopic = "timer"

let mqttClient;

let currentUser;
let timer;

function setup() {
  console.log("DOM elements loaded.");
}

/* (triggered on MQTTButton press)
Prompts user to input clientID,
Sets up client lastWill - published on client disconnect,
Initiates client + connects to the broker,
Triggers onConnect upon successful connection */
function MQTTConnect() {
  
  //get inputted name to use as clientID
  client.clientID = window.prompt("Enter your name:");
  while (client.clientID.length < 3) {
    client.clientID = window.prompt("Name must be at least 3 characters long:")
  }
  
  //set up client lastWill
  let lastWill = new Paho.MQTT.Message(client.clientID);
  lastWill.destinationName = "log/userOff";
  
  
  mqttClient = new Paho.MQTT.Client(broker.hostname, broker.port, client.clientID);
  mqttClient.connect({
  onSuccess: onConnect, // callback function for when you connect
  userName: client.username, // username
  password: client.password, // password
  useSSL: true,
  willMessage:lastWill
  });
}

/* (triggered on successful MQTT connection)
Publishes ID to idTopic, 
subscribes to currentID and timer,
initializes callback for when MQTT messages arrive, 
disables MQTTConnect button,
hides intro paragraph, reveals directional buttons */
function onConnect() {
  
  console.log("Connected to MQTT broker.");
  publishID(client.clientID);
  
  mqttClient.subscribe(currentIDTopic);
  
  mqttClient.onMessageArrived = onMessageArrived;
  
  document.getElementById("MQTTButton").disabled = "true";
  
  //replace introP with directional buttons
  for (let i = 0; i < 4; i++) {
    let dirButtons = document.getElementsByClassName("dirButton");
    dirButtons[i].style.visibility = "visible"; 
    document.getElementById("introP").style.visibility = "hidden";
  }
}

/* (triggered when receiving an MQTT message)
If a currentID message, displays the current user in the MQTTButton HTML.
  If YOU are the current user, enables the directional buttons. 
  If you are NOT the current user, disables the directional buttons.
If a timer message, displays remaining time */ 
function onMessageArrived(msg) {
  console.log(msg.destinationName);
  if (msg.destinationName == "currentID") { //if a currentID update:
    currentUser = msg.payloadString;
    if (currentUser == "-1") {
      document.getElementById("MQTTButton").style.fontSize = "15px";
      document.getElementById("MQTTButton").innerHTML = "Car not connected, retry later.";
    } else {
      document.getElementById("MQTTButton").innerHTML = "Current user: " + currentUser;
      if (currentUser == client.clientID) {
        enableButtons();
      } else {
        disableButtons();
      }
    }
    
  } else if (msg.destinationName == "timer") {
    timer = msg.payloadString;
    document.getElementById("timer").innerHTML = "Time remaining: " + timer + "s";
  } 
}

//triggered on successful MQTT connection: publishes clientID to idTopic
function publishID(id) {
  let idMessage = new Paho.MQTT.Message(id);
  idMessage.destinationName = idTopic; 
  mqttClient.send(idMessage);
  console.log("clientID published"); 
} 

//enables directional buttons  
function enableButtons() { 
  console.log("enabling");
  let buttons = document.getElementsByClassName("dirButton");
  for (let b = 0; b < buttons.length; b++) {
    buttons[b].disabled = false;  
  }
}

//disables directional buttons 
function disableButtons() {
  console.log("disabling");  
  let buttons = document.getElementsByClassName("dirButton");
  for (let b = 0; b < buttons.length; b++) {
    buttons[b].disabled = true;
  }
}

/* (triggered on directional button press)
Publishes directional integer to directional topic. */
function sendVal(num) {
  if (client.clientID == currentUser) { //ensure user has control
    let dirMessage = new Paho.MQTT.Message(String(num));
    dirMessage.destinationName = dirTopic;
    mqttClient.send(dirMessage);
  }
}

document.addEventListener("DOMContentLoaded", setup);
