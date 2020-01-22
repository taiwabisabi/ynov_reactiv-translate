# Reactiv’ Translater | M2 IOT & WebMobile

## Mise en place 

```
# git clone
# npm install
# npm start 
```

> Afin de traiter au mieux les audios et la traduction, nous avons mis en place une API externe.  
> Cette API est la passerelle entre notre application et les deux API de google, Speech-To-Text & Translate    
> Elle est hébergé sur [Heroku](https://api-translatov.herokuapp.com/) | voir le [git](https://github.com/AoH95/apiTranslatorApp)

## Rappel cahier des charges
Il s’agit d’une application d’écoute et de traduction.  
L’application présentera trois écrans :  
*  L’accueil
*  Historique
*  Réglages

#### Accueil   
Cette écran comportera un bouton pour que l’utilisateur puisse enregistrer un mot ou une phrase.   

Lorsque la phrase est enregistré, l’utilisateur aura la possibilité de l’écouter.   
Il pourra alors soit la refaire ou bien la soumettre à la traduction.   
L’application va tout d’abord retranscrire l’audio en texte et détecter la langue.   

Ensuite elle va traduire le texte dans la langue souhaité.   
L’application va retourner le texte de base avec la traduction associé.   

Chaque requête est enregistré dans l’historique   

#### Historique   
Cette écran présentera l’historique de toute les requêtes de traduction.   

#### Réglages    
Cette écran présentera les éléments de réglages :   
*  Choix de la langue de traduction par défaut par mis une liste de choix (défaut: Anglais)    
*  Max de requêtes enregistrer dans l’historique (défaut: 20)   


#### Technologies utilisées    
*  React native & redux    
*  Google Speech-to-text API (cf. https://cloud.google.com/speech-to-text/)    
*  Google Translate API (cf. https://cloud.google.com/translate/)    
*  Expo Audio (cf. https://docs.expo.io/versions/latest/sdk/audio/)    
*  Expo FileSystem (cf. https://docs.expo.io/versions/latest/sdk/filesystem/)    


#### Équipe   
Hardy Milalu  
Josué Drack  
Valentin Leymonie  
Huu-Tai Le  
