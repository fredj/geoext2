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
     * Returns an accessor expression for the passed Field. Gives support for properties such as the following:
     * 'someProperty'
     * 'some.property'
     * 'some["property"]'
     * This is used by buildExtractors to create optimized on extractor function which converts raw data into model instances.
     */
    createFieldAccessExpression: function(field, fieldVarName, dataName) {
        return dataName + ".attributes['" + field.name + "']";
    }
});
