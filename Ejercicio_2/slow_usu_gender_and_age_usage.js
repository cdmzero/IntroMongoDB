// Conexión a la base de datos "ViajeBici"
db = db.getSiblingDB("ViajeBici");

// Objeto para almacenar estadísticas de usuarios
var userStats = {
  "Masculino": {
    ConViajes: { total: 0, age: { g1: 0, g2: 0, g3: 0 } },
    sinViajes: { total: 0, age: { g1: 0, g2: 0, g3: 0 } },
  },
  "Femenino": {
    ConViajes: { total: 0, age: { g1: 0, g2: 0, g3: 0 } },
    sinViajes: { total: 0, age: { g1: 0, g2: 0, g3: 0 } },
  },
  "Indefinido": {
    ConViajes: { total: 0, age: { g1: 0, g2: 0, g3: 0 } },
    sinViajes: { total: 0, age: { g1: 0, g2: 0, g3: 0 } },
  },
};

// Contador para el número total de usuarios
var totalUsuarios = 0;
var totalRegistros = db.usuviajes.count(); // Obtener el total de registros en la colección

// Registra el tiempo de inicio
var inicio = new Date();

// Función para borrar la línea anterior en la consola
var borrarLineaAnterior = function () {
  print("\x1b[1A\x1b[K");
};


// Iterar a través de los registros de usuarios
db.usuviajes.find().forEach(function (user) {
  // Dividir el registro en sus campos
  var userData = user["IDUsuario;Genero;Edad"].split(";");
  var genero = userData[1];
  var edad = userData[2];

  // Mapear códigos de género a etiquetas
  if (genero == "M") {
    genero = "Masculino";
  } else if (genero == "F") {
    genero = "Femenino";
  } else {
    genero = "Indefinido";
  }

  // Mapear códigos de edad a grupos
  if (edad == "<=25" || edad == "26-35") {
    edad = "g1";
  } else if (edad == "36-50" || edad == "51-65") {
    edad = "g2";
  } else {
    edad = "g3";
  }

  // Contar el número de viajes del usuario
  var tripsCount = db.viajes
    .find({
      "IDUsuario;RetiroDT;RetiroEstacion;AnclajeDT;AnclajeEstacion": new RegExp("^" + userData[0] + ";"),
    })
    .count();

  if (tripsCount > 0) {
    // Actualizar estadísticas para usuarios con viajes
    userStats[genero].ConViajes.total++;
    userStats[genero].ConViajes.age[edad]++;
  } else {
    // Actualizar estadísticas para usuarios sin viajes
    userStats[genero].sinViajes.total++;
    userStats[genero].sinViajes.age[edad]++;
  }

  totalUsuarios++; // Incrementar el contador de usuarios procesados

  // Borrar la línea anterior y mostrar el progreso
  borrarLineaAnterior();
  var porcentaje = ((totalUsuarios / totalRegistros) * 100).toFixed(2); // Calcular el porcentaje completado
  var tiempoTranscurrido = (new Date() - inicio) / 1000; // Calcular el tiempo transcurrido en segundos
  print("Registros leídos: " + totalUsuarios + " de " + totalRegistros + " (" + porcentaje + "%)    <--------->   Tiempo de ejecución: " + tiempoTranscurrido.toFixed(1) +"s");
});

// Calcular el tiempo total de ejecución
var tiempoTotal = (new Date() - inicio) / 1000; // Tiempo total en segundos

// Mensaje de éxito y estadísticas finales
print("\nDatos cargados con éxito.");
print("Tiempo total de ejecución: " + tiempoTotal + "s");

print("\n-----------------------------------------------------------------------");
print("Usuarios registrados con al menos un viaje realizado, cifras por género ");
print("-----------------------------------------------------------------------");
for (var genero in userStats) {
  print("\n" + genero + ": " + userStats[genero].ConViajes.total + " (" + ((userStats[genero].ConViajes.total / totalUsuarios) * 100).toFixed(2) + "%)");

  for (var gEdad in userStats[genero].ConViajes.age) {
    var edadGroup = gEdad == "g1" ? " Edad de 0 a 35" : gEdad == "g2" ? "Edad de 36 a 65" : "   Mayores de 65";
    var porcentaje = ((userStats[genero].ConViajes.age[gEdad] / userStats[genero].ConViajes.total) * 100).toFixed(2);
    if (porcentaje > 0) {
      print("   " + edadGroup + ": " + userStats[genero].ConViajes.age[gEdad] + " (" + porcentaje + "%)");
    } else {
      print("   " + edadGroup + ": " + userStats[genero].ConViajes.age[gEdad] + "%");
    }
  }
}

print("\n------------------------------------------------------------------------");
print("Usuarios registrados sin haber realizado ningún viaje, cifras por género ");
print("------------------------------------------------------------------------");
for (var genero in userStats) {
  print("\n" + genero + ": " + userStats[genero].sinViajes.total + " (" + ((userStats[genero].sinViajes.total / totalUsuarios) * 100).toFixed(2) + "%)");

  for (var gEdad in userStats[genero].sinViajes.age) {
    var edadGroup = gEdad == "g1" ? " Edad de 0 a 35" : gEdad == "g2" ? "Edad de 36 a 65" : "   Mayores de 65";
    var porcentaje = ((userStats[genero].sinViajes.age[gEdad] / userStats[genero].sinViajes.total) * 100).toFixed(2);
    if (porcentaje > 0) {
      print("   " + edadGroup + ": " + userStats[genero].sinViajes.age[gEdad] + " (" + porcentaje + "%)");
    } else {
      print("   " + edadGroup + ": " + userStats[genero].sinViajes.age[gEdad] + " (0%)");
    }
  }
}

print("\nTotal de usuarios registrados: " + totalUsuarios);
