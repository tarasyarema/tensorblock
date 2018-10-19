# hackupc2018fall

## Tall n' Run

1. Clone the repo and install the dependencies.
```
git clone https://github.com/tarasyarema/hackupc2018fall.git
cd hackupc2018fall
npm install
```

2. You'll need to install [MongoDB](https://www.mongodb.com/) so go [here](https://docs.mongodb.com/manual/administration/install-community/) to do so. After installing MongoDB start and run it **in the repo directory**.
```
sudo service mongod start
mongod --db_path=data
```
After this the database should be running fine.

3. Run the app. By default the server is listening on port 3000. Go to [http://localhost:3000](http://localhost:3000) to test the app in your browser.
```
node index.js
```
