// Conexión a la base de datos "ViajeBici"
db = db.getSiblingDB("ViajeBici");

// Obtener una colección con los registros de usuarios
var users = db.usuviajes.find();
var counter = 1;

// Contar el número total de registros
var totalRegistros = users.count();

// Objeto para almacenar estadísticas por género
var generoStats = {
  "Masculino": { total: 0 },
  "Femenino": { total: 0 },
  "Indefinido": { total: 0 },
};

// Función para borrar la línea anterior en la consola
var borrarLineaAnterior = function () {
  print("\x1b[1A\x1b[K");
};

// Iniciar el cronómetro
var inicio = new Date();


// Iterar a través de los registros de usuarios
users.forEach(function (user) {
  // Borrar la línea anterior y mostrar el progreso y el cronómetro
  borrarLineaAnterior();
  var porcentajeProgreso = ((counter / totalRegistros) * 100).toFixed(2);
  var tiempoTranscurrido = (new Date() - inicio) / 1000; // Tiempo en segundos
  print(`Procesando registro ${counter} de ${totalRegistros} (${porcentajeProgreso}%) <------> Tiempo ${tiempoTranscurrido.toFixed(1)}s`);

  // Resto del código para procesar el registro
  var userData = user["IDUsuario;Genero;Edad"].split(";");
  var genero = userData[1];

  if (genero == "M") {
    genero = "Masculino";
  } else if (genero == "F") {
    genero = "Femenino";
  } else {
    genero = "Indefinido";
  }

  var userId = parseInt(userData[0]);
  var tripsCount = db.viajes.find({ "IDUsuario;RetiroDT;RetiroEstacion;AnclajeDT;AnclajeEstacion": new RegExp("^" + userId + ";") }).count();

  if (tripsCount > 0) {
    generoStats[genero].total++;
  }
  counter++;
});

// Detener el cronómetro
var tiempoTotal = (new Date() - inicio) / 1000; // Tiempo total en segundos

print(`Tiempo total de ejecución: ${tiempoTotal.toFixed(2)}s`);

print("\n---------------------------------------------------------------------------");
print("Usuarios registrados que han realizado al menos un viaje, cifras por género");
print("---------------------------------------------------------------------------");

var totalUsuariosConViajes = 0;
for (var genero in generoStats) {
  totalUsuariosConViajes += generoStats[genero].total;
}
for (var genero in generoStats) {
  var porcentaje = (generoStats[genero].total / totalUsuariosConViajes) * 100;
  print(genero + " => " + generoStats[genero].total +" (" + porcentaje.toFixed(2) + "%)");
}

var porcentajeUso = (totalUsuariosConViajes / totalRegistros) * 100;
print("\nUsuarios del servicio " + totalUsuariosConViajes + " respecto al total de usuarios representa un " + porcentajeUso.toFixed(2) + "%");


var resultado = 0;

