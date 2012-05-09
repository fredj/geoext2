/*
 * Copyright (c) 2012-2012 The Open Source Geospatial Foundation
 *
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

/**
 * Used to read the attributes of a feature.
 */
Ext.define('GeoExt.data.reader.Feature', {
    extend: 'Ext.data.reader.Json',
    alias : 'reader.feature',

    /**
     * @private
     * This is used by buildExtractors to create optimized on extractor
     * function which converts raw data into model instances.
     *
     * @param {Object} field The field.
     * @param {String} fieldVarName the variable name.
     * @param {String} dataName the data variable name.
     * @return {String} An accessor expression for the passed Field.
     */
    createFieldAccessExpression: function(field, fieldVarName, dataName) {
        return dataName + ".attributes['" + field.name + "']";
    }
});
