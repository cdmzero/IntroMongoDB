db = db.getSiblingDB("ViajeBici");

var totalUsuarios = db.usuviajes.count();

var generoStats = {
  "Masculino": 0,
  "Femenino": 0,
  "Indefinido": 0
};

var edadStats = {
  "g1": 0,
  "g2": 0,
  "g3": 0
};

var totalUsuarios = 0;

db.usuviajes.find().forEach(function(user) {
  var userData = user["IDUsuario;Genero;Edad"].split(";");
  var genero = userData[1];
  var edad = userData[2];

  if (genero == "M") {
    generoStats["Masculino"]++;
  } else if (genero == "F") {
    generoStats["Femenino"]++;
  } else {
    generoStats["Indefinido"]++;
  }

  if (edad == "<=25" || edad == "26-35") {
    edadStats["g1"]++;
  } else if (edad == "36-50" || edad == "51-65") {
    edadStats["g2"]++;
  } else {
    edadStats["g3"]++;
  }

  totalUsuarios++;
});
print("\n------------------------------------------");
print("Numero de usuarios clasificados por género");
print("------------------------------------------");
for (var genero in generoStats) {
  print(genero + ": " + generoStats[genero] + " (" + ((generoStats[genero] / totalUsuarios) * 100).toFixed(2) + "%)");
}

print("\n-------------------------------------------------");
print("Numero de usuarios clasificados por rango de edad");
print("-------------------------------------------------");
for (var edad in edadStats) {
    {
        if( edad == "g1" )
        {
          print("Edad de 0 a 35 =>  "+ edadStats[edad] +" ("+((edadStats[edad] / totalUsuarios) * 100).toFixed(2) + "%)");
        }
        else if (edad == "g2" )
        {
          print("Edad de 36 a 65 => "+ edadStats[edad] + " ("+((edadStats[edad] / totalUsuarios) * 100).toFixed(2) + "%)");
        }
        else
        {
          print("Mayores de 65 =>    "+ edadStats[edad] +" ("+((edadStats[edad] / totalUsuarios) * 100).toFixed(2) + "%)");
        }
      }
}

print("\nTotal de usuarios: " + totalUsuarios)
