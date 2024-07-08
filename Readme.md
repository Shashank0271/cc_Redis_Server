# Making your own Redis Server

### Files in this project :

1. **redis.index.js** : run this file to start the redis server . It starts up a tcp server running on port 6379 .

2. **commandhandler.js** : the data reaching the server is handled by this function , which deserializes the data and processes it according to the RESP protocol

3. **deserializer.js** : contains all the deserializing logic followed by RESP

4. **serializer.js** : contains all the serializing logic followed by RESP

---

### Commands implemented are :

PING , ECHO , GET , SET (with EX , PX , EXAT , PAT) , LPUSH , RPUSH , EXISTS , DEL , INCR , DECR

---

### How to use:

- in the root folder run **npm redis.index.js** .
- in the CLI start the redis client by executing **redis.client** (i used ubuntu , this might be different in other OS)
- run commands from the CLI after connection has been established

### To run tests:

- **npm test**
