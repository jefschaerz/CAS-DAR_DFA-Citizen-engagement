Markdown sheet :
https://guides.github.com/pdfs/markdown-cheatsheet-online.pdf
# Description de l'application
L'applicaton permet de signaler des problèmes détectés dans la localité de RENAN (BE).

## Structure des sources :

\Src\App

* \alerts :	Gestion des alerters et messages
* \api : 	Gestion de l'API
* \issues :	Gestion des issues (manage issue, list issues, manage issue comments,..) 
* \map :	Gestion de la carte 
* \models :	Modèles de données pourl l'API ou autre
* \newregistration-page : Gestion de la page pour une nouvelle inscription 
* \securtiy : Gestion du login, logout ou des guards 
* \shared	: Gestion des services partagés dans l'application
* \user-menu :	Gestion du menu pour l'utilisateur (profile pas implémenté)

# Utilisation de l'application
Quelques explications sur la méthode d'utilisaton de l'application

## Login ou nouvelle inscription
En arrivant sur l'application on ne peut que se connecter ou alors créer un nouveau compte.

## Information formulaires :
Template Driver avec validation et contrôle des required
- Newregistration.html
- ManageIssue.html

## Liste des utilisateurs
Quelques utilisateurs sont déjà crées et peuvent être utilisés.

### Utilisateur avec droits "Staff"

* Username : admin / Password : admin
### Utilisateur avec droits "Citizen"
* Username : jeanfrancois / Password : 1234 
* Username : jdoe / Password : changeme
* Username : usera / Password : usera 
* Username : userz / Password : userz

# Choix lors du développement
Quelques explications sur les choix et comment utiliser l'application

## Utilisation de pattern dans environnement
Pour le contrôle de la saisie des champs des formulaire.

## Choix faits :
* Après l'ajout d'une issue, on se déplace sur la liste des toutes les issues
* Lors de la mise à jour d'une issue, on renvoi toutes les infos et non pas seulement celle qui ont changées
	--> amélioration possible.

## Chargement des commentaires par Issue:
Réalisé par un service qui chargement par page

## Formulaire "Edit Issue" pour l'édition et la visualisation
Ce formulaire (manageIssueComponent) est utilisé pour l'ajout, l'édition et la visualisation des données d'une issue.
Des condition ngIf, [hidden] et [disabled] sont utilisés sur les composants pour changer l'état en fonction de si :
* on édite (isEditable), 
* si on ajoute (isNewIssue) 
* ou encore si c'est une propre issue de l'utilisateur connecté (isUserIssue)

## Ajout d'une issue
Lors de l'ajout d'une issue, l'application tente de récupérer la position de l'utilisateur.
Si elle n'est pas autorisé, on utilise le point centrale du village, mais l'utilisateur peut clique sur la carte pour indiquer l'emplacement.

## Structure du projet :

## External library :
ngx-bootstrap
bootstrap


## Améliorations possibles (beaucoup)
* Lors de la récupération des comments ou des issue types par page, il faudrait pouvoir extraire de la réponse le nombre total dispo (actuellement fixe)
* L'affichage des alerts (en haut à droite) ne devrait pas faire descendre le reste des infos. Pénible visuellement
* Contrôle dans le New registration qu'un rôle a bien été sélectionné
* Affichage de l'adresse en combinaison des coordonnées Lat/Long
* Dans la liste des issues, un click sur une issue indique le marker (couleur)
* Lors de l'édition d'une issue, afficher le marqueur en couleur.
* Formattage des dates au format local (fr)
* Lors de l'affichage d'alerte, cela ne devrait pas décaler vers le bas le reste de l'affichage
* Définir une limite pour l'ajout des marker (limite de la commune)
* Amélioration de l'interface utilisateur
* Mémorisation de la naviguation pour faciliter les retours en arrière et revenir à l'état d'avant (surtout lors du retour à "See issues")


## Icon used
Bootstrap do not include icon by default.
We choose to use Font Awesome (https://fontawesome.com/)
Installation according to https://softaox.info/best-way-to-use-bootstrap-and-fontawesome-using-npm-in-angular-app/

code : npm install font-awesome --save

Add in angular.json in styles
Restart Visual studio Code

## Package uses (from : package.json)

[Ce link](http://www.sontex.ch)

## Ressources :
Pagination ngx-bootstrap : https://valor-software.com/ngx-bootstrap/#/pagination

Pagination help : https://dimitr.im/pagination-component-angular-2


# CitizenEngagement - Default infos

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

