var util = require('./util');
var Feature = require('./feature');
var ProjectionFactory = require('./projection/factory');
var projection = new ProjectionFactory();
var GridClusterer = require('./grid-clusterer');

module.exports = FeatureClusterer;

function FeatureClusterer(options) {
  this._options = util.extend({}, this.getDefaults(), options);
  this._createProjection(this._options.projection);
}

var ptp = FeatureClusterer.prototype;

ptp.clusterize = function (geojson) {
  var options = this._options;
  var clusterer = new GridClusterer(options);

  geojson.features.forEach(function (data) {
    clusterer.add(new Feature(data, options));
  });

  return util.extend({}, geojson, {
    features: clusterer.getResults().map(function (feature) {
      return feature.toJSON();
    })
  });
};

ptp._createProjection = function (name) {
  this._options.projection = projection.create(name);
}

ptp.getDefaults = function () {
  return {
    gridSize: 80,
    margin: 10,
    projection: 'sphericalMercator'
  };
};
