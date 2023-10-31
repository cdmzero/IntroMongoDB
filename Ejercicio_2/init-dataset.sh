#!/bin/bash

# Verificar si se proporciona el parámetro
if [ $# -ne 1 ]; then
    echo "Uso: $0 <cantidad_de_registros>"
    exit 1
fi

# Obtener el valor del parámetro
cantidad_de_registros=$1

# Definir el nombre del archivo CSV basado en el valor del parámetro
archivo_csv=$1

# Importar los datos a MongoDB
mongoimport --host localhost --port 27017 --db ViajeBici --collection viajes --type csv --headerline --file "$archivo_csv"
mongoimport --host localhost --port 27017 --db ViajeBici --collection usuviajes --type csv --headerline --file UsuViajeBici.csv
