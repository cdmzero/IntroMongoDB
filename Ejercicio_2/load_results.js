var scriptsToLoad = [
  "trip_peak_by_minutes.js",
  "usu_stats.js"
];

for (var i = 0; i < scriptsToLoad.length; i++) {
  var scriptName = scriptsToLoad[i];
  print("\n")
  print("\n")
  print("\n")
  print("\n")
  print("Cargando script: " + scriptName);
  print("\n")
  load(scriptName);
  print("Script cargado: " + scriptName);
  print("\n")
  print("\n")
  print("\n")
  print("\n")
}

print("Todos los scripts han sido cargados.");

