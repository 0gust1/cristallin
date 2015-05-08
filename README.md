Quelques scripts pour commencer à s'amuser avec des sources d'images.

Actuellement, juste quelques fonctions en vrac pour :

* interroger l'API flickr et traiter les réponses
* télécharger efficacement une liste d'images
* télécharger une liste d'images depuis un RSS tumblr

Un des buts est de s'amuser avec les "commons" (photos historiques et d'archives, libres de droit, généralement) : https://www.flickr.com/commons

Un autre but serait de faire tourner quelques algorithmes de traitement d'image (détections de zone d'intérêt, composition et recadrage automatique).

Enfin, dernière idée, dans la même démarche que le bot @archillect de Murat Pak, un système fonctionnant selon un système “d'interestingness” (celle de flickr ou une version recalculée à partir du nombre de vues et d'interactions).

### Clef d'API Flickr

Pour l'utiliser (la partie flickr), vous aurez besoin d'une clef pour l'API (et donc d'avoir un compte Flickr) : créez un fichier `flickrKey.json` à la raçine de votre projet, suivant le modèle suivant :

```
{
      "api_key": "azertyuiop1234567890",
      "secret": "azertyuiop1234567890"
}
```


