## Description

A Node backend server built in the NestJS framework for the custom guest portal implementation.

## Requirements

The backend server should integrate with Cisco Identity Services and LDAP. Cisco ISE is a AAA servicer that provides security and access to all networks in a corporate enviroment. Cisco ISE provides an API to handle requests such as adding a guest user account to a guest network. 
The backend should also integrate with active directory to provide a list of employees a visitor would be visiting. 

Controllers and services should be provided to handle CRUD operations such as adding a guest user or removing access for a guest user. 
The backend keeps track of admin users using the frontend (front desk employees) and registered guest users. 

## Implementation

Every requirement is implemented in a separate service.
Controllers respond to HTTP requests and delegates them to the appropriate service. 
Certain requests are protected with an authentication guard. A JWT token passport strategy is used to validate these requests. 
A default validation pipe provided by NestJS is used to validate the objects in the request body.
MongoDB is used as the database. Three replica sets are used for redundancy. 
When a guest user's access is expired, the corresponding MongoDB record also expires. On this change a BehaviorSubject will emit the new value for use in the frontend table.
Documentation is provided by Swagger.

### Features

* JWT token and passport strategy verification
* model validation in JSON body of requests using validation pipes
* MongoDB with redundancy and auto expiring records
* mocumentation
* separate services
* observables that emit real time up to date values
* basic LDAP integration


### Exposed ports
The default exposed ports are: 5000 and 5001 for the gateway.

### Environment
The environment is configured in the environments/environment.ts file.
The variables in this file are set using the node environment variables, when undefined defaults to some default testing values.

### MongoDB


#### Setup


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


### Documentation

Documentation of the API is available at http://localhost:5000/api/

