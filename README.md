<img src='https://github.com/adildsw/SIMPLE_LtL/blob/main/assets/logo.png'>

__SIMPLE LtL__ is an interactive GUI web application designed to simplify the creation of LTL models through intuitive visuals and drag/drop/click features, and allows for simplified analysis of formula satisfiability on the given LTL model using natural language.

SIMPLE LtL uses [PyModelChecking](https://github.com/albertocasagrande/pyModelChecking) as the backend for computing the formula satisfiability.

## Getting Started
The following set of instructions will help you get SIMPLE LtL up and running on your computer.

### Prerequisites
In order to build and run this application on your device, make sure you meet the following prerequisites:
##### 1. Install Python 3.6+ ([Anaconda](https://www.anaconda.com/download/) distribution recommended)
##### 2. A 1080p or higher display. (Screen sizes below this resolution might result in buggy visuals)

### Building SIMPLE LtL
Once all the prerequisites are met, follow these instructions to build and execute SIMPLE LtL on your device:

#### 1. Clone SIMPLE LtL repository to your local system. 
Open the <i>Terminal</i> window and type the following command:
```
git clone https://github.com/adildsw/SIMPLE_LtL
```
#### 2. Navigate to the directory containing SIMPLE LtL
```
cd SIMPLE_LtL
```
#### 3. Install dependencies
```
pip install -r requirements.txt
```
#### 4. Starting server
```
python server.py
```
Upon successful server hosting, the terminal/command prompt should return the following message:
```
* Serving Flask app "server" (lazy loading)
* Environment: production
  WARNING: This is a development server. Do not use it in a production deployment.
  Use a production WSGI server instead.
* Debug mode: off
* Running on http://x.x.x.x:port/ (Press CTRL+C to quit)
```
```http://x.x.x.x:port/``` is the address of the hosted server.
#### 5. Running SIMPLE LtL
Once the server is hosted successfully, navigate to the address of the hosted server using a web browser. If done right, the following screen should open:
<img src='https://github.com/adildsw/SIMPLE_LtL/blob/main/assets/screenshot.png'>
