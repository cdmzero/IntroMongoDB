// Etapa 1: Calcular los totales de retiros por hora
var hourlyTotals = db.viajes.aggregate([
    {
        $project: {
            RetiroDate: { $dateFromString: { dateString: { $arrayElemAt: [ { $split: ["$IDUsuario;RetiroDT;RetiroEstacion;AnclajeDT;AnclajeEstacion", ";"] }, 1 ] } } }
        }
    },
    {
        $group: {
            _id: {
                year: { $year: "$RetiroDate" },
                month: { $month: "$RetiroDate" },
                day: { $dayOfMonth: "$RetiroDate" },
                hour: { $hour: "$RetiroDate" },
            },
            count: { $sum: 1 }
        }
    },
    {
        $sort: {
            "_id.year": 1,
            "_id.month": 1,
            "_id.day": 1,
            "_id.hour": 1,
        }
    }
]);

var hourlyCounts = {}; // Objeto para almacenar los totales de retiros por hora
var totalRetiros = 0;

hourlyTotals.forEach(function (hourlyDoc) {
    var day = hourlyDoc._id.day;
    var month = hourlyDoc._id.month;
    var year = hourlyDoc._id.year;
    var hour = hourlyDoc._id.hour;

    // Verificar si hemos cambiado de día
    if (!hourlyCounts[hour]) {
        hourlyCounts[hour] = 0;
    }

    var count = hourlyDoc.count;
    hourlyCounts[hour] += count;
    totalRetiros += count;
});

var currentDay = null;

hourlyTotals.forEach(function (hourlyDoc) {
    var day = hourlyDoc._id.day;
    var month = hourlyDoc._id.month;
    var year = hourlyDoc._id.year;
    var hour = hourlyDoc._id.hour;

    if (currentDay !== day) {
        print("Fecha: " + day + "/" + month + "/" + year);
        currentDay = day;
    }

    var count = hourlyDoc.count;

    // Calcular el porcentaje de retiros por hora en relación con el total de retiros del día
    var percentagePerHour = ((count / totalRetiros) * 100).toFixed(2);

    // Mostrar la hora en formato "18:00"
    var formattedHour = hour.toString().padStart(2, '0');
    print(formattedHour + ":00 - Porcentaje general de retiros: " + percentagePerHour + "%");
});

// Etapa 2: Calcular los retiros por minuto y los porcentajes
var results = db.viajes.aggregate([
    {
        $project: {
            RetiroDate: { $dateFromString: { dateString: { $arrayElemAt: [ { $split: ["$IDUsuario;RetiroDT;RetiroEstacion;AnclajeDT;AnclajeEstacion", ";"] }, 1 ] } } }
        }
    },
    {
        $group: {
            _id: {
                year: { $year: "$RetiroDate" },
                month: { $month: "$RetiroDate" },
                day: { $dayOfMonth: "$RetiroDate" },
                hour: { $hour: "$RetiroDate" },
                minute: { $minute: "$RetiroDate" }
            },
            count: { $sum: 1 }
        }
    },
    {
        $sort: {
            "_id.year": 1,
            "_id.month": 1,
            "_id.day": 1,
            "_id.hour": 1,
            "_id.minute": 1
        }
    }
]);

var currentYear = null;
var currentMonth = null;
var currentDay = null;
var currentHour = null;
var minuteCounts = {}; // Objeto para almacenar los retiros por minuto en la hora actual
var maxMinutes = {}; // Objeto para almacenar los minutos con más retiros por hora
var maxCount = 0;
var hourlySummary = {}; // Objeto para almacenar el resumen de retiros por hora
var dailyTotal = 0;
var hourlyMinutes = {}; // Arreglo bidimensional para almacenar minutos con más retiros por hora

results.forEach(function (doc) {
    var year = doc._id.year;
    var month = doc._id.month;
    var day = doc._id.day;
    var hour = doc._id.hour;
    var minute = doc._id.minute;

    if (currentHour === null || currentHour !== hour) {
        if (currentHour !== null) {
            // Mostrar los minutos con más retiros y reiniciar las variables
            if (maxMinutes[currentHour] && maxMinutes[currentHour].length > 0) {
                print("Minutos con más retiros en la hora " + currentHour + ": " + maxMinutes[currentHour].join(', ') + " - Cantidad: " + maxCount + " (" + ((maxCount / hourlyCounts[currentHour]) * 100).toFixed(2) + "%)");
            } else {
                print("No hay minutos con más retiros en la hora " + currentHour + ".");
            }
            print("\n");
            maxMinutes[currentHour] = [];
            maxCount = 0;
        }
        currentHour = hour;
        minuteCounts = {}; // Restablecer los totales por minuto
    }
    if (currentYear !== year || currentMonth !== month || currentDay !== day) {
        if (currentYear !== null) {
            print("\nFecha: " + currentDay + "/" + currentMonth + "/" + currentYear);
            print("--------------------------------------------");
            // Mostrar un resumen de las horas con más retiros en ese día
            print("Resumen de las horas con más retiros en ese día:");
            for (var hourKey in hourlySummary) {
                var percentageOfDaily = ((hourlySummary[hourKey] / dailyTotal) * 100).toFixed(2);
                print("Hora " + hourKey + ": Total de retiros: " + hourlySummary[hourKey] + " (" + percentageOfDaily + "%)");
                if (hourlyMinutes[hourKey] && hourlyMinutes[hourKey].length > 0) {
                    print("Minutos con más retiros en la hora " + hourKey + ": " + hourlyMinutes[hourKey].join(', '));
                }
                print("\n");
            }

            currentYear = year;
            currentMonth = month;
            currentDay = day;
            hourlySummary = {};
            dailyTotal = 0;
            hourlyMinutes = {};
        } else {
            currentYear = year;
            currentMonth = month;
            currentDay = day;
        }
    }

    var count = doc.count;
    minuteCounts[minute] = count;

    // Calcular el porcentaje de retiros por minuto en relación con el total de retiros de esa hora
    var percentagePerMinute = ((count / hourlyCounts[hour]) * 100).toFixed(2);

    // Mostrar la hora y minuto en formato "18:01"
    var formattedTime = hour.toString().padStart(2, '0') + ":" + minute.toString().padStart(2, '0');
    print("Minuto " + formattedTime + " - Cantidad de Retiros: " + count + ", Porcentaje respecto a la hora: " + percentagePerMinute + "%");

    // Verificar si este minuto tiene más retiros que el máximo registrado
    if (count > maxCount) {
        maxMinutes[currentHour] = [formattedTime]; // Nuevo minuto con más retiros
        maxCount = count;
    } else if (count === maxCount) {
        maxMinutes[currentHour].push(formattedTime); // Agregar este minuto a los máximos si tiene la misma cantidad de retiros
    }

    // Actualizar el resumen de retiros por hora
    if (!hourlySummary[hour]) {
        hourlySummary[hour] = 0;
    }
    hourlySummary[hour] += count;

    // Actualizar el total diario de retiros
    dailyTotal += count;

    // Actualizar el arreglo bidimensional de minutos con más retiros por hora
    if (!hourlyMinutes[hour]) {
        hourlyMinutes[hour] = [];
    }
    if (count === maxCount) {
        hourlyMinutes[hour].push(formattedTime);
    } else if (count > maxCount) {
        hourlyMinutes[hour] = [formattedTime];
        maxCount = count;
    }
});

// Mostrar los minutos con más retiros al final del bucle
if (currentHour !== null) {
    if (maxMinutes[currentHour] && maxMinutes[currentHour].length > 0) {
        print("Minutos con más retiros en la hora " + currentHour + ": " + maxMinutes[currentHour].join(', ') + " - Cantidad: " + maxCount + " (" + ((maxCount / hourlyCounts[currentHour]) * 100).toFixed(2) + "%)");
    } else {
        print("No hay minutos con más retiros en la hora " + currentHour + ".");
    }
    maxMinutes[currentHour] = [];
}

// Mostrar el último día

while(currentDay)

if (currentYear !== null) {
    print("\nFecha: " + currentDay + "/" + currentMonth + "/" + currentYear);
    print("------------------------------------------------");
    // Crear un arreglo para almacenar los porcentajes
    var percentages = [];
    // Mostrar un resumen de las horas con más retiros en ese día
    print("Resumen de las horas con mas retiros en ese dia");
    print("------------------------------------------------");
    print("\n");
    for (var hourKey in hourlySummary) {
        var percentageOfDaily = ((hourlySummary[hourKey] / dailyTotal) * 100).toFixed(2);
        percentages.push({ hour: hourKey, percentage: percentageOfDaily });
    }

    // Ordenar el arreglo de porcentajes de mayor a menor
    percentages.sort(function(a, b) {
        return b.percentage - a.percentage;
    });

  // Inicializa el contador
var counter = 1;

// Mostrar la lista de horas con porcentajes ordenados
percentages.forEach(function(item) {
    // Muestra el contador y aumenta su valor
    print(counter + ". Hora " + item.hour + ":00 total de retiros: " + hourlySummary[item.hour] + " (" + item.percentage + "%)");
    if (hourlyMinutes[item.hour] && hourlyMinutes[item.hour].length > 0) {
        // Obtén el minuto con más retiros y su cantidad
        var maxRetirosMinute = hourlyMinutes[item.hour][hourlyMinutes[item.hour].length - 1];
        print("   Hora exacta con mas retiros: " + maxRetirosMinute );
    }
    print("\n");

    // Incrementa el contador
    counter++;
});




}
