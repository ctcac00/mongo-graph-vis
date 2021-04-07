# MongoDB Graph data visualisation demo

## Background

This demo builds on the work done by Paul Done in this [repo](https://github.com/pkdone/GraphPersonsAndPlaces)

It uses the library [vis-network](https://github.com/visjs/vis-network) to display the graph data

## How to run

This project has a React frontend application that communicates with MongoDB Realm Rest APIs, which in turn get data from MongoDB Atlas collections.

You will need to import this data to an Altas cluster following the instructions on Paul Done's repo (link above).

Next you can import the [realm_app](./realm_app) using *realm-cli* (instructions [here](https://docs.mongodb.com/realm/deploy/realm-cli-reference/#import-an-application)).

Once that's all in place, all you need to do is to start the React application:

```bash
cd frontend & npm install & npm start
```

## Features

There are 3 types of searches:

* Sample Search
* Person Search
* Place Search

### Sample Search

With the *Sample Search* you can select the sample size and simply get a random result set. This is the default option.

### Person Search

If you select *Person Search* you can then input the name of a person you are looking for in the dataset. The result set will change as you are typing. The search is based on **contains** on the *fullname* field of the *persons* dataset.

### Place Search

If you select *Place Search* you can then input the name of a place you are looking for in the dataset. The result set will change as you are typing. The search is based on **contains** on the *name* field of the *places* dataset.
