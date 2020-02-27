## Description

A Node backend server built in the NestJS framework for the custom web portal implementation built by Dennis Morent.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# production mode
$ npm run start:prod
```

## Exposed ports
The default exposed ports are: 5000 and 5001 for the gateway.

## Environment
The environment is configured in the environments/environment.ts file.
The variables in this file are set using the node environment variables, when undefined defaults to some default testing values.

## MongoDB


### Setup


Run following commands to run mongoDB locally after installing the Mongo daemon:

```bash

mongod --replSet rs0 --port 27020 --bind_ip localhost --dbpath /srv/mongodb/rs0-0 

mongod --replSet rs0 --port 27021 --bind_ip localhost --dbpath /srv/mongodb/rs0-1  

mongod --replSet rs0 --port 27022 --bind_ip localhost --dbpath /srv/mongodb/rs0-2 

mkdir -p /srv/mongodb/rs0-0 /srv/mongodb/rs-0-1 /srv/mongodb/rs0-2

```

Next: configure the replicaset with a config object.
First connect to the replicaset running on port 27020 (default is 27017!)


``` bash
mongo --port 27020
```

Default config object:

``` bash
rsconf = {
  _id: "rs0",
  members: [
    {
     _id: 0,
     host: "localhost:27020"
    },
    {
     _id: 1,
     host: "localhost:27021"
    },
    {
     _id: 2,
     host: "localhost:27022"
    }
   ]
}
```


Initiate the replicaset with this configuration.

``` bash
rs.initiate(rsconf)
```

The replicaset is now available with the following connection string:

'mongodb://localhost:27020/?replicaSet=rs0'


## Documentation

Documentation of the API is available at http://localhost:5000/api/

### Informational links

https://docs.mongodb.com/manual/replication/\
https://docs.mongodb.com/manual/tutorial/deploy-replica-set-for-testing/
