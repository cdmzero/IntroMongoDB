db = db.getSiblingDB("Hosteleria");

var cursor = db.Restaurantes.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      address: 1,
      scoreSum: {
        $sum: "$grades.score"
      }
    }
  },
  {
    $match: {
      scoreSum: { $gt: 90 }
    }
  },
  {
    $sort: {
      scoreSum: -1
    }
  }
]);

var contador = 1;

cursor.forEach(function(doc) {
  print(contador + ". Nombre del restaurante: " + doc.name);
  print("   Dirección: " + doc.address.building + " " + doc.address.street + ", " + doc.address.zipcode);
  print("   Puntuación total: " + doc.scoreSum);
  contador++;
});

contador--

print("")
print("Datos relevantes:")
print("Numero total de restaurantes de restaurantes con una puntacion mayor a 90: " + contador);

var countTotal = db.Restaurantes.count({});


var porcentaje = (contador  / countTotal) * 100;

print("Porcentaje de restaurantes con una puntacion mayor a 90: " + porcentaje.toFixed(2) + "%");
