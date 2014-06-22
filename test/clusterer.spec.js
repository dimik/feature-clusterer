var util = require('util');
var should = require("should");

describe("FeatureClusterer", function () {
  var FeatureClusterer = require('../src/feature-clusterer');

  it("can be instantiated", function (done) {
    var clusterer = new FeatureClusterer();

    clusterer.should.be.an.Object;
    clusterer.should.have.property('clusterize').and.be.a.Function;

    done();
  });

  describe("#clusterize()", function () {
    var clusterer = new FeatureClusterer({ zoom: 10 });
    var geojson = require('./json/geo.json');

    it("can be invoked", function (done) {
      var result = clusterer.clusterize(geojson);

      done();
    });

    it("should return GeoJSON", function (done) {
      var result = clusterer.clusterize(geojson);

      result.should.be.an.Object
        .with.properties({ type: 'FeatureCollection'})
        .and.property('features').and.be.an.Array
        .and.have.property('length').greaterThan(0);

      result.features.should.matchEach(function (feature) {
        return feature.type === 'Feature' &&
          feature.geometry && /Point/.test(feature.geometry.type) &&
          Array.isArray(feature.geometry.coordinates);
      });

      done();
    });


    it("should return clusters with proper type and data", function (done) {
      var result = clusterer.clusterize(geojson);

      result.features.filter(function (feature) {
        feature.geometry.type === 'MultiPoint';
      })
      .forEach(function (cluster) {
        cluster.geometry.should.have.property('type', 'MultiPoint');
        cluster.geometry.should.have.property('coordinates').and.be.an.Array.with.lengthOf(1);
        var bbox = cluster.should.have.property('bbox').and.be.an.Array.with.lengthOf(4);
        cluster.geometry.coordinates[0][0].should.be.a.Number.within(bbox[0], bbox[2]);
        cluster.geometry.coordinates[0][1].should.be.a.Number.within(bbox[1], bbox[3]);
        cluster.should.have.property('properties').and.be.an.Object.with.length.geraterThan(0);
      });

      done();
    });
  });

});
