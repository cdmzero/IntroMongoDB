db = db.getSiblingDB("ViajeBici");
var users = db.usuviajes.find();
var counter = 1;

var userStats = {
    "Masculino":  { ConViajes:{total:0, age:{g1:0,g2:0,g3:0}},   sinViajes:{total:0, age:{ g1:0,g2:0,g3:0}}},
    "Femenino":   { ConViajes:{total:0, age:{g1:0,g2:0,g3:0}},   sinViajes:{total:0, age:{ g1:0,g2:0,g3:0}}},
    "Indefinido": { ConViajes:{total:0, age:{g1:0,g2:0,g3:0}},   sinViajes:{total:0, age:{ g1:0,g2:0,g3:0}}}
};


users.forEach(function(user) {
  print("Registro #" + counter + ":");
  var userData = user["IDUsuario;Genero;Edad"].split(";");
  print("ID de Usuario: " + userData[0]);
  print("Edad: " + userData[2]);

  var genero = userData[1];
  var edad = userData[2];


    if(genero == "M"){
      genero = "Masculino";
      print("Genero: "+ genero +":"); 
    }else if(genero == "F"){
      genero = "Femenino";
      print("Genero: "+ genero +":");
    }else{
      genero = "Indefinido";
    }

  

    if(edad == "<=25" ||  edad == "26-35"){
      edad = "g1";
      print("Grupo: "+ edad +":"); 
    }else if(edad == "36-50" || edad == "51-65"){
      edad = "g2";
      print("Grupo: "+ edad +":");
    }else{
      edad = "g3";
      print("Grupo: "+ edad +":");
    }

  

  var userId = parseInt(userData[0]);

  var tripsCount = db.viajes.find({ "IDUsuario;RetiroDT;RetiroEstacion;AnclajeDT;AnclajeEstacion": new RegExp("^" + userId + ";") }).count();

  var edadGroup = "";

  if (tripsCount > 0) {
    print("Cantidad de Viajes: " + tripsCount);
    userStats[genero].ConViajes.total += 1;
    userStats[genero].ConViajes.age[edad] += 1;


  }else{

    userStats[genero].sinViajes.total += 1;
    userStats[genero].sinViajes.age[edad] += 1;

    }

  
  counter++;
});





print("\n---------------------------------------------------------------------------")
print("Usuarios Registrados que han realizado al menos un viaje, cifras por genero")
print("---------------------------------------------------------------------------")

var totalUsuariosConViajes = 0;
for (var genero in userStats) {

  print("\n"+genero +": "+ userStats[genero].ConViajes.total);

  for (var gEdad in userStats[genero].ConViajes.age)
  {
    if( gEdad == "g1" )
    {
      print("   Edad de 0 a 35:  "+ userStats[genero].ConViajes.age["g1"])
    }
    else if (gEdad == "g2" )
    {
      print("   Edad de 36 a 65: "+ userStats[genero].ConViajes.age["g2"])
    }
    else
    {
      print("   Mayores de 65:    "+ userStats[genero].ConViajes.age["g3"])
    }
  }

  totalUsuariosConViajes += userStats[genero].ConViajes.total;
}

print("\nNumero total de personas: "+ totalUsuariosConViajes)


var resultado = 0;

print("\n------------")
print("Porcentajes");
print("------------")
var porcentaje = 0;

for (var genero in userStats) {

  print("\n"+genero);

  for (var gEdad in userStats[genero].ConViajes.age)
  {
    if( gEdad == "g1" )
    {
      porcentaje = (userStats[genero].ConViajes.age["g1"] / userStats[genero].ConViajes.total) * 100;
      if(porcentaje > 0){
        print("   Edad de 0 a 35  => "+ porcentaje.toFixed(2) + "%")
      }else{
        print("   Edad de 0 a 35  => 0%")
      }
    }
    else if (gEdad == "g2" )
    {
      porcentaje = (userStats[genero].ConViajes.age["g2"] / userStats[genero].ConViajes.total) * 100;
      if(porcentaje > 0){
        print("   Edad de 36 a 64 => "+ porcentaje.toFixed(2) + "%")
      }else{
        print("   Edad de 36 a 64 => 0%")
      }
    }
    else
    {
      
      porcentaje = (userStats[genero].ConViajes.age["g3"] / userStats[genero].ConViajes.total) * 100;
      if(porcentaje > 0){
        print("   Mayores de 64   => "+ porcentaje.toFixed(2) + "%")
      }else{
        print("   Mayores de 64   => 0%")
      }
     
    }
  }
    resultado += porcentaje;

}


print("\n")

print("\n--------------------------------------------------------------------")
print("Usuarios Registrados sin haber realizado un viaje, cifras por genero ")
print("--------------------------------------------------------------------")

var totalUsuariosSinViajes = 0;
for (var genero in userStats) {

  print("\n"+genero +": "+ userStats[genero].sinViajes.total);

  for (var gEdad in userStats[genero].sinViajes.age)
  {
    if( gEdad == "g1" )
    {
      print("   Edad de 0 a 35:  "+ userStats[genero].sinViajes.age["g1"])
    }
    else if (gEdad == "g2" )
    {
      print("   Edad de 36 a 65: "+ userStats[genero].sinViajes.age["g2"])
    }
    else
    {
      print("   Mayores de 65:    "+ userStats[genero].sinViajes.age["g3"])
    }
  }

  totalUsuariosSinViajes += userStats[genero].sinViajes.total;
}

print("\nNumero total de personas: "+ totalUsuariosSinViajes)


var resultado = 0;

print("\n------------")
print("Porcentajes");
print("------------")
var porcentaje = 0;

for (var genero in userStats) {

  print("\n"+genero);

  for (var gEdad in userStats[genero].sinViajes.age)
  {
    if( gEdad == "g1" )
    {
      porcentaje = (userStats[genero].sinViajes.age["g1"] / userStats[genero].sinViajes.total) * 100;
      if(porcentaje > 0){
        print("   Edad de 0 a 35  => "+ porcentaje.toFixed(2) + "%")
      }else{
        print("   Edad de 0 a 35  => 0%")
      }
    }
    else if (gEdad == "g2" )
    {
      porcentaje = (userStats[genero].sinViajes.age["g2"] / userStats[genero].sinViajes.total) * 100;
      if(porcentaje > 0){
        print("   Edad de 36 a 64 => "+ porcentaje.toFixed(2) + "%")
      }else{
        print("   Edad de 36 a 64 => 0%")
      }
    }
    else
    {
      
      porcentaje = (userStats[genero].sinViajes.age["g3"] / userStats[genero].sinViajes.total) * 100;
      if(porcentaje > 0){
        print("   Mayores de 64   => "+ porcentaje.toFixed(2) + "%")
      }else{
        print("   Mayores de 64   => 0%")
      }
     
    }
  }
    resultado += porcentaje;

}
