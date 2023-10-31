db = db.getSiblingDB("ViajeBici");
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
var dailySummaries = {}; // Objeto para almacenar resúmenes diarios

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

    // Crear la clave de fecha en formato "YYYY-MM-DD"
    var dateKey = year + "-" + month.toString().padStart(2, '0') + "-" + day.toString().padStart(2, '0');

    // Inicializar el resumen diario si es necesario
    if (!dailySummaries[dateKey]) {
        dailySummaries[dateKey] = {
            date: dateKey,
            hourlySummary: {},
            hourlyMinutes: {},
            dailyTotal: 0,
        };
    }

    // Actualizar el resumen diario
    var dailySummary = dailySummaries[dateKey];
    if (!dailySummary.hourlySummary[hour]) {
        dailySummary.hourlySummary[hour] = 0;
    }
    dailySummary.hourlySummary[hour] += count;
    dailySummary.dailyTotal += count;
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
                print("Minutos con más retiros en la hora -s: " + maxMinutes[currentHour].join(', ') + " - Cantidad => " + maxCount + " (" + ((maxCount / hourlyCounts[currentHour]) * 100).toFixed(2) + "%)");
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
    

    if (currentYear != year || currentMonth != month || currentDay != day) {
        if (currentYear !== null) {
            print("\nFecha: " + day + "/" + month + "/" + year);
            print("--------------------------------------------");
            currentYear = year;
            currentMonth = month;
            currentDay = day;
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
    print("Hora " + formattedTime + " - Cantidad de retiros: " + count + " Porcentaje respecto a la hora: " + percentagePerMinute + "%");

    // Verificar si este minuto tiene más retiros que el máximo registrado
    if (count > maxCount) {
        maxMinutes[currentHour] = [formattedTime]; // Nuevo minuto con más retiros
        maxCount = count;
    } else if (count === maxCount) {
        maxMinutes[currentHour].push(formattedTime); // Agregar este minuto a los máximos si tiene la misma cantidad de retiros
    }

    // Actualizar el resumen diario de retiros por hora
    var dateKey = year + "-" + month.toString().padStart(2, '0') + "-" + day.toString().padStart(2, '0');
    var dailySummary = dailySummaries[dateKey];
    if (!dailySummary.hourlySummary[hour]) {
        dailySummary.hourlySummary[hour] = 0;
    }
    dailySummary.hourlySummary[hour] += count;
    dailySummary.dailyTotal += count;

    // Actualizar el arreglo bidimensional de minutos con más retiros por hora
    if (!dailySummary.hourlyMinutes[hour]) {
        dailySummary.hourlyMinutes[hour] = [];
    }
    if (count === maxCount) {
        dailySummary.hourlyMinutes[hour].push(formattedTime);
    } else if (count > maxCount) {
        dailySummary.hourlyMinutes[hour] = [formattedTime];
        maxCount = count;
    }
});

// Mostrar los minutos con más retiros al final del bucle
if (currentHour !== null) {
    if (maxMinutes[currentHour] && maxMinutes[currentHour].length > 0) {
        print("Ultima hora con datos, Minuto con más retiros en la hora: " + maxMinutes[currentHour].join(', ') + " - Cantidad => " + maxCount + " (" + ((maxCount / hourlyCounts[currentHour]) * 100).toFixed(2) + "%)");
    } else {
        print("No hay minutos con más retiros en la hora " + currentHour + ".");
    }
    maxMinutes[currentHour] = [];
}


// Mostrar todos los resúmenes diarios
for (var dateKey in dailySummaries) {
    counter = 1;
    var dailySummary = dailySummaries[dateKey];
    print("\nFecha: " + dailySummary.date);
    print("------------------------------------------------");
    var percentages = [];

    // Mostrar un resumen de las horas con más retiros en ese día
    print("Resumen de las horas con mas retiros en ese dia");
    print("------------------------------------------------");
    print("\n");


    var hourlySummaries = [];
for (var hourKey in dailySummary.hourlySummary) {
    var percentageOfDaily = ((dailySummary.hourlySummary[hourKey] / dailySummary.dailyTotal) * 100).toFixed(2);
    hourlySummaries.push({
        hour: hourKey,
        totalRetiros: dailySummary.hourlySummary[hourKey],
        percentage: parseFloat(percentageOfDaily),
    });
}

// Ordenar el array de hourlySummaries de mayor a menor por el campo "percentage"
hourlySummaries.sort(function (a, b) {
    return b.percentage - a.percentage;
});

var counter = 1;
hourlySummaries.forEach(function (hourSummary) {
    print(counter + ". " + hourSummary.hour + ":00h total de retiros => " + hourSummary.totalRetiros + " (" + hourSummary.percentage.toFixed(2) + "%)");
    if (dailySummary.hourlyMinutes[hourSummary.hour] && dailySummary.hourlyMinutes[hourSummary.hour].length > 0) {
        var lastValue = dailySummary.hourlyMinutes[hourSummary.hour][dailySummary.hourlyMinutes[hourSummary.hour].length - 1];
        print("   La hora exacta con mas retiros es " + lastValue);
    }
    print("\n");
    counter++;
});    
}
