db = db.getSiblingDB("ViajeBici");
var users = db.usuviajes.find();
var counter = 1;

var generoStats = {
    "Masculino": { total: 0, sinViajes: 0 },
    "Femenino": { total: 0, sinViajes: 0 },
    "Indefinido": { total: 0, sinViajes: 0 }
};


users.forEach(function(user) {
  print("Registro #" + counter + ":");
  var userData = user["IDUsuario;Genero;Edad"].split(";");
  print("ID de Usuario: " + userData[0]);
  var genero = userData[1];


    if(genero == "M"){
      genero = "Masculino";
      print("Genero: "+ genero +":"); 
    }else if(genero == "F"){
      genero = "Femenino";
      print("Genero: "+ genero +":");
    }else{
      genero = "Indefinido";
    }

  

  var userId = parseInt(userData[0]);

  var tripsCount = db.viajes.find({ "IDUsuario;RetiroDT;RetiroEstacion;AnclajeDT;AnclajeEstacion": new RegExp("^" + userId + ";") }).count();

  if (tripsCount > 0) {
    print("Cantidad de Viajes: " + tripsCount);

    generoStats[genero].total += 1;
  }else{
    generoStats[genero].sinViajes += 1;
  }
  
  counter++;
});





print("\n---------------------------------------------------------------------------")
print("Usuarios Registrados que han realizado al menos un viaje, cifras por genero")
print("---------------------------------------------------------------------------")

var totalUsuariosConViajes = 0;
for (var genero in generoStats) {

  print(genero +": "+ generoStats[genero].total);
  totalUsuariosConViajes += generoStats[genero].total;
}

print("Numero total de personas: "+ totalUsuariosConViajes)


var resultado = 0;

print("\n------------")
print("Porcentajes:");
print("------------")

for (var genero in generoStats) {
 
    var porcentaje = (generoStats[genero].total / totalUsuariosConViajes) * 100;
    print(genero + ": " + porcentaje.toFixed(2) + "%");
    resultado += porcentaje;

}

print("\n")

print("\n--------------------------------------------------------------------")
print("Usuarios Registrados sin haber realizado un viaje, cifras por genero ")
print("--------------------------------------------------------------------")


var totalUsuariosSinViajes = 0;
for (var genero in generoStats) {

  print(genero +": "+ generoStats[genero].sinViajes);
  totalUsuariosSinViajes += generoStats[genero].sinViajes;
}


print("Numero total de personas: "+ totalUsuariosSinViajes)

print("\n------------")
print("Porcentajes:");
print("------------")

resultado=0
for (var genero in generoStats) {

    var porcentaje = (generoStats[genero].sinViajes / totalUsuariosSinViajes) * 100;
    print( genero + ": " + porcentaje.toFixed(2) + "%");
    resultado += porcentaje;
  
}
