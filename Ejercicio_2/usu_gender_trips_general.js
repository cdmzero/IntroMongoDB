// Conexión a la base de datos "ViajeBici"
db = db.getSiblingDB("ViajeBici");

// Obtener una colección con los registros de usuarios
var users = db.usuviajes.find();
var counter = 1;

// Objeto para almacenar estadísticas por género
var generoStats = {
  "Masculino": { conViajes: 0, sinViajes: 0 },
  "Femenino": { conViajes: 0, sinViajes: 0 },
  "Indefinido": { conViajes: 0, sinViajes: 0 }
};

// Función para borrar la línea anterior en la consola
var borrarLineaAnterior = function () {
  print("\x1b[1A\x1b[K");
};

// Iniciar el cronómetro
var inicio = new Date();


// Iterar a través de los registros de usuarios
users.forEach(function (user) {
  // Borrar la línea anterior y mostrar el progreso
  borrarLineaAnterior();
  var porcentajeProgreso = ((counter / users.size()) * 100).toFixed(2);
  var tiempoTranscurrido = (new Date() - inicio) / 1000; // Tiempo en segundos
  print(`Procesando registro ${counter} de ${users.size()} (${porcentajeProgreso}%) <--------> Tiempo: ${tiempoTranscurrido.toFixed(1)}s`);

  // Resto del código para procesar el registro
  var userData = user["IDUsuario;Genero;Edad"].split(";");
  var userId = userData[0];
  var genero = userData[1];

  if (genero == "M") {
    genero = "Masculino";
  } else if (genero == "F") {
    genero = "Femenino";
  } else {
    genero = "Indefinido";
  }

  var tripsCount = db.viajes.find({ "IDUsuario;RetiroDT;RetiroEstacion;AnclajeDT;AnclajeEstacion": new RegExp("^" + userId + ";") }).count();

  if (tripsCount > 0) {
    generoStats[genero].conViajes++;
  } else {
    generoStats[genero].sinViajes++;
  }

  counter++
});

// Detener el cronómetro
var tiempoTotal = (new Date() - inicio) / 1000; // Tiempo total en segundos

print(`Tiempo total de ejecución: ${tiempoTotal.toFixed(2)}s`);

print("\n---------------------------------------------------------------------------");
print("Usuarios registrados que han realizado al menos un viaje, cifras por género");
print("---------------------------------------------------------------------------");

var totalRegistros = users.size()
var totalUsuariosConViajes = 0;
for (var genero in generoStats) {
  var total = generoStats[genero].conViajes;
  totalUsuariosConViajes += total;
}
for (var genero in generoStats) {
  var total = generoStats[genero].conViajes;
  var porcentajeTotal = ((total / totalUsuariosConViajes) * 100).toFixed(2);
  print(genero + " => " + total + " (" + porcentajeTotal + "%)");
}

var porcentajeUso = (totalUsuariosConViajes / totalRegistros) * 100;
print("\nUsuarios activos " + totalUsuariosConViajes + " respecto al total de usuarios representa un " + porcentajeUso.toFixed(2) + "%");


print("\n--------------------------------------------------------------------");
print("Usuarios Registrados sin haber realizado un viaje, cifras por género");
print("--------------------------------------------------------------------");

var totalUsuariosSinViajes = 0;
for (var genero in generoStats) {
  var totalSinViajes = generoStats[genero].sinViajes;
  totalUsuariosSinViajes += totalSinViajes;
}
for (var genero in generoStats) {
  var totalSinViajes = generoStats[genero].sinViajes;
  var porcentajeSinViajes = ((totalSinViajes / totalUsuariosSinViajes) * 100).toFixed(2);
  print(genero +" => "+ totalSinViajes + " (" + porcentajeSinViajes + "%)");
}
var porcentajeUso = (totalUsuariosSinViajes / totalRegistros) * 100;
print("\nUsuarios inactivos " + totalUsuariosSinViajes + " respecto al total de usuarios representa un " + porcentajeUso.toFixed(2) + "%");


