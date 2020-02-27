<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest
  
  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://img.shields.io/travis/nestjs/nest/master.svg?label=linux" alt="Linux" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://gitter.im/nestjs/nestjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge"><img src="https://badges.gitter.im/nestjs/nestjs.svg" alt="Gitter" /></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

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


Run following commands to deploy locally after installing the Mongo daemon:

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

