ich.grabTemplates();

var diseaseCoding = {
    '1': 'Infarto1',
    '3': 'Infarto2',
    '4': 'Infarto3',
    '5': 'PTCA',
    '14': 'Bypass',
    '15': 'Scompenso',
    '18': 'Ictus1',
    '19': 'Ictus2',
    '21': 'BPCO',
    '35': 'Valvuloplastica',
    '38': 'Femore',
    '55': 'Aneurisma',
    '63': 'Tumore1',
    '82': 'Tumore2',
    '83': 'Tumore3',
    '84': 'Tumore4',
    '88': 'Infarto4'
};

var esSearchQueryModel = Backbone.Model.extend({
    index: '',
    index_type: '',
    resultsModel: null,

    initialize: function() {
    },

    search : function() {
        var t = this;
        this.trigger( 'search:start' );

        $.ajax( {
            url: t.ajax_url + '/' + t.index + '/' + t.index_type + '/_search?pretty=true',
            type: 'POST',
            dataType : 'json',
            data: JSON.stringify( this.toJSON() ),
            success: function(json, statusText, xhr) {
                var data = json;
                t.resultsModel.hasResults = true;
                t.resultsModel.hasError = false;
                t.resultsModel.set( data );
                t.trigger( 'search:end' );
            },
            error: function(xhr, message, error) {
                console.error("Error while loading data from ElasticSearch: ", message);
                console.error( error );
                console.error( xhr );
                t.resultsModel.hasResults = false;
                t.resultsModel.hasError = true;
                t.resultsModel.set( null );
                t.trigger( 'search:end' );
            }
        } );
    },

    setQueryString: function( str ) {
        var curr = this.toJSON();
        curr.query.bool.must[0].query_string.query = str;
        this.set( curr, { silent: true } );
    },

    getQueryString: function() {
        var curr = this.toJSON();
        return curr.query.bool.must[0].query_string.query;
    },

    setDateHistInterval: function( facet_name, interval ) {
        var curr = this.toJSON();
        curr.facets[facet_name].date_histogram.interval = interval;
        this.set( curr, { silent: true } );
    },

    updateFilters: function( new_filters ) {
        var curr = this.toJSON()
        var curr_filt = curr.query.filtered.filter;
        if ( new_filters.length == 0 ) {
            curr.query.filtered.filter = { match_all: {} };
        }
        else {
            curr.query.filtered.filter = { and: new_filters };
        }
        this.set( curr );
    },

    getFiltersForChanging: function() {
        var curr = this.toJSON();
        var curr_filt = curr.query.filtered.filter;
        if ( curr_filt.match_all != undefined ) {
            curr_filt = { and: [] };
        }
        return curr_filt.and;
    },

    getFilters: function() {
        var curr = this.toJSON();
        var curr_filt = curr.query.filtered.filter;
        if ( typeof curr_filt.and == 'undefined' )
            return [];
        else
            return curr_filt.and;
    },

    getFilter: function( facet_type, facet_name ) {
        var curr = this.toJSON();
        var curr_filt = curr.query.filtered.filter;
        if ( typeof curr_filt.and == 'undefined' )
            return false;
        for ( var i in curr_filt.and ) {
            if ( ( typeof curr_filt.and[i][facet_type] != 'undefined' ) &&
                ( typeof curr_filt.and[i][facet_type][facet_name] != 'undefined' ) )
                return curr_filt.and[i][facet_type][facet_name];
        }
        return false;
    },

    setAllTermFilters: function( list ) {
        //remove all existing terms
        var curr_filt = [];

        //add the list of terms
        _.each( list, function( val ) {
            var a = {};
            a[ val.field ] = val.term;
            curr_filt.push( { term: a } );
        } );
        this.updateFilters( curr_filt );
    },

    addTermFilter: function( field, term ) {
        var curr_filt = this.getFiltersForChanging();
        var a = {};
        a[ field ] = term;
        curr_filt.push( { term: a } );
        this.updateFilters( curr_filt );
    },

    addRangeFilter: function( field, from, to ) {
        var curr_filt = this.getFiltersForChanging();
        var a = {};
        if ( from && to )
            a[ field ] = { from: from, to: to, include_upper: false };
        else if ( from )
            a[ field ] = { from: from, include_upper: false };
        else if ( to )
            a[ field ] = { to: to, include_upper: false };
        else
            return;
        curr_filt.push( { range: a } );
        this.updateFilters( curr_filt );
    },

    removeFilter: function( facet_name, facet_type ) {
        var curr_filt = this.getFiltersForChanging();
        for ( var i in curr_filt ) {
            if ( ( typeof curr_filt[i][facet_type] != 'undefined' ) &&
                ( typeof curr_filt[i][facet_type][facet_name] != 'undefined' ) ) {
                curr_filt.splice( i, 1 );
                i--;
            }
        }
        this.updateFilters( curr_filt );
    },

    getFacet: function( facet_name ) {
        var curr = this.toJSON();
        var curr_facets = curr.facets;
        if ( typeof curr_facets[facet_name] == 'undefined' )
            return false;

        return curr_facets[facet_name];
    },

    addFiltersFromQueryString: function( str ) {
        if ( str != '' ) {
            var filts = $.parseJSON( str )
            this.updateFilters( filts );
            this.trigger( 'change' );
        }
    },

    getURLQueryString: function() {
        var str = '';
        var q = encodeURIComponent( this.getQueryString() );
        var f = this.getFiltersAsQueryString();
        if ( q || f ) {
            str += 'q=' + q;
            if ( f != '' )
                str += '&' + f;
        }
        return str;
    },

    getFiltersAsQueryString: function() {
        var curr = this.toJSON();
        var curr_filt = curr.query.filtered.filter;
        if ( curr_filt.match_all != undefined ) {
            return '';
        }
        return $.param( { f: curr_filt.and } );
    }


});

var esSearchResultsModel = Backbone.Model.extend({
    hasResults: false,
    hasError: false,

    initialize: function() {
    },

    getResults: function() {
        if (!this.hasResults) return null;

        return this.get('hits').hits;
    },

    getTotalHits: function() {
        if (!this.hasResults) return null;
        return this.get('hits').total;
    },

    getNumHits: function() {
        if (!this.hasResults) return null;
        return this.get('hits').hits.length;
    }

});

var esSearchBarView = Backbone.View.extend({
    headerName: '',
    spinner: null,
    spin_it: false,

    events : {
        'searched #searchbox' : 'search',
        'keyup .searchquery' : 'setQuery'
    },

    initialize: function() {
        this.headerName = this.options.headerName;
        _.bindAll( this, 'render' );
        this.model.bind('search:start', this.startSpin, this );
        this.model.bind('search:end', this.stopSpin, this );
        this.render();
    },

    render: function( note ) {
        this.$el.find( '.searchquery' ).attr( 'value', this.model.getQueryString() ).focus();
        if ( this.spin_it )
            this.startSpin();
        else
            this.stopSpin();
    },

    search: function( ev ) {
        if ( ev ) {
            ev.preventDefault();
            this.setQuery( null );
        }
        this.model.search();
    },

    startSpin: function() {
        $('#searchbox').search('disable');
        this.spin_it = true;
    },

    stopSpin: function() {
        $('#searchbox').search('enable');
        this.spin_it = false;
    },

    setQuery: function ( ev ) {
        var query = this.$el.find( '.searchquery' ).val();
        this.model.setQueryString( query );
//        if ( ( ev != undefined ) && ( ev.keyCode == 13 ) ) //enter key
//            this.search( null );
        this.model.trigger( 'change' );
    }

});


var esMapView = Backbone.View.extend({
    initialPositionLat: 41.965571455673036,
    initialPositionLon: 12.823447265624969,
    initialZoom: 6,
    map: null,
    markers: null,
    mapnik: null,
    fromProjection: null,
    toProjection: null,
    extent: null,
    center: null,
    defaultLayer: null,
    vent: null,


    initialize: function(options) {
        this.mapnik = new OpenLayers.Layer.OSM({
                zoomOffset: 6,
                resolutions: [19.1092570678711,9.55462853393555,4.77731426696777,2.38865713348389]}
        );
        this.fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
        this.toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
        this.extent         = new OpenLayers
                                    .Bounds( 6.60, 35.4, 18.6, 47.08 )
                                    .transform( this.fromProjection,this.toProjection );
        this.center         = new OpenLayers
                                .LonLat( this.initialPositionLon,this.initialPositionLat )
                                .transform( this.fromProjection, this.toProjection);

        this.defaultLayer = new OpenLayers.Layer.OSM('Simple OSM Map', null, {
            eventListeners: {
                tileloaded: function(evt) {
                    var ctx = evt.tile.getCanvasContext();
                    if (ctx) {
                        var imgd = ctx.getImageData(0, 0, evt.tile.size.w, evt.tile.size.h);
                        var pix = imgd.data;
                        for (var i = 0, n = pix.length; i < n; i += 4) {
                            pix[i] = pix[i + 1] = pix[i + 2] = (3 * pix[i] + 4 * pix[i + 1] + pix[i + 2]) / 8;
                        }
                        ctx.putImageData(imgd, 0, 0);
                        evt.tile.imgDiv.removeAttribute("crossorigin");
                        evt.tile.imgDiv.src = ctx.canvas.toDataURL();
                    }
                }
            }
        });

        this.vent = options.vent;
        this.model.bind('search:end', this.updateMarkers, this);

        this.render();
    },

    render: function( note ) {
        var zoom = this.initialZoom;

        var options = {
//            controls:           [],
            restrictedExtent : this.extent
        };

        this.map = new OpenLayers.Map("map", options);
        this.map.addLayer(this.defaultLayer);
        this.map.setCenter(this.center, zoom);
        var that = this;
        this.map.events.register("click", map , function(e){
            that.vent.trigger('hide:details');
        });

//        var t = this;
//        this.$el.empty();
//        var results = this.model.toJSON();
//        if ( ( results.hits != undefined ) && ( 0 != results.hits.total ) ) {
//            for ( hit in results.hits.hits ) {
//                if ( ( results.hits.hits[ hit ].highlight != undefined ) && ( typeof results.hits.hits[ hit ].highlight != 'string' ) ) {
//                    results.hits.hits[ hit ].highlight[ this.highlightField ] = results.hits.hits[ hit ].highlight[ this.highlightField ].join( '...' );
//                }
//            }
//            var data = this.default_data;
//            data.header = this.header;
//            data.hits = results.hits.hits;
//            data.number = this.number;
//            data.total = results.hits.total;
//
//            this.$el.append( Mustache.render( this.template, data ) );
//        } else {
//            this.$el.append( Mustache.render( this.templateNoResults, { header: this.header } ) );
//        }
    },

    updateMarkers: function() {
        if (this.markers != null) {
            this.markers.destroy();
        }

        this.markers = new OpenLayers.Layer.Markers("Markers");
        this.map.addLayer(this.markers);

        resultsModel = this.model.resultsModel;
        hits = resultsModel.getResults();
        var that = this;
        $.each(hits, function(i, hit) {
            var ll = hit._source.geo.split(',');
            var newPoint = new OpenLayers
                .LonLat(ll[1], ll[0])
                .transform( that.fromProjection, that.toProjection);
            var marker = new OpenLayers.Marker(newPoint);
            marker.events.register("mousedown", marker, function() {
                that.vent.trigger('show:details', hit);
            });
            that.markers.addMarker(marker);
        });


        var bounds = this.markers.getDataExtent();
        this.map.zoomToExtent(bounds);

    }

});


var esDetailsView = Backbone.View.extend({
    initialize: function(options) {
        _.bindAll(this, "show", "hide");
        options.vent.bind("show:details", this.show);
        options.vent.bind("hide:details", this.hide);
        this.render();
    },

    render: function( note ) {
        this.$el.empty();
    },

    show: function(hit) {
        this.model = hit;
        this.$el.empty();
        console.debug(hit);
        data = {
            name: hit._source.name,
            address: hit._source.location.address,
            city: hit._source.location.city,
            province: hit._source.location.province,
            indicators: []
        }

        $.each(hit._source.indicators.properties, function(index, indicator) {
            var indicatorData = {
                disease: diseaseCoding[index],
                present: false
            }
            if (indicator != null) {
                indicatorData.present = true;
                indicatorData.dead = indicator;
                indicatorData.survivors = (100-indicator);
            }
            data.indicators.push(indicatorData)
        })

        this.$el.html(ich.detailsTemplate(data));
    },

    hide: function() {
        this.$el.empty();
    }
});

var esMapAppView = Backbone.View.extend({
    query: null,
    vent: null,

    initialize: function() {
        this.query = this.options.query;
        this.vent = _.extend({}, Backbone.Events);
        _.bindAll( this, 'render' );
        this.query.bind('search:end', this.updateStats, this );
        this.render();
    },

    render: function() {
        this.$el.empty();
        this.$el.html( ich.appTemplate({ prefix: this.options.id_prefix }) );

        new esSearchBarView( {
            model: this.query,
            el: '#' + this.options.id_prefix + '-search-bar',
            vent: this.vent
        } );

        new esMapView( {
            model: this.query,
            el: '#' + this.options.id_prefix + '-map',
            vent: this.vent
        } );

        new esDetailsView( {
            el: '#' + this.options.id_prefix + '-details',
            vent: this.vent
        } );


        this.$el.show();
    },

    updateStats: function() {
        console.log('Totale risultati: ' + this.query.resultsModel.getTotalHits()
            + '. Risultati visualizzati: ' + this.query.resultsModel.getNumHits());
    }

});


var esSearchQuery = new esSearchQueryModel( {
    query: {
        bool: {
            must: [{
                query_string: {
                    fields : ["name", "location.city", "location.province", "location.province_ext", "location.region"],
                    default_operator: "AND",
                    query: ''
                }
            }],
            must_not: [],
            should: []
        }
    },
    from: 0,
    size: 2000,
    sort: [],
    facets: {}
} );

var esSearchResults = new esSearchResultsModel( );

esSearchQuery.resultsModel = esSearchResults;
esSearchQuery.ajax_url = 'http://33.33.33.101:9200';
esSearchQuery.index = 'doveticuri';

esSearchQuery.index_type = 'hospital';

var esMapApp = new esMapAppView( {
    model: esSearchResults,
    query: esSearchQuery,
    el: '#app-es-map',
    id_prefix: 'es-map'
} );