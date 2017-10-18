# INDESY - Indoor delivery system
[![CircleCI](https://img.shields.io/circleci/project/nicklasfrahm/indesy-server/master.svg?style=flat-square&label=master)](https://circleci.com/gh/nicklasfrahm/indesy-server)
[![David](https://img.shields.io/david/nicklasfrahm/indesy-server.svg?style=flat-square)](https://david-dm.org/)

## Description
The server for an indoor delivery system. The server will be used to manage mapping data and to control the indoor delivery system.

## Installation
Be sure to have at least the latest LTS of node installed. Then open a terminal and run:
```shell
npm install
npm start
```

## Models
Every model will additionally have a UUID, which will not be listed in the definition as it is common across all models.

### Chunk
This model describes a part of the map.
```
{
  x: Number,
  y: Number,
  occupied: Number,
  scanned: Number,
  reference: UUID
}
```

### Map
The latitude and the longitude fix the according chunks in space.
```
{
  name: String,
  latitude: Number,
  longitude: Number
}
```