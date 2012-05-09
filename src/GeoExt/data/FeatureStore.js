/*
 * Copyright (c) 2008-2012 The Open Source Geospatial Foundation
 *
 * Published under the BSD license.
 * See https://github.com/geoext/geoext2/blob/master/license.txt for the full text
 * of the license.
 */

/**
 * @class GeoExt.data.FeatureStore
 * A store that synchronizes a features array of an ``OpenLayers.Layer.Vector``.
 */
Ext.define('GeoExt.data.FeatureStore', {
    extend: 'Ext.data.Store',
    requires: ['GeoExt.data.reader.Feature'],

    statics: {
        /**
         * @static
         * @property {Number}
         */
        LAYER_TO_STORE: 1,
        /**
         * @static
         * @property {Number}
         */
        STORE_TO_LAYER: 2
    },

    /**
     * @event bind
     * Fires when the store is bound to a layer.
     *
     * @param {GeoExt.data.FeatureStore} store
     * @param {OpenLayers.Layer.Vector} layer
     */

    proxy: {
        type: 'memory',
        reader: {
            type: 'feature',
            idProperty: 'fid'
        }
    },

    /**
     * @cfg {OpenLayers.Layer.Vector} layer
     * Layer that this store will be in sync with. If not provided, the
     * store will not be bound to a layer.
     */

    /**
     * @property {OpenLayers.Layer.Vector} layer
     * Vector layer that the store is synchronized with, if any.
     */
    layer: null,

    /**
     * @cfg {OpenLayers.Layer/Array} features
     * Features that will be added to the store (and the layer, depending on the
     * value of the ``initDir`` option.
     */

    /**
     * @cfg {Number} initDir
     * Bitfields specifying the direction to use for the initial sync between
     * the layer and the store, if set to 0 then no initial sync is done.
     * Defaults to ``GeoExt.data.FeatureStore.LAYER_TO_STORE|GeoExt.data.FeatureStore.STORE_TO_LAYER``
     */

    /**
     * @cfg {OpenLayers.Filter} featureFilter
     * This filter is evaluated before a feature record is added to the store.
     */
    featureFilter: null,

    /**
     * @param {Object} config Creation parameters
     * @private
     */
    constructor: function(config) {
        config = Ext.apply({}, config);

        var layer = config.layer;
        delete config.layer;

        // features option. Alias to data option
        if (config.features) {
            config.data = config.features;
        }
        delete config.features;

        this.callParent([config]);

        var options = {initDir: config.initDir};
        delete config.initDir;

        if (layer) {
            this.bind(layer, options);
        }
    },

    /**
     * @private
     */
    destroy: function() {
        this.unbind();
        this.callParent();
    },

    /**
     * Bind this store to a layer instance, once bound the store
     * is synchronized with the layer and vice-versa.
     *
     * @param {OpenLayers.Layer.Vector} layer The layer instance.
     * @param {Object} options
     */
    bind: function(layer, options) {
        if (this.layer) {
            // already bound
            return;
        }
        this.layer = layer;

        var initDir = options.initDir;
        if (options.initDir == undefined) {
            initDir = GeoExt.data.FeatureStore.LAYER_TO_STORE |
                GeoExt.data.FeatureStore.STORE_TO_LAYER;
        }

        if (initDir & GeoExt.data.FeatureStore.STORE_TO_LAYER) {
            this.each(function(record) {
                layer.addFeatures([record.raw]);
            }, this);
        }

        if (initDir & GeoExt.data.FeatureStore.LAYER_TO_STORE &&
                layer.features.length > 0) {
            // append a snapshot of the layer's features
            this.loadRawData(layer.features.slice(0), true);
        }

        this.layer.events.on({
            'featuresadded': this.onFeaturesAdded,
            'featuresremoved': this.onFeaturesRemoved,
            'featuresmodified': this.onFeaturesModified,
            scope: this
        });
        this.on({
            'load': this.onLoad,
            'clear': this.onClear,
            'add': this.onAdd,
            'remove': this.onRemove,
            'update': this.onUpdate,
            scope: this
        });

        this.fireEvent("bind", this, this.layer);
    },

    /**
     * Unbind this store to his layer instance.
     */
    unbind: function() {
        if (this.layer) {
            this.layer.events.un({
                'featuresadded': this.onFeaturesAdded,
                'featuresremoved': this.onFeaturesRemoved,
                'featuresmodified': this.onFeaturesModified,
                scope: this
            });
            this.un({
                'load': this.onLoad,
                'clear': this.onClear,
                'add': this.onAdd,
                'remove': this.onRemove,
                'update': this.onUpdate,
                scope: this
            });
            this.layer = null;
        }
    },

    /**
     * @return The model instance corresponding to a feature.
     */
    getByFeature: function(feature) {
        return this.getAt(this.findBy(function(record, id) {
            return record.raw == feature;
        }));
    },

    /**
     * @private
     * @param {Ext.data.Model[]} records
     */
    addFeaturesToLayer: function(records) {
        var features = [];
        for (var i = 0, len = records.length; i < len; i++) {
            features.push(records[i].raw);
        }
        this._adding = true;
        this.layer.addFeatures(features);
        delete this._adding;
    },

    /**
     * Handler for layer featuresadded event
     * @private
     * @param {Object} evt
     */
    onFeaturesAdded: function(evt) {
         if (!this._adding) {
            var features = evt.features, toAdd = features;
            if (this.featureFilter) {
                toAdd = [];
                for (var i = 0, len = features.length; i < len; i++) {
                    var feature = features[i];
                    if (this.featureFilter.evaluate(feature) !== false) {
                        toAdd.push(feature);
                    }
                }
            }
            this._adding = true;
            // add feature records to the store, when called with
            // append true loadRawData triggers an "add" event and then a
            // "load" event
            this.loadRawData(toAdd, true);
            delete this._adding;
        }
    },

    /**
     * Handler for layer featuresremoved event
     * @private
     * @param {Object} evt
     */
    onFeaturesRemoved: function(evt) {
        if (!this._removing) {
            var features = evt.features;
            for (var i = features.length - 1; i >= 0; i--) {
                var record = this.getByFeature(features[i]);
                if (record) {
                    this._removing = true;
                    this.remove(record);
                    delete this._removing;
                }
            }
        }
    },

    /**
     * Handler for layer featuresmodified event
     * @private
     * @param {Object} evt
     */
    onFeaturesModified: function(evt) {

    },

    /**
     * Handler for a store's load event
     * @private
     * @param {Ext.data.Store} store
     * @param {Ext.data.Model[]} records
     * @param {Boolean} successful
     */
    onLoad: function(store, records, successful) {
        if (successful) {
            this.addFeaturesToLayer(records);
        }
    },

    /**
     * Handler for a store's clear event
     * @private
     * @param {Ext.data.Store} store
     */
    onClear: function(store) {
        this._removing = true;
        this.layer.removeFeatures(this.layer.features);
        delete this._removing;
    },

    /**
     * Handler for a store's add event
     * @private
     * @param {Ext.data.Store} store
     * @param {Ext.data.Model[]} records
     * @param {Number} index
     */
    onAdd: function(store, records, index) {
        if (!this._adding) {
            // addFeaturesToLayer takes care of setting
            // this._adding to true and deleting it
            this.addFeaturesToLayer(records);
        }
    },

    /**
     * Handler for a store's remove event
     * @private
     * @param {Ext.data.Store} store
     * @param {Ext.data.Model} record
     * @param {Number} index
     */
    onRemove: function(store, record, index) {
        if (!this._removing) {
            var feature = record.getFeature(); // record.raw instead ?
            if (this.layer.getFeatureById(feature.id) != null) {
                this._removing = true;
                this.layer.removeFeatures([feature]);
                delete this._removing;
            }
        }
    },

    /**
     * Handler for a store's update event
     * @private
     * @param {Ext.data.Store} store
     * @param {Ext.data.Model} record
     * @param {Number} operation
     */
    onUpdate: function(store, record, operation) {
        if (!this._updating) {
            //FIXME
        }

    }
});
