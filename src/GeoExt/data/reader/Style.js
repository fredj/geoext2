/**
 * Copyright (c) 2008-2012 The Open Source Geospatial Foundation
 *
 * Published under the BSD license.
 * See https://github.com/geoext/geoext2/blob/master/license.txt for the full text
 * of the license.
 */

/**
 * @class GeoExt.data.reader.Style
 */
Ext.define('GeoExt.data.reader.Style', {
    alternateClassName: 'GeoExt.data.StyleReader',
    extend: 'Ext.data.reader.Json',
    alias: 'reader.gx_style',

    /**
     * Creates new Reader.
     * @param {Object} config (optional) Config object.
     */
    constructor: function(config) {
        this.callParent([config]);
    }
});
