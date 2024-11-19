Some of the fixes to isses when deploying to Netlify:
1. yarn upgrade
2. set the right node version
3. remove package-lock.json
4. git add ., git commit -m "remove package-lock.json", git push origin main



# React Redux CRUD App example with Axios and Rest API

Build a React Redux CRUD Application to consume Web API using Axios, display and modify data with Router & Bootstrap.

React Redux Tutorial Application in that:
- Each Tutorial has id, firstname, lastname, deceased status.
- We can create, retrieve, update, delete Tutorials.
- There is a Search bar for finding Tutorials by firstname.


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Set port
.env
```
PORT=5173
```

## Project setup

In the project directory, you can run:

```
npm install
# or
yarn install
```

or

### Compiles and hot-reloads for development

```
npm start
# or
yarn start
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.
