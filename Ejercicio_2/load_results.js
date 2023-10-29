var scriptsToLoad = [
  "usu_percent_gender_trips.js"
];

for (var i = 0; i < scriptsToLoad.length; i++) {
  var scriptName = scriptsToLoad[i];
  print("Cargando script: " + scriptName);
  load(scriptName);
  print("Script cargado: " + scriptName);
}

print("Todos los scripts han sido cargados.");

