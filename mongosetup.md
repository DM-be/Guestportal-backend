mongod --replSet rs0 --port 27020 --bind_ip localhost --dbpath /srv/mongodb/rs0-0 

mongod --replSet rs0 --port 27021 --bind_ip localhost --dbpath /srv/mongodb/rs0-1  


mongod --replSet rs0 --port 27022 --bind_ip localhost --dbpath /srv/mongodb/rs0-2 


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

aanmaken dirs: mkdir -p /srv/mongodb/rs0-0 /srv/mongodb/rs-0-1 /srv/mongodb/rs0-2
https://docs.mongodb.com/manual/replication/
https://docs.mongodb.com/manual/tutorial/deploy-replica-set-for-testing/


verbinden via --> 'mongodb://localhost:27020/?replicaSet=rs0'