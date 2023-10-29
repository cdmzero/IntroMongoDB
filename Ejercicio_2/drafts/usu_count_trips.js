db = db.getSiblingDB("ViajeBici");
var users = db.usuviajes.find();
var counter = 1;

users.forEach(function(user) {
    print("Registro #" + counter + ":");
    var userData = user["IDUsuario;Genero;Edad"].split(";");
    print("ID de Usuario: " + userData[0]);
    print("Genero: " + userData[1]);


    var userId = parseInt(userData[0]);

    var tripsCount = db.viajes.find({ "IDUsuario;RetiroDT;RetiroEstacion;AnclajeDT;AnclajeEstacion": new RegExp("^" + userId + ";") }).count();
    
    
    print("Cantidad de Viajes: " + tripsCount);

    counter++;
});
