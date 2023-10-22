#!/bin/bash

chmod +x init-mongodb-server.sh  init-dataset.sh 


# Arrancar el servidor
sh init-mongodb-server.sh

# Cargar el dataset
sh init-dataset.sh

# Cargar los resultados
mongo < load_results.js

