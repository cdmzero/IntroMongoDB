db = db.getSiblingDB("Hosteleria");


print("Restaurantes de comida Portuguesa en el barrio de Queens:")
print("")
var cursor = db.Restaurantes.find({
  $and: [
    { cuisine: "Portuguese" },
    { borough: "Queens" }
  ]
});

var contador = 1;

cursor.forEach(function(doc) {
  print(contador +" "+ doc.name);
  contador++;
});

print("")
print("Datos relevantes:")
var countPortuguese = db.Restaurantes.find({ cuisine: "Portuguese" }).count();
print("Numero total de restaurantes de comida Portuguesa: " + countPortuguese);

var countPortugueseInQueens = db.Restaurantes.find({  $and: [{ cuisine: "Portuguese" }, { borough: "Queens"}] }).count();
print("Numero total de restaurantes de comida Portuguesa en Queens: " + countPortugueseInQueens);


var porcentaje = (countPortugueseInQueens  / countPortuguese) * 100;

print("Porcentaje de restaurantes de comida Portuguesa en el barrio de Queens: " + porcentaje.toFixed(2) + "%");
