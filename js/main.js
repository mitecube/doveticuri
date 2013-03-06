var ElasticSearchEndPoint = 'http://33.33.33.101:9200/doveticuri/hospital';
var initialPositionLat = 41.965571455673036;
var initialPositionLon = 12.823447265624969;
var initialZoom = 6;
var mapnik = new OpenLayers.Layer.OSM(
    {zoomOffset: 6, resolutions: [19.1092570678711,9.55462853393555,4.77731426696777,2.38865713348389]}
);
var grayscale = new OpenLayers.Layer.OSM('Simple OSM Map', null, {
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

var map = null;
var markers = null;
var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
var extent         = new OpenLayers.Bounds(6.60,35.4,18.6,47.08).transform(fromProjection,toProjection);
var center         = new OpenLayers.LonLat(initialPositionLon,initialPositionLat).transform( fromProjection, toProjection);

function mapInit() {
    var zoom = initialZoom;

    var options = {
        restrictedExtent : extent
    };

    map = new OpenLayers.Map("map", options);
    map.addLayer(grayscale);
    map.setCenter(center, zoom);
}

function drawMarker(ll, name, description) {
    if (markers == null) {
        markers = new OpenLayers.Layer.Markers("Markers");
        map.addLayer(markers);
    }
    var marker = new OpenLayers.Marker(ll);
    markers.addMarker(marker);
    var bounds = markers.getDataExtent();
    map.zoomToExtent(bounds);
}

function search(text) {
    $.ajax({   url: ElasticSearchEndPoint + '/_search?pretty=true'
        , type: 'POST'
        , data : JSON.stringify({
            "query": {
                "bool": {
                    "must": [
                        {
                            "query_string": {
                                "default_field": "_all",
                                "query": text
                            }
                        }
                    ],
                    "must_not": [],
                    "should": []
                }
            },
            "from": 0,
            "size": 2000,
            "sort": [],
            "facets": {}
        })
        , dataType : 'json'
        , processData: false
        , success: function(json, statusText, xhr) {
            if (markers!=null) {
                markers.destroy();
                markers = null;
            }
            $.each(json.hits.hits, function(i,v) {
                var ll = v._source.geo.split(',');
                var newPoint = new OpenLayers.LonLat(ll[1], ll[0]).transform( fromProjection, toProjection);
                drawMarker(newPoint, v._source.name, '');
            });
        }
        , error: function(xhr, message, error) {
            console.error("Error while loading data from ElasticSearch", message);
            throw(error);
        }
    });
}

var esbbSimpleAppView = Backbone.View.extend({
    query: null,
    //TODO: define the containing elements you want on the page (define the layout)
    template: '\
		<div id="{{prefix}}-header">\
			<div id="{{prefix}}-search-url"></div>\
			<div id="{{prefix}}-search-bar"></div>\
			<div id="{{prefix}}-search-filters"></div>\
			<div id="{{prefix}}-date-range"></div>\
		</div>\
		<div id="{{prefix}}-left-col">\
			<h3>Authors</h3><div id="{{prefix}}-author-pie" class="esbb-pie"></div>\
			<div id="{{prefix}}-tag-selector"></div>\
		</div>\
		<div id="{{prefix}}-center-col">\
			<div id="{{prefix}}-timeline" class="esbb-timeline"></div>\
			<div id="{{prefix}}-search-results"></div>\
		</div>\
		<div id="{{prefix}}-right-col">\
		</div>\
	',

    //TODO: customize how the results will be rendered.
    //  this is a mustache.js template (http://mustache.github.com/)
    templateResults: '\
		<h3>{{header}} [{{number}}/{{total}}]</h3>\
		{{#hits}}\
		<p class="esbb-result"> \
			<span class="esbb-result-title">{{fields.title}}</span>\
			{{highlight.content}}<br>\
			<span class="esbb-result-name">{{fields.author}}</span>\
			- <span class="esbb-result-date">{{fields.date}}</span>\
		</p>\
		{{/hits}}\
		',


    initialize: function() {
        this.query = this.options.query;
        _.bindAll( this, 'render' );
        this.render();
    },

    render: function() {
        this.$el.empty();
        this.$el.html( Mustache.render( this.template, { prefix: this.options.id_prefix } ) );

        //TODO: instantiate the desired header elements and connect to the proper element ids
        //  Also don't forget to change your facetName where appropriate
        new esbbSearchURLView( {
            model: this.query,
            baseURL: 'http://TODO_URL',
            el: '#' + this.options.id_prefix + '-search-url'
        } );
        new esbbSearchBarView( {
            model: this.query,
            el: '#' + this.options.id_prefix + '-search-bar',
            headerName: 'Simple Search'
        } );
        new esbbSearchFilterSelectView( {
            model: this.query,
            el: '#' + this.options.id_prefix + '-search-filters',
            //TODO: fields that will appear in autocomplete (full syntax is "author:gibrown", so this is really just a hit to the user
            avail_fields: [ 'title:', 'content:', 'author:', 'tag:' ]
        } );
//        new esbbSearchDateRangePickerView( {
//            model: this.query,
//            el: '#' + this.options.id_prefix + '-date-range',
//            headerName: 'Date Range',
//            facetName: 'date'
//        } );

        //TODO: instantiate the desired center column elements and connect to the proper element ids
        new esbbSearchFacetTimelineView( {
            facetName: 'date',
            el: '#' + this.options.id_prefix + '-timeline',
            model: this.model,
            searchQueryModel: this.query
        } );
        new esbbSearchResultsView( {
            model: this.model,
            template: this.templateResults,
            el: '#' + this.options.id_prefix + '-search-results' ,
            highlightField: 'content' //TODO: set to whatever your highlighted field name is
        } );

        //TODO: instantiate the desired left column elements and connect to the proper element ids
        new esbbSearchFacetPieView( {
            facetName: 'author',
            el: '#' + this.options.id_prefix + '-author-pie',
            model: this.model,
            searchQueryModel: this.query
        } );
        new esbbSearchFacetSelectView( {
            facetName: 'tag',
            headerName: 'Tags',
            el: '#' + this.options.id_prefix + '-tag-selector',
            searchQueryModel: this.query,
            model: this.model
        } );
    }

    //TODO: instantiate the desired right column elements and connect to the proper element ids

});

$(function() {
    // INITIALIZING SEARCH
    $('#searchbox').on('searched', function (e, text) {
        search(text);
    });

    $('#search-enable').click(function () {
        $('#searchbox').search('enable');
    });

    $('#search-disable').click(function () {
        $('#searchbox').search('disable');
    });

    //mapInit();

/*
    $.ajax({   url: ElasticSearchEndPoint + '/_search?pretty=true'
        , type: 'POST'
        , data : JSON.stringify({
            "query" : { "match_all" : {} },
            size: 2000
        })
        , dataType : 'json'
        , processData: false
        , success: function(json, statusText, xhr) {
            if (markers!=null) {
                markers.destroy();
                markers = null;
            }
            $.each(json.hits.hits, function(i,v) {
                var ll = v._source.geo.split(',');
                var newPoint = new OpenLayers.LonLat(ll[1], ll[0]).transform( fromProjection, toProjection);
                drawMarker(newPoint, v._source.name, '');
            });
        }
        , error: function(xhr, message, error) {
            console.error("Error while loading data from ElasticSearch", message);
            throw(error);
        }
    });
*/

    var esbbSimpleSearchResults = new esbbSearchResultsModel( );

//TODO: the QueryModel defines the query that will be passed to your server.
// At a minimum you should change the field names, and ensure that you define all of the facets
// that your display will depend on.
    var esbbSimpleSearchQuery = new esbbSearchQueryModel( {
        size : 10,
        query : {
            filtered : {
                query : {
                    query_string: {
                        fields: [ "content", "title", "tag" ],
                        query: "",
                        default_operator: "AND"
                    } },
                filter : {
                    match_all: { }
                }
            } },
        facets : {
            user : {
                terms : {
                    field : "author",
                    size : 10
                }
            },
            tag : {
                terms : {
                    field : "tag",
                    size : 10
                }
            },
            date : {
                date_histogram : {
                    field    : "date",
                    interval : "month"
                }
            }
        }
    } );
    esbbSimpleSearchQuery.resultsModel = esbbSimpleSearchResults;

//TODO: define the url for your ES endpoint, index name, and doc type name
    esbbSimpleSearchQuery.ajax_url = 'http://33.33.33.101:9200';
    esbbSimpleSearchQuery.index = 'doveticuri';
    esbbSimpleSearchQuery.index_type = 'hospital';

    var esbbSimpleApp = new esbbSimpleAppView( {
        model: esbbSimpleSearchResults,
        query: esbbSimpleSearchQuery,
        el: '#esbb-simple-app',
        id_prefix: 'esbb-simple'
    } );


});