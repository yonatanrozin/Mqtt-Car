#include <Adafruit_SSD1327.h>
#include <Wire.h>

#include <ArduinoMqttClient.h>
#include <WiFiNINA.h>

#include "config.h"

//motor driver pins:
#define AI1 12 
#define AI2 11
#define BI1 10
#define BI2 9
#define pwmA A7
#define pwmB A6
#define stdby 4

//for WIFI and MQTT:
WiFiClient net;
MqttClient mqttClient(net);
const String topic = "direction";

void setup() {
  Serial.begin(9600);
  
  pinMode(AI1, OUTPUT);
  pinMode(AI2, OUTPUT);
  pinMode(BI1, OUTPUT);
  pinMode(BI2, OUTPUT);
  pinMode(stdby, OUTPUT);
  pinMode(pwmB, OUTPUT);
  pinMode(pwmA, OUTPUT);
  
  analogWrite(pwmA, 255);
  analogWrite(pwmB, 255); 
  digitalWrite(stdby, HIGH);

  //connect to WIFI network:
  Serial.println("Connecting to WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  if (WiFi.status() != WL_CONNECTED) return;

  //connect to MQTT broker:
  Serial.println("Connecting to MQTT...");
  mqttClient.setUsernamePassword(MQTT_USER, MQTT_PASS);
  mqttClient.setId("Yony's Arduino");

  if (!mqttClient.connect(MQTT_BROKER, MQTT_PORT)) {
    Serial.print("MQTT Error code:");
    Serial.println(mqttClient.connectError());
  }
  mqttClient.subscribe(topic);

  //send "connected" status to broker:
  logOnline("Connected");
  
  Serial.println("Setup complete!");
}

void loop() {
  //every 5 seconds, keep MQTT connection alive:
  if (millis()%5000 < 10) {
    mqttClient.poll();
    delay(10);
  }

  //when an MQTT message is received:
  int message = mqttClient.parseMessage();
  if (message) {
    Serial.println("Received MQTT");
    
    while (mqttClient.available()) {
      driveCar((char)mqttClient.read());
    }
  }
   //every 10s, sends "online" status to MQTT broker
   if (millis()%10000 < 10) { 
    logOnline("online");
    delay(10); 
  }
}

//sends a string to the carStatus MQTT topic
void logOnline(String msg) {
  mqttClient.beginMessage("log/carStatus");
  mqttClient.print(msg);
  mqttClient.endMessage();
}

//moves the car according to the received integer
void driveCar(int dirNum) {
  if (dirNum == 48 || dirNum == 0) {
    carStop();
  } else if (dirNum == 49 || dirNum == 1) {
    carForward();
  } else if (dirNum == 50 || dirNum == 2) {
    carBack();
  } else if (dirNum == 51 || dirNum == 3) {
    carLeft();
  } else if (dirNum == 52 || dirNum == 4) {
    carRight();
  } else carStop();
}

void carStop() {
  digitalWrite(AI1, LOW);
  digitalWrite(AI2, LOW);
  digitalWrite(BI1, LOW);
  digitalWrite(BI2, LOW);
  Serial.println("Stopping car.");
}

void carForward() {
  digitalWrite(AI1, LOW);
  digitalWrite(AI2, HIGH);
  digitalWrite(BI1, LOW);
  digitalWrite(BI2, HIGH);
  Serial.println("Moving forward");
}

void carBack() {
  digitalWrite(AI1, HIGH);
  digitalWrite(AI2, LOW);
  digitalWrite(BI1, HIGH);
  digitalWrite(BI2, LOW);
  Serial.println("Moving back.");
}

void carLeft() {
  digitalWrite(AI1, LOW);
  digitalWrite(AI2, HIGH);
  digitalWrite(BI1, HIGH);
  digitalWrite(BI2, LOW);
  Serial.println("Turning left.");
}

void carRight() {
  digitalWrite(AI1, HIGH);
  digitalWrite(AI2, LOW);
  digitalWrite(BI1, LOW);
  digitalWrite(BI2, HIGH);
  Serial.println("Turning right.");
}
