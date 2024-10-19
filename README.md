YakShop Web Service
Overview
YakShop is a web service designed to simulate a yak shepherd's herd management. It provides RESTful endpoints to query the stock of milk and skins produced by the yaks over time and the current status of the yak herd, including their ages and the last time they were shaved. The service reads the initial state of the herd from a JSON file and simulates stock production based on predefined yak lifecycle rules.

Features
Query stock after T days: The service calculates and returns the total milk produced and the number of yak skins (shavings) collected after a given number of days.
Query herd status after T days: The service provides the current age and the last shaving time for each yak in the herd after a given number of days.
Assumptions
A yak year is 100 days.
Female yaks produce milk according to the formula: 50 - D * 0.03 liters per day, where D is the yak's age in days.
A yak can be shaved every 8 + D * 0.01 days, where D is the yak's age in days.
Yaks live for a maximum of 10 years (1000 days).
The service starts counting from day 0, and all yaks are eligible to be shaved initially.
Endpoints
1. Get Stock:
URL: /yak-shop/stock/:T
Method: GET
Description: Returns the total milk produced and yak skins collected after T days.
Request Parameters:
T (integer): The number of days since day 0.
Sample Request: GET /yak-shop/stock/13
Sample Response:

{
  "milk": 1104.48,
  "skins": 3
}

2. Get Herd Status:
URL: /yak-shop/herd/:T
Method: GET
Description: Returns the current status of the herd after T days, including their age and last shaved time.
Request Parameters:
T (integer): The number of days since day 0.
Sample Request: GET /yak-shop/herd/13
Sample Response:
{
  "herd": [
    {
      "name": "Betty-1",
      "age": 4.13,
      "ageLastShaved": 4.0
    },
    {
      "name": "Betty-2",
      "age": 8.13,
      "ageLastShaved": 8.03
    },
    {
      "name": "Betty-3",
      "age": 9.63,
      "ageLastShaved": 9.5
    }
  ]
}


Setup and Installation
Prerequisites
Node.js (v14 or higher)
npm (comes with Node.js)
Steps
1.Clone or download the repository to your local machine.
git clone https://github.com/Sushmitameena/Yakshop.git
cd yakshop
2.Install the dependencies by running the following command:
3.Place the input JSON file (input.json) in the root directory of the project. Example format:
{
    "herd": [
        { "name": "Betty-1", "age": 4, "sex": "f" },
        { "name": "Betty-2", "age": 8, "sex": "f" },
        { "name": "Betty-3", "age": 9.5, "sex": "f" }
    ]
}
4.Start the server by running:node yak_shop.js
5.The server will start on port 3000. You can make requests to the following endpoints:

http://localhost:3000/yak-shop/stock/:T
http://localhost:3000/yak-shop/herd/:T

Usage Example
To query the stock after 13 days, send a request to http://localhost:3000/yak-shop/stock/13.
To get the herd's status after 13 days, send a request to http://localhost:3000/yak-shop/herd/13.



