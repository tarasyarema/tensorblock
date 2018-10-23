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

Create a new file named `/static/js/levels/file<id>.js`. The format is the next:

```javascript
const level0 = {
	"platforms": [[]],
	"portals": [[]],
	"exit": [],
	"init": [],
	"hor_bar": [],
	"ver_bar": [],
	"spikes_lever": [],
    "id": <id>
};
```

### `platforms` : platforms.
Array of all the platforms in the level. The format of the platform is `[x,y,w]` where `x,y` is the postion of the platform and `w` is the width.

### `portals` : temporal portals.
Same format as `platforms`.

### `exit` : exit (finish) portal.
The format is `[x,y]` of the position.

### `init` : initial position.
Same format as `exit`.

### `hor_bar` : horizontal bars.
Array of the horizontal bars that can be moved by the player. Same format as `platforms`.

### `ver_bar` : vertical bars.
Array of the vertical bars that can be moved by the player. Same format as `platforms`.

### `spikes_lever` : `null`
Array of the spike platforms. **Not yet implemented**.

### `id` : id of the level.
It could be any type but currently we are using integers.

## Dev

### The `.env` file

```
MONGOLAB_URI=mongod://<user>:<password>@host:port/database_name
NODE_ENV=development
```
If you set the variable `NODE_ENV=production` the server will use the production database as it uses the page [tensorblock.tech](http://tensorblock.tech).

### Deploy

The game is deployed using Heroku and mLab.