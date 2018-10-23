# TENSORBLOCK.js

## Install and run

1. Clone the repo and install the dependencies.

```
git clone https://github.com/tarasyarema/hackupc2018fall.git
cd hackupc2018fall
npm install
```

2. If you want to run it **locally** you'll need to install [MongoDB](https://www.mongodb.com/) so go [here](https://docs.mongodb.com/manual/administration/install-community/) to do so. 
After installing MongoDB create a folder `/data`, start and run it **in the repo directory**.
After this the database should be running fine.
```
mkdir data
sudo service mongod start
mongod --db_path=data
```


3. Run the app. By default the server is listening on port 3000. Go to [http://localhost:3000](http://localhost:3000) to test the app in your browser.
```
node index.js
```

## Request new levels



## Dev

### The `.env` file

```
MONGOLAB_URI=mongod://<user>:<password>@host:port/database_name
NODE_ENV=development
```
If you set the variable `NODE_ENV=production` the server will use the production database as it uses the page [tensorblock.tech](http://tensorblock.tech).

### Deploy

The game is deployed using Heroku and mLab.