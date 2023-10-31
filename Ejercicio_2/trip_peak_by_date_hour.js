db = db.getSiblingDB("ViajeBici");
var results = db.viajes.aggregate([
    {
        $project: {
            RetiroDate: {
                $dateFromString: {
                    dateString: { $arrayElemAt: [ { $split: ["$IDUsuario;RetiroDT;RetiroEstacion;AnclajeDT;AnclajeEstacion", ";"] }, 1 ] }
                }
            }
        }
    },
    {
        $group: {
            _id: {
                year: { $year: "$RetiroDate" },
                month: { $month: "$RetiroDate" },
                day: { $dayOfMonth: "$RetiroDate" },
                hour: { $hour: "$RetiroDate" }
            },
            count: { $sum: 1 }
        }
    },
    {
        $sort: {
            "_id.year": 1,
            "_id.month": 1,
            "_id.day": 1,
            count: -1
        }
    }
]);

var resultsByDay = {};
var totalTripsByDay = {};

results.forEach(function (doc) {
    var year = doc._id.year;
    var month = doc._id.month;
    var day = doc._id.day;
    var hour = doc._id.hour;
    var count = doc.count;
    var dateKey = year + "-" + (month < 10 ? "0" : "") + month + "-" + (day < 10 ? "0" : "") + day;

    if (!resultsByDay[dateKey]) {
        resultsByDay[dateKey] = [];
        totalTripsByDay[dateKey] = 0;
    }

    resultsByDay[dateKey].push({
        hour: hour,
        count: count
    });

    totalTripsByDay[dateKey] += count;
});

for (var dateKey in resultsByDay) {
    print("Fecha: " + dateKey);
    var hourlyResults = resultsByDay[dateKey];
    var totalTrips = totalTripsByDay[dateKey];

    hourlyResults.sort(function (a, b) {
        return b.count - a.count;
    });

    for (var i = 0; i < hourlyResults.length; i++) {
        var result = hourlyResults[i];
        var formattedHour = result.hour.toString().padStart(2, '0') + ":00";
        var percentage = ((result.count / totalTrips) * 100).toFixed(2);
        print((i + 1) + ". Hora del día: " + formattedHour + ", Cantidad de Retiros: " + result.count + ", Porcentaje: " + percentage + "%");
    }
   
}
