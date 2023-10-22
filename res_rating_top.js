db = db.getSiblingDB("Hosteleria");

var cursor = db.Restaurantes.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      cuisine: 1,
      scoreSum: {
        $sum: "$grades.score"
      }
    }
  },
  {
    $sort: {
      scoreSum: -1
    }
  },
  {
    $limit: 5 // Limita los resultados a los 5 mejores
  }
]);

var tiposDeCocina = {};
var restauranteMasPremiado = null;
var puntuacionMaxima = 0;
var contador = 1;

cursor.forEach(function(doc) {
  var tipoDeCocina = doc.cuisine;
  var puntuacionTotal = doc.scoreSum;

  print(contador + ". Nombre del restaurante: " + doc.name);
  print("   Tipo de cocina: " + tipoDeCocina);
  print("   Puntuación total: " + puntuacionTotal);

  if (!tiposDeCocina[tipoDeCocina]) {
    tiposDeCocina[tipoDeCocina] = 0;
  }

  tiposDeCocina[tipoDeCocina] += 1;

  if (tiposDeCocina[tipoDeCocina] > puntuacionMaxima) {
    puntuacionMaxima = tiposDeCocina[tipoDeCocina];
    restauranteMasPremiado = tipoDeCocina;
  }

  contador++;
});

print("\nDatos relevantes:");
print("El tipo de cocina mejor valorado es: " + restauranteMasPremiado);

