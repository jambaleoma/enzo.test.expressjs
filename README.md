ExpressJS Server for ccmfrontend Angular Application 
====================================
This is a Middelware written in ExpressJS for TelecomItalia "Stazione di Configurazione"
The middelware intercept incaming request and redirect vs a specific Angular's route.

Prerequisites
=================

Install nodeJS and run `npm install` for download and install dependencies

Run application 
================

Replace the `/public` folder with the build of Angular application (spindox.ccm.frontend)

Start server running `npm start`

Deploy Application on Openshift
===============

Deploy application using :

```
oc new-project catalogo 
oc new-build --strategy docker --binary --name ccmfrontend
oc start-build ccmfrontend --from-dir . --follow (execute [only] this command for future builds)
oc new-app ccmfrontend
```
Deploy Complete Demo with CI/CD
================

In order to abilitate CI/CD create Jenkins pipeline in Openshift trought `pipeline.yaml` and `Jenkinsfile` import in Openshift project `catalogo`
