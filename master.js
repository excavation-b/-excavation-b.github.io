let zone = {
   largeur: window.innerWidth,
   hauteur: window.innerHeight,
   ratio: window.innerWidth / window.innerHeight,
   canvas: null
}

let sources = [
   'assets/A.jpg',
   'assets/B.jpg',
   'assets/C.jpg',
   'assets/D.jpg',
]

let rayon_pelle = window.innerWidth < window.innerHeight ? Math.ceil( window.innerWidth / 4 ) : Math.ceil( window.innerHeight / 4 );
let images_prechargees = [];
let dispositif = null;

/*
function preload() {
   for (var i = 0; i < sources.length; i++) {
      images_prechargees.push( loadImage( sources[i] ) );
   }
}
*/
var gp = null;

let croquis = function ( p ) {
   gp = p;

  p.preload = function () {
     for (var i = 0; i < sources.length; i++) {
        images_prechargees.push( p.loadImage( sources[i] ) );
     }
  }

  p.setup = function () {
     zone.canvas = p.createCanvas( zone.largeur, zone.hauteur );
     dispositif = new Calques( zone, images_prechargees, pixels_cercle( zone.largeur, rayon_pelle ), p );
     zone.canvas.canvas.addEventListener('mousemove', function (e) {
        //console.log(e);
        /*
        // si on est dans la zone interieur du dispositif, pas trop près des obtenir_coordonnees
        console.log( e.clientX, rayon_pelle/2, e.clientX > rayon_pelle/2)
        console.log( e.clientX, window.innerWidth, rayon_pelle/2, e.clientX < window.innerWidth - rayon_pelle/2);
        console.log( e.clientY, rayon_pelle/2, e.clientY > rayon_pelle/2)
        console.log( e.clientY, window.innerHeight, rayon_pelle/2, e.clientY < window.innerHeight - rayon_pelle/2);
        if ( e.clientX > rayon_pelle && e.clientX < window.innerWidth - rayon_pelle && e.clientY > rayon_pelle && e.clientY < window.innerHeight - rayon_pelle ) {
           console.log("oui")*/
           dispositif.creuser( e.clientX, e.clientY );
           window.requestAnimationFrame( updatetout() );
        //} else { console.log("non")}
     }, false)
     p.noLoop();
  }

  p.draw = function  () {
     if ( dispositif.maj_demandee ) {
        p.clear();
        dispositif.majcalques();
        dispositif.actualiser_calques();
        for (var i = dispositif.calques.length - 1; i >= 0 ; i--) {
           p.image( dispositif.calques[i].image, 0, 0 );
        }
        dispositif.maj_demandee = false;
     }
  }
}

function updatetout () {
   if ( dispositif.maj_demandee ) {
     gp.clear();
     dispositif.majcalques();
     dispositif.actualiser_calques();
     for (var i = dispositif.calques.length - 1; i >= 0 ; i--) {
         gp.image( dispositif.calques[i].image, 0, 0 );
     }
     dispositif.maj_demandee = false;
   }
}

document.body.querySelector('.btn').addEventListener('click', function(){
   creuser();
   document.body.querySelector('.accueil').style.display = "none";
   let instance = new p5( croquis );
})

/*
function setup() {
   zone.canvas = createCanvas( zone.largeur, zone.hauteur );
   dispositif = new Calques( zone, images_prechargees, pixels_cercle( zone.largeur, rayon_pelle ) );
   zone.canvas.canvas.addEventListener('mousemove', function (e) {
      //console.log(e);
      dispositif.creuser( e.clientX, e.clientY );
   }, false)
}

function draw () {
   if ( dispositif.maj_demandee ) {
      clear();
      dispositif.actualiser_calques();
      for (var i = dispositif.calques.length - 1; i >= 0 ; i--) {
         image( dispositif.calques[i].image, 0, 0 );
      }
      dispositif.maj_demandee = false;
   }
}
*/

function calculer_distance ( p1, p2 ) {
   var a = p1.x - p2.x;
   var b = p1.y - p2.y;

   return Math.sqrt( a*a + b*b );
}

function proximite_suffisante ( p1, p2, distance_max ) {
   var a = p1.x - p2.x;
   var b = p1.y - p2.y;

   return Math.sqrt( a*a + b*b ) <= distance_max;
}

function obtenir_coordonnees ( n, largeur ) {
   /**/
   let x = n % largeur;
   let y = Math.floor( n / largeur );
   return {x:x, y:y};
}

function obtenir_numero ( x, y, largeur ) {
   /**/
   return x + y * largeur;
}

function pixels_cercle ( largeur, rayon ) {
   /*
   une liste de pixel
   sur une ligne aussi large que notre compo
   hauteur = rayon voulu * 2 + 1
   on part du pixel au centre vertical et horizontal
   on teste ceux à distance rayon
   pour chaque :
   on prend i - nbpixels/2
   */
   var pixels_cercle = [];
   var hauteur = rayon * 2 + 1;
   var nb_pixels_zone = hauteur * largeur;
   var pixel_central = { x: Math.round( largeur / 2 ), y: rayon + 1 };
   for (var i = 0; i < nb_pixels_zone; i++) {
      //if ( i < nb_pixels_zone/2 && i < nb_pixels_zone/2 + 20 ) { console.log(proximite_suffisante( pixel_central, obtenir_coordonnees( i, largeur ), rayon ))}
      if ( proximite_suffisante( pixel_central, obtenir_coordonnees( i, largeur ), rayon ) ) {
         //console.log('->',i);
         pixels_cercle.push(Math.floor(i-nb_pixels_zone/2));
      }
   }
   return pixels_cercle;
}
