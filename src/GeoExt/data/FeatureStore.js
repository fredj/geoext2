Ext.define('GeoExt.data.FeatureStore', {
    extend: 'Ext.data.Store',
    requires: [

    ],

    // openlayers.layer.vector or layer record
    layer: null,

    constructor: function(config) {
        config = Ext.apply({}, config);

        var layer = config.layer;
        delete config.layer;

        if (config.features) {
            config.data = config.features;
        }
        delete config.features;

        this.callParent([config]);
        if (layer) {
            this.bind(layer);
        }
    },

    bind: function(layer, options) {
        if (this.layer) {
            // already bound
            return;
        }
        this.layer = layer;
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

    onLoad: function() {

    },
    onClear: function() {

    },
    onAdd: function() {

    },
    onRemove: function() {

    },
    onUpdate: function() {

    },
    onReplace: function() {

    }

});
