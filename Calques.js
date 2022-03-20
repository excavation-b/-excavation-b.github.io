class Calques {
   constructor ( zone, images_prechargees, data_cercle, p5 ) {
      /**/
      this.p5 = p5;
      this.zone = zone;
      this.zone.pixels = this.zone.largeur * this.zone.hauteur;
      this.calques = [];
      this.initialiser_calques( images_prechargees );
      this.calques_actifs = [this.calques[0]];
      this.data_cercle = data_cercle;
      this.maj_demandee = true;
      this.pourcentage_a_creuser = 0.7;
   }

   initialiser_calques ( images_prechargees ) {
      for (var i = 0; i < images_prechargees.length; i++) {
         //console.log('n',i);
         this.ajouter_calque( images_prechargees[i], i );
      }
   }

   ajouter_calque ( image_source, id ) {
      /* on donne la référence d'une image */
      this.calques.push( new Calque( zone, image_source, id, this ) );
   }

   actualiser_calques ( ) {
      /**/
      // pour chaque calque actif
      //var pc = false;
      for (var c = 0; c < this.calques_actifs.length; c++) {
         this.calques_actifs[c].image.loadPixels();
         //console.log("calque",c)
         //console.log(c,'l',this.calques[c].alpha.length);
         // pour chaque pixel
         for (var i = 0; i < this.calques[c].alpha.length; i++) {
            // si true, alors transparent
            if ( this.calques_actifs[c].alpha[i] ) {
               // RGBARGBARGBA
               //    A   A   A
               // 01234567890A
               //    3   7   10
               this.calques_actifs[c].image.pixels[i*4+3] = 0;
               //pc = true;
            }
         }
         this.calques_actifs[c].image.updatePixels();
      }
      // si le dernier calque actif a un pourcentage de remplissage suffisant, et que c'est le dernier calque actif mais pas l'avant dernier tous calques confondus
      /*
      ca = 0 1
      c  = 0 1 2 3
      l  = 1 2 3 4
      */

      //console.log('pc',pc);
   }

   majcalques () {
         //console.log( this.calques_actifs.length,"/",this.calques.length,"calques activés");
         //console.log( "il reste",this.calques.length-this.calques_actifs.length -1, "à activer" );

      // s'il reste des cables activables
      if ( this.calques_actifs.length < this.calques.length - 1 ) {
         //console.info("on peut activer des calques");

         //console.log("le dernier calque actif a",this.calques_actifs[ this.calques_actifs.length - 1 ].pixels_creuses,"pixels creuses sur",this.calques_actifs[ this.calques_actifs.length - 1 ].alpha.length,"soit",this.calques_actifs[ this.calques_actifs.length - 1 ].pixels_creuses / this.calques_actifs[ this.calques_actifs.length - 1 ].alpha.length*100,"%")
         if ( this.calques_actifs[ this.calques_actifs.length - 1 ].pixels_creuses / this.calques_actifs[ this.calques_actifs.length - 1 ].alpha.length > this.pourcentage_a_creuser ) {
            this.calques_actifs.push( this.calques[ this.calques_actifs.length ] );
            //console.log( "ajout calque",this.calques_actifs.length );
         }
      // on regarde le pourcentage creusé pour voir ce qu'il reste à creuser
         //this.calques[ c ].pourcentage_creuses = this.calques[ c ].pixels_creuses / this.calques[ c ].alpha.length;
      }
   }

   creuser ( x, y ) {
      /*
         on va mettre à jour chaque image en partant de celle du dessus.
         1) On identifie la liste des pixels à éditer
         2) pour chaque pixel dans la zone de la pelle
            a) on regarde le preimer calque :
               * si le pixel est non transparent, on le rend transprent et on passe à la suite
               * sinon on regarde le calque du dessous
      */
      //console.log("creuser("+x+","+y+")");
      // le pixel sur lequel on a cliqué
      var numero_pixel_base = obtenir_numero( x, y, this.zone.largeur );
      var pixels_a_traiter = [];

      // on liste tous les pixels potentiels
      for (var i = 0; i < this.data_cercle.length; i++) {

         // on obtient leur numéro
         var numero_pixel = numero_pixel_base + this.data_cercle[i];

         // si > 0 on traite, sinon on continue
         if ( numero_pixel < 0 ) { continue } else {
            pixels_a_traiter.push( numero_pixel );
         }
      }
      //var pixel_courant = pixels_a_traiter.pop();
      //this.traitement_pixels( pixel_courant, pixels_a_traiter );
      // pour chaque pixel
      //console.log(pixels_a_traiter)
      for ( var p = 0; p < pixels_a_traiter.length; p++ ) {
         // pour chaque calque sauf le dernier en partant du premier
         for ( var c = 0; c < this.calques_actifs.length ; c++ ) {
            // si le calque n'est pas transparent on le rend transparent et on sors de la boucle
            if ( !this.calques_actifs[ c ].alpha[ pixels_a_traiter[ p ] ] ) {
               this.calques_actifs[ c ].alpha[ pixels_a_traiter[ p ] ] = true;
               this.calques_actifs[ c ].pixels_creuses += 1;
               break;
            }
         }
      }
      this.maj_demandee = true;
   }

   traitement_pixels ( pixel_courant, pixels_restants, niveau = 0 ) {
      // fonction récursive abandonnée
      //console.log("----")
      //console.log("in",pixel_courant, pixels_restants, niveau)

      /* si calque courant transparent (true) : */
      if ( this.calques[niveau].alpha[ pixel_courant ] ) {
         // s'il reste encore un calque avant le dernier
         // on passe au niveau suivant
         if ( niveau > this.calques.length - 2 ) {
            niveau+=1;
         // sinon
         } else {
            // s'il reste des pixels
            if ( pixels_restants.length > 0 ) {
               pixel_courant = pixels_restants.pop();
               niveau = 0;
            } else {
               // sinon on a terminé
               niveau = -1;
            }
         }
      // si le calque n'est pas transparent
      } else {
         // on le rend transparent
         this.calques[niveau].alpha[ pixel_courant ] = true;
         // s'il reste des pixels
         if ( pixels_restants.length > 0 ) {
            pixel_courant = pixels_restants.pop();
            niveau = 0;
         } else {
            // sinon on a terminé
            niveau = -1;
         }
      }
      // suivant
      if ( niveau > -1 ) {
         //console.log("out",pixel_courant, pixels_restants, niveau)
         this.traitement_pixels ( pixel_courant, pixels_restants, niveau );
      }
   }

   coordonnees ( x, y ) {
      /* conversion x,y -> n° de pixel */
      return y * this.zone.largeur + x;
   }

   dessiner () {
      /*
         On dessine chaque image l'une sur l'autre
      */
      for (var i = 0; i < calques.length; i++) {
         p.image( calques[i].image, 0, 0 );
      }
   }
}
