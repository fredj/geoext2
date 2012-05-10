/**
 * Copyright (c) 2008-2012 The Open Source Geospatial Foundation
 *
 * Published under the BSD license.
 * See https://github.com/geoext/geoext2/blob/master/license.txt for the full text
 * of the license.
 */

/**
 * @class GeoExt.grid.column.Symbolizer
 */
Ext.define('GeoExt.grid.column.Symbolizer', {
    alternateClassName: 'GeoExt.grid.SymbolizerColumn',
    extend: 'Ext.grid.column.Column',
    alias: ['widget.gx_symbolizercolumn'],

    constructor: function(config) {
        this.callParent([config]);
    }
});
