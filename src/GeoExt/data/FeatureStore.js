Ext.define('GeoExt.data.FeatureStore', {
    extend: 'Ext.data.Store',

    statics: {
        LAYER_TO_STORE: 1,
        STORE_TO_LAYER: 2
    },

    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    },

    /**
     * @property {OpenLayers.Layer.Vector} layer
     * Vector layer that the store is synchronized with, if any.
     */
    layer: null,

    /**
     * @cfg {Number} initDir
     *  Bitfields specifying the direction to use for the initial sync between
     *  the layer and the store, if set to 0 then no initial sync is done.
     *  Defaults to ``GeoExt.data.FeatureStore.LAYER_TO_STORE|GeoExt.data.FeatureStore.STORE_TO_LAYER``
     */

    /**
     * @config {Object} Creation parameters
     * @private
     */
    constructor: function(config) {
        config = Ext.apply({}, config);

        var layer = config.layer;
        delete config.layer;

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
                // FIXME
            }, this);
        }

        if (initDir & GeoExt.data.FeatureStore.LAYER_TO_STORE) {
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
        this.data.on({
            'replace': this.onReplace,
            scope: this
        });

        this.fireEvent("bind", this, this.layer);
    },

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
            this.data.un({
                'replace': this.onReplace,
                scope: this
            });
            this.layer = null;
        }
    },

    /**
     * Returns the model instance corresponding to a feature.
     */
    getByFeature: function(feature) {
        // FIXME
    },

    onFeaturesAdded: function(evt) {
        this.loadRawData(evt.features, true);
    },

    onFeaturesRemoved: function(evt) {

    },

    onFeaturesModified: function(evt) {

    },

    onLoad: function(store, records, successful) {

    },

    onClear: function(store) {

    },

    onAdd: function(store, records, index) {

    },

    onRemove: function(store, record, index) {

    },

    onUpdate: function(store, record, operation) {

    },

    onReplace: function() {

    }
});
