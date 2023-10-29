var scriptsToLoad = [
  "res_spanish.js",
  "res_portuguese.js",
  "res_rating_top.js",
  "res_rating_low.js"
];

for (var i = 0; i < scriptsToLoad.length; i++) {
  var scriptName = scriptsToLoad[i];
  print("Cargando script: " + scriptName);
  load(scriptName);
  print("Script cargado: " + scriptName);
}

print("Todos los scripts han sido cargados.");

