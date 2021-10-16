## Working locally accross two projects
### Run npm link while inside the projects root folder
- $ npm link
### Run npm link while inside the project you are working with
- $ npm link @three-horned-helmet/combat-system-mega-rpg


## Publish new changes
### Make sure you are part of the organisation on npmjs (three-horned-helmet)
### Update the service version in package.json
### Login with your npmjs user
- $ npm adduser
### Publish
- $ npm publish --access public


## Add a new class
- Create a class (see /combat-system/classes)
- Add the class to classList in GameEngine