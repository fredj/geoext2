/**
 * Copyright (c) 2012-2012 The Open Source Geospatial Foundation
 *
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

Ext.define('GeoExt.data.reader.Feature', {
    extend: 'Ext.data.reader.Json',
    alias : 'reader.feature',

    /**
     * @private
     * Given an object representing a single model instance's data, iterates over the model's fields and
     * builds an object with the value for each field.
     * @param {Object} feature The Feature to convert
     * @return {Object} Data object suitable for use with a model constructor
     */
    extractValues: function(feature) {
        this.callParent([feature.attributes])
    }
});
