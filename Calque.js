class Calque {
   /* chaque calque est composé :
   d'une image de base
   d'un tableau de transparence */
   constructor ( zone, image_source, id, parent ) {
      console.log('!',parent)
      this.id = id;
      this.parent = parent;
      this.alpha = [];
      this.actif = false;
      this.image = null;
      this.zone = zone;
      this.pixels_creuses = 0;
      this.pourcentage_creuse = 0;
      this.initialiser_alpha( );
      this.initialiser_image( image_source );
   }

   pourcentage_creuse () {
      return this.pixels_creuses / this.alpha.length;
   }

   initialiser_alpha ( ) {
      /* Tous les pixels sont initialisés à false */
      var n_pixels = this.zone.largeur * this.zone.hauteur;
      for (var i = 0; i < n_pixels; i++) {
         this.alpha.push( false );
      }
   }

   initialiser_image ( image_source ) {
      /* on dessine l'image dans le canvas et on copie le résultat */
      var parametres = this.calculer_parametres ( image_source );
      console.log( 'parametres', parametres );

      this.parent.p5.image(
         image_source,
         parametres.cible.x,
         parametres.cible.y,
         parametres.cible.largeur,
         parametres.cible.hauteur,
         parametres.source.x,
         parametres.source.y,
         parametres.source.largeur,
         parametres.source.hauteur,
      );

      this.image = this.parent.p5.get();
      this.parent.p5.clear();
   }

   calculer_parametres ( image_source ) {
      /* renvoie les paramètres de découpe de l'image pour rentrer dans le canvas */
      var cible = {};
      var source = {};

      cible.largeur = this.parent.p5.canvas.offsetWidth;
      cible.hauteur = this.parent.p5.canvas.offsetHeight;
      cible.ratio = cible.largeur / cible.hauteur;

      source.largeur = image_source.width;
      source.hauteur = image_source.height;
      source.ratio = source.largeur / source.hauteur;

      // quel côté sera commun cible/source ?
      var cote_commun = cible.ratio > source.ratio ? 'largeur' : 'hauteur' ;
      var ratio = cote_commun === 'largeur' ? cible.largeur / source.largeur : cible.hauteur / source.hauteur;

      // quel % de chaque côté sera utilisé ?
      /*
         pour calculer le pourcentage utilisé du côté tronqué
         on se base sur le côté commun taille cible
         on calcule la taille mise à l'échelle du côté tronqué
         on regarde la différence avec la dimension cible (100%)
         donc taille source / taille cible (= n sur 1)
      */
      var pourcentage_largeur = cote_commun == 'largeur' ? 1 : cible.largeur / (source.largeur * ratio);
      var pourcentage_hauteur = cote_commun == 'hauteur' ? 1 : cible.hauteur / (source.hauteur * ratio);

      /* on souhaite maintenant savoir combien de pixels sont laissés de coté */
      var debut_largeur = Math.floor( (1 - pourcentage_largeur)/2 * source.largeur );
      var debut_hauteur = Math.floor( (1 - pourcentage_hauteur)/2 * source.hauteur );

      /* et le nombre de pixels à placer */
      var pixels_largeur = Math.floor( pourcentage_largeur * source.largeur );
      var pixels_hauteur = Math.floor( pourcentage_hauteur * source.hauteur );

      let sortie = {
         source: {
            x: debut_largeur,
            y: debut_hauteur,
            largeur: pixels_largeur,
            hauteur: pixels_hauteur,
         },
         cible: {
            x: 0,
            y: 0,
            largeur: cible.largeur,
            hauteur: cible.hauteur,
         }
      }

      return sortie;
   }

   dessiner ( debug = false ) {
      /* surtout */
      if ( debug ) {
         image( this.image, 0, 0 );
      }
   }
}
