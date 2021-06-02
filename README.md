# Mqtt-Car Prototype
A wireless, remote-controlled car that is controlled from anywhere via an online controller. 
A VERY in-depth look into the programming process can be found [here](https://wp.nyu.edu/yonatanrozin/mqtt-car/)!
A look into the fabrication process can be found [here](https://wp.nyu.edu/yonatanrozin/fabricating-a-toy-car/).

## Introduction

MQTT-Car was created as the final project for Tom Igoe's Device Networking class, whose guidelines can be found [here](https://itp.nyu.edu/classes/connected-devices/syllabus-spring-2021/assignments-spring-2021/#Device-to-Network_Communication).

MQTT-Car is the latest step in my obsession with car-related projects, which started with an unsightly car that received directions through a USB cable and has now grown into a true prototype, complete with a laser-cut acrylic body, wireless mobile controls, a private server to manage a queue of users and a database to store usage statistics. The project is modeled heavily after my previous [BLE-car](https://github.com/yonatanrozin/BLE-Car) project and functions almost identically, with the exception of the private network. This network shifts the focus of this project from the functionality of the car to the experience of a prospective user, which has been vastly improved by overcoming several shortcomings in the BLE (Bluetooth Low-Energy) protocol:

Among the biggest improvements is that the new protocol replacing Bluetooth - MQTT - is broadly compatible with nearly all browsers and mobile devices, making accessing the controller as simple as scanning a QR code. This is a massive improvement over the previous access requirements, which included downloading a Bluetooth-compatible browser such as Bluefy and then typing in the URL manually. Additionally, the Bluetooth range limitation has been virtually eliminated, as the MQTT protocol works over the internet from anywhere in the world.

The second improvement, enabled by the addition of the private network, is that the car now receives instructions from only one user at a time, whereas previously it could receive input from an infinite number of users, who would "fight" over controls as the car would respond to any directional input, regardless of the user. The private network maintains an automated queue of users that are currently connected to the mobile controller, and enables the directional buttons only for the user at the top of the queue. After a certain interval of time, the top user is removed from the queue and the next user is given the controls automatically.

A third, more administrative improvement, also enabled by the private network, is a database of usage statistics, which stores the connection and disconnection time of each user. Though this is only a small amount of data being tracked, using the Structured Query Language (SQL), a wide variety of data can be extracted from the database, such as the number of users per day, the 10 (for example) users who remained connected for the longest time or the hour in the day at which, on average, a user is most likely to connect.

## Materials

### Hardware
- An [Arduino Nano 33 IoT](https://store.arduino.cc/usa/nano-33-iot) 
- An [Arduino Nano 33 IoT](https://store.arduino.cc/usa/nano-33-iot) 
- A [TB6612FNG Motor Driver](https://www.digikey.com/catalog/en/partgroup/sparkfun-motor-driver-dual-tb6612fng/77350?utm_adgroup=General&utm_source=google&utm_medium=cpc&utm_campaign=Dynamic%20Search_EN_RLSA_Cart&utm_term=&utm_content=General&gclid=CjwKCAjw6fCCBhBNEiwAem5SOxlKTUwhOICaOWppYjjd_7NRXeuuupc6Qg5i4EwhrP_Fxs8bAraEchoCxeYQAvD_BwE)
- 2 of any kind of DC motor (I used the same [N20 Encoded Gearmotors](https://www.adafruit.com/product/4641) that I used in the previous project)
- A 9V battery holder

### Software

For developers:
- The [Arduino IDE](https://www.arduino.cc/en/software)
- A [shiftr.io](shiftr.io) broker
- A Node-RED server
- A SQLite database, or any other SQL database

For users:
- (optional) A mobile device with a QR-scanner

## Diagrams

### System Diagram

![A system diagram of user(s), an Arduino and Node-RED communicating through a central Shiftr.io broker. Node-RED additionally communicates with userQueue.txt and an mqttcar.db SQLite database](https://github.com/yonatanrozin/Mqtt-Car/blob/main/MQTT%20Car%20System%20Diagram.jpg)

**EDIT: the userQueue.txt function above has been integrated into the mqttcar.db database.**

### Schematic Diagram

The schematic diagram for this project is identical to that of the previous BLE-controlled version:

![A schematic diagram of 2 DC motors wired to an Arduino Nano 33 IoT through a TB6612FNG motor driver and a 9V battery](https://github.com/yonatanrozin/Mqtt-Car/blob/main/BLE%20Car%20Schematic.jpg)

## Credits

A huge special thanks to [Tom Igoe](https://tigoe.com/) for his [connected devices class](https://itp.nyu.edu/classes/connected-devices/syllabus-spring-2021/schedule-spring-2021/) and for providing a ton of helpful insight and code examples!
