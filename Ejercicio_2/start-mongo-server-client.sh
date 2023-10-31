#!/bin/bash

# Dar permisos de ejecución a los otros scripts
chmod +x init-mongodb-server.sh init-dataset.sh

# Arrancar el servidor
sh init-mongodb-server.sh

# Función para mostrar el menú de archivos CSV
function mostrar_menu_archivos {
    opciones=()
    contador=1

    for archivo_csv in *.csv; do
        if [ "$archivo_csv" != "UsuViajeBici.csv" ]; then
            opciones[$contador]="$archivo_csv"
            echo "$contador. $archivo_csv"
            ((contador++))
        fi
    done

    # Verificar si no hay archivos CSV en el directorio
    if [ $contador -eq 1 ]; then
        echo "No se encontraron archivos CSV en el directorio. Saliendo."
        exit 1
    fi
}

# Solicitar al usuario que elija un archivo CSV
while true; do
    mostrar_menu_archivos
    read -p "Ingrese el número correspondiente al archivo que desea cargar: " opcion

    # Verificar si la opción ingresada es válida
    if [ "$opcion" -ge 1 ] && [ "$opcion" -lt $contador ]; then
        archivo_csv="${opciones[$opcion]}"
        sh init-dataset.sh "$archivo_csv"
        break  # Salir del bucle si se ingresó una opción válida
    else
        echo "Opción no válida. Intente nuevamente."
    fi
done



#!/bin/bash

# Obtener la lista de archivos .js disponibles en el directorio actual, omitiendo load_results.js
scriptFiles=()
for archivo in *.js; do
    [ "$archivo" != "load_results.js" ] && scriptFiles+=("$archivo")
done

# Inicializar la variable para el nombre del script
scriptName=""

# Crear un menú interactivo para seleccionar un archivo .js
while true; do
    PS3="Seleccione un archivo .js (o escriba 'exit' para salir): "
    select archivo in "${scriptFiles[@]}" "exit"; do
        case $archivo in
            "exit")
                echo "Saliendo."
                exit
                ;;
            *.js)
                scriptName="$archivo"
                mongo "$scriptName"
              

                ;;
            *)
                echo "Opción no válida. Intente nuevamente."
                ;;
        esac
    done

    # Verificar si se eligió un script
    if [ -n "$scriptName" ]; then
        echo "Cargando script: $scriptName"
        # Llama a tu comando para cargar el script aquí
        echo "Script cargado: $scriptName"
    fi
done

