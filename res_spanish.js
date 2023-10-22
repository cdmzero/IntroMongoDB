db = db.getSiblingDB("Hosteleria");

var countTotal = db.Restaurantes.find({ cuisine: { $exists: true } }).count();
print("Numero total de restaurantes: " + countTotal);

var countSpanish = db.Restaurantes.find({ cuisine: "Spanish" }).count();
print("Numero total de restaurantes de comida española: " + countSpanish);

var porcentaje = (countSpanish / countTotal) * 100;

print("Porcentaje de restaurantes de comida Española: " + porcentaje.toFixed(2) + "%");
