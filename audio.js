var contexte_audio = window.AudioContext || window.webkitAudioContext;

var contexte = new contexte_audio();

var instruments = {};

function charger_un_sample ( url, nom ) {
  /* charge un sample dont l'URL est donnée en paramètre 1 et le place dans l'objet instrument à l'emplacement de la clé donnée
  String, Function -> Void */

  // on créé l'objet requête
  var requete = new XMLHttpRequest();

  // que l'on paramètre :

  // 1 : requête GET, url de la requête, requête asynchrone : true
  requete.open('GET', url, true);

  // 2 : type de réponse
  requete.responseType = 'arraybuffer';

  // 3 : écouteur onload et fonction a exécuter alors
  requete.onload = function () {

    // les données audio
    var donnees_audio = requete.response;

    // sont passées pour décodage au contexte audio
    contexte.decodeAudioData( donnees_audio, function( buffer ) {

      // on ajoute le buffer à notre objet instruments
      instruments[nom] = buffer;
    });
  };

  // on envoie la requête
  requete.send();
}


charger_un_sample( 'assets/02-export.mp3', 'creuser');

function creuser(){
  var player = contexte.createBufferSource();
  player.buffer = instruments.creuser;
  player.start();
  player.loop = true;
  player.connect(contexte.destination);
}
