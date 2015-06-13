Quelques scripts pour commencer à s'amuser avec des sources d'images.

Actuellement, juste quelques fonctions en vrac pour :

* interroger l'API flickr et traiter les réponses
* télécharger efficacement une liste d'images
* télécharger une liste d'images depuis un RSS tumblr

Un des buts est de s'amuser avec les "commons" (photos historiques et d'archives, libres de droit, généralement) : https://www.flickr.com/commons

Un autre but serait de faire tourner quelques algorithmes de traitement d'image (détections de zone d'intérêt, composition et recadrage automatique).

Enfin, dernière idée, dans la même démarche que le bot @archillect de Murat Pak, un système fonctionnant selon un système “d'interestingness” (celle de flickr ou une version recalculée à partir du nombre de vues et d'interactions).

### Branche de dev

la branche `dev/objectdetect` contient une version utilisant `js-objectdetect` (https://github.com/mtschirs/js-objectdetect/) et capable d'extraires les visages des images du résultat de recherche flickr.

### Clef d'API Flickr

Pour l'utiliser (la partie flickr), vous aurez besoin d'une clef pour l'API (et donc d'avoir un compte Flickr) : créez un fichier `flickrKey.json` à la raçine de votre projet, suivant le modèle suivant :

```
{
      "api_key": "azertyuiop1234567890",
      "secret": "azertyuiop1234567890"
}
```

### Flickr Commons :

<a href="https://www.flickr.com/photos/ashassin/18122236134" title="Forgotten faces 1 by 0gust1, on Flickr"><img src="https://c1.staticflickr.com/1/344/18122236134_1e8abe49c6_z.jpg" width="441" height="640" alt="Forgotten faces 1"></a>


