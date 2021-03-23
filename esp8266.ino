#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

const char* ssid = "VO VAN CANH";          //Tên mạng Wifi mà Socket server của bạn đang kết nối
const char* password = "doimotxi";  //Pass mạng wifi ahihi, anh em rãnh thì share pass cho mình với.
const char* serverName = "http://service-table.herokuapp.com/add";
HTTPClient http;
int ledPin = 2;                 // LED connected to digital pin 16
int btnPin = 12;                  // BUTTON connected to digital pin 0
int numTable =6;

void callAPI(boolean stt, int num){
  int numberTable = 1;
  if (WiFi.status() == WL_CONNECTED) 
  {
   http.begin(serverName);
   http.addHeader("Content-Type", "application/json");
   int httpResponseCode = http.POST(String("{\"num\":"+String(num)+",\"status\":"+String(stt)+"}"));
   //int httpResponseCode = http.GET();
   Serial.print("HTTP Response code: ");
   Serial.println(httpResponseCode);
   http.end();
  }
  delay(2000);
}

void setup()
{
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);      // sets the digital pin as output
  pinMode(btnPin, INPUT);       // sets the digital pin as input
  pinMode(btnPin, INPUT_PULLUP); //pull-up button
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) 
  {
     delay(500);
     Serial.print("*");
  }
  
  Serial.println("");
  Serial.println("WiFi connection Successful");
  Serial.print("The IP Address of ESP8266 Module is: ");
  Serial.print(WiFi.localIP());// Print the IP address
}

void loop()
{
 boolean reading = digitalRead(btnPin);
 if(reading){
  digitalWrite(ledPin,HIGH);
  callAPI(false,numTable);
 }else{
  digitalWrite(ledPin,LOW);
  callAPI(true,numTable);
 }
}
