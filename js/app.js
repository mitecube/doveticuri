ich.grabTemplates();

var diseaseCoding = {
    '1': {
        short: 'Infarto1',
        title: 'Infarto del miocardio',
        description: 'è il valore riassuntivo di tutti i diversi tipi di intervento per infarto ed è una delle patologie più gravi, con un indice di rischio nazionale del 10,95%'
    },
    '3': {
        short: 'Infarto2',
        title: 'Infarto del miocardio senza PTCA',
        description: 'Infarto del miocardio senza PTCA: per PTCA s’intende Angioplastica, la riapertura meccanica della arteria coronaria occlusa. Se non è possibile eseguirla entro 90 minuti, si procede alla riapertura attraverso la somministrazione di farmaci trombolitici. Questo tipo di operazione è meno efficace: il suo indice di rischio nazionale è del 18,18%'
    },
    '4': {
        short: 'Infarto3',
        title: 'Infarto del miocardio con PTCA',
        description: 'se l’Angioplastica viene effettuata entro un’ora dalla comparsa dei sintomi, il cuore non presenterà danni permanenti. Oltre le 12-18 ore, invece, la mortalità aumenta notevolmente. L’indice di rischio in Italia è del 5,51%'
    },
    '5': {
        short: 'PTCA',
        title: 'PTCA eseguita oltre 48h dal ricovero',
        description: 'si tratti dei casi in cui l’Angioplastica viene eseguita dopo 48 ore dal ricovero. Viene anche chiamata Angioplastica differita.'
    },
    '14': {
        short: 'Bypass',
        title: 'Bypass',
        description: 'è l’intervento chirurgico più eseguito. Quando le arterie coronarie si restringono, oltre alla terapia farmacologica e l’angioplastica, si può intervenire prelevando un’arteria del paziente e inserendone un capo a monte del restringimento e l’altro capo a valle. Si crea così un passaggio alternativo che “bypass” l’occlusione'
    },
    '15': {
        short: 'Scompenso',
        title: 'Scompenso cardiaco',
        description: 'è un affaticamento del cuore, in cui non è più in grado di pompare sangue efficacemente. Per curarlo, viene eseguita una cardio-riabilitazione'
    },
    '18': {
        short: 'Ictus1',
        title: 'Ictus, mortalità a 30 giorni',
        description: 'è in assoluto l’indicatore con l’indice di rischio italiano più alto: 12,12%. Avviene quando un’arteria del cervello si occlude (ictus ischemico) oppure si rompe e comincia a perdere sangue (ictus emorragico)'
    },
    '19': {
        short: 'Ictus2',
        title: 'Ictus, riammissioni ospedaliere dopo 30 giorni',
        description: 'rappresenta il rischio in seguito a un nuovo ricovero nel mese successivo alla dimissione con diagnosi di ictus.'
    },
    '21': {
        short: 'BPCO',
        title: 'BPCO riacutizzata',
        description: 'si tratta della Bronco-pneumopatia Cronica Ostruttiva ed si verifica quando si ha una progressiva ostruzione dei bronchi. La principale causa è il fumo e il suo indici di rischio nazionale è piuttosto alto: 8,82%'
    },
    '35': {
        short: 'Valvuloplastica',
        title: 'Intervento di valvuloplastica',
        description: 'è una degenerazione della valvola che permette il passaggio di sangue dal cuore al resto del corpo. Quando avviene, è necessario sostituirla con una protesi biologica o meccanica. Colpisce principalmente gli anziani tra i 70 e i 90 anni'
    },
    '38': {
        short: 'Femore',
        title: 'Frattura del collo del femore',
        description: 'anche questa patologia è prevalente negli anziani a causa dell’impoverimento delle ossa. L’intervento di tipo chirurgico dovrebbe essere effettuato entro 24 ore dal ricovero. Lunghi tempi d’attesa fanno salire l’indice di rischio. L’immobilizzazione prolungata aumenta la probabilità di embolie polmonari, scompensi cardiaci e infezioni'
    },
    '55': {
        short: 'Aneurisma',
        title: 'Aneurisma addominale',
        description: 'l’aneurisma dell’aorta addominale è un cedimento delle pareti dell’arteria aorta, che forma una sacca e può causare un’emorragia. In questo caso si interviene sostituendo il tratto danneggiato con una protesi artificiale'
    },
    '63': {
        short: 'Tumore1',
        title: 'Tumore al polmone',
        description: 'è la prima causa di morte per tumore negli uomini e la seconda per le donne. Contrariamente all’immaginario collettivo, il rischio di mortalità è piuttosto basso. La media nazionale si attesta al 2,16%, un valore comunque alto considerando che la comunità internazionale considera accettabile un indice inferiore al 2%'
    },
    '82': {
        short: 'Tumore2',
        title: 'Tumore gastrico',
        description: 'Negli ultimi anni il numero di casi diagnosticati nei Paesi occidentali è in diminuzione, un fenomeno che sembra dovuto, almeno in parte, al miglioramento dell\'alimentazione. Nel nostro Paese tuttavia è il tumore con l’indice di rischio più alto: la media nazionale è del 6,05%'
    },
    '83': {
        short: 'Tumore3',
        title: 'Tumore al colon',
        description: 'Nei Paesi occidentali il cancro del colon assieme a quello al retto rappresentano il terzo tipo di tumore per incidenza e mortalità. Più frequente a partire dai 60 anni, raggiunge il picco massimo verso gli 80 anni. Negli ultimi anni si è assistito a un aumento del numero di tumori, ma anche a una diminuzione della mortalità'
    },
    '84': {
        short: 'Tumore4',
        title: 'Tumore al retto',
        description: 'nasce con un polipo nell’ultima parte del tratto intestinale e a seconda della dimensione può essere maligno. Si cura con un intervento parziale o con la totale asportazione del retto'
    },
    '88': {
        short: 'Infarto4',
        title: 'Infarto del Miocardio, mortalità dopo 12 mesi',
        description: 'nei 12 mesi successivi ad un infarto possono presentarsi episodi di reinfarto'
    }
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
                bootbox.alert("Si è verificato un errore nell'accedere ai dati");
                t.trigger( 'search:end' );
            }
        } );
    },

    setQueryString: function( str ) {
        var curr = this.toJSON();
        if ( str != '' ) {
            curr.query.filtered.query = {
                query_string: {
                    fields : ["name", "location.city", "location.province", "location.province_ext", "location.region"],
                    default_operator: "OR",
                    query: ''
                }
            };
            curr.query.filtered.query.query_string.query = str;
        } else {
            curr.query.filtered.query = { match_all: { } };
        }
        this.set( curr, { silent: true } );
    },

    getQueryString: function() {
        var curr = this.toJSON();
        if (typeof(curr.query.filtered.query.query_string) == 'undefined')
            return '';
        return curr.query.filtered.query.query_string.query;
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

    getFacets: function() {
        if (!this.hasResults) return null;

        return this.get('facets');
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
        'cleared #searchbox' : 'search',
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
    highlightCtrl: null,
    selectCtrl: null,
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

//        this.defaultLayer = new OpenLayers.Layer.OSM('Simple OSM Map', null, {
//            transitionEffect: 'resize',
//            eventListeners: {
//                tileloaded: function(evt) {
//                    var ctx = evt.tile.getCanvasContext();
//                    if (ctx) {
//                        var imgd = ctx.getImageData(0, 0, evt.tile.size.w, evt.tile.size.h);
//                        var pix = imgd.data;
//                        for (var i = 0, n = pix.length; i < n; i += 4) {
//                            pix[i] = pix[i + 1] = pix[i + 2] = (3 * pix[i] + 4 * pix[i + 1] + pix[i + 2]) / 8;
//                        }
//                        ctx.putImageData(imgd, 0, 0);
//                        evt.tile.imgDiv.removeAttribute("crossorigin");
//                        evt.tile.imgDiv.src = ctx.canvas.toDataURL();
//                    }
//                }
//            }
//        });

        /* GMAP Section */
        this.defaultLayer = new OpenLayers.Layer.Google(
            "Google Streets", // the default
            {numZoomLevels: 20, type: 'styled'}
        );
        /* END GMAP Section */

        this.vent = options.vent;
        this.model.bind('search:end', this.updateMarkers, this);

        this.render();
    },

    render: function( note ) {
        var zoom = this.initialZoom;

        var options = {
            controls: [
                new OpenLayers.Control.Attribution(),
                new OpenLayers.Control.TouchNavigation({
                    dragPanOptions: {
                        enableKinetic: true
                    }
                }),
                new OpenLayers.Control.Zoom(),
                new OpenLayers.Control.Navigation({
                    zoomWheelEnabled: true,
                    mouseWheelOptions: {cumulative: false, interval: 50, maxDelta: 6}
                })
            ],
            maxExtent : this.extent
        };
        this.map = new OpenLayers.Map("map", options);
        this.map.addLayer(this.defaultLayer);
        this.map.setCenter(this.center, zoom);


        /* GMAP Section */
        var stylez = [
            {
                "stylers": [
                    { "visibility": "simplified" },
                    { "color": "#add6ca" }
                ]
            },{
                "featureType": "water",
                "stylers": [
                    { "visibility": "simplified" },
                    { "color": "#efe8d5" }
                ]
            },{
                "featureType": "administrative.country",
                "elementType": "geometry.stroke",
                "stylers": [
                    { "visibility": "on" },
                    { "color": "#efe8d5" }
                ]
            },{
                "featureType": "administrative.province",
                "elementType": "geometry.stroke",
                "stylers": [
                    { "visibility": "on" },
                    { "color": "#efe8d5" },
                    { "weight": 5 }
                ]
            },{
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    { "visibility": "on" },
                    { "saturation": -81 },
                    { "lightness": -100 }
                ]
            },{
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [
                    { "visibility": "on" },
                    { "lightness": -20 },
                    { "saturation": -80 }
                ]
            },{
                "featureType": "landscape",
                "elementType": "labels.text.fill",
                "stylers": [
                    { "visibility": "on" },
                    { "saturation": -81 },
                    { "lightness": -50 }
                ]
            },{
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                    { "visibility": "on" },
                    { "saturation": -81 },
                    { "lightness": -50 }
                ]
            }
        ];
        var styledMapOptions = {
            name: "Styled Map"
        };
        var styledMapType = new google.maps.StyledMapType(stylez, styledMapOptions);
        this.defaultLayer.mapObject.mapTypes.set('styled', styledMapType);
        this.defaultLayer.mapObject.setMapTypeId('styled');

        var myKmlOptions = {
            preserveViewport: true,
            suppressInfoWindows: true
        }
//        var kmlLayer_ITA = new google.maps.KmlLayer("http://doveticuri.mitecube.com/kmz/invert_ITA.kmz", myKmlOptions);
//        kmlLayer_ITA.setMap(this.defaultLayer.mapObject);
        /* END GMAP Section */
    },

    updateMarkers: function() {

        if (this.markers != null) {
            this.map.removeControl(this.highlightCtrl);
            this.map.removeControl(this.selectCtrl);

            this.highlightCtrl.destroy();
            this.selectCtrl.destroy();

            this.map.removeLayer(this.markers);
            this.markers.destroy();
        }

        this.markers = new OpenLayers.Layer.Vector("Markers Layer", {
            styleMap: new OpenLayers.StyleMap({
                "default": new OpenLayers.Style({
                    //strokeColor: "#ff0000",
                    //fillColor: "#ff0000",
                    //strokeOpacity: 1,
                    //strokeWidth: 1,
                    //fillOpacity: 1,
                    externalGraphic: "images/hicon.png",
                    pointRadius: '${calculateRadius}'
                    //pointRadius: 20
                },{
                    context: {
                        calculateRadius: function(f){
                            //console.log('Map resolution: ' + f.layer.map.getResolution())
                            var x = f.layer.map.getResolution();
                            var size = -0.005 * x + 20.003;
                            //console.log('Point size: ' + size);
                            return Math.max(8, Math.min(20, size));
                        }
                    }
                }),
                "temporary": new OpenLayers.Style({
                    //strokeColor: "#0033ff",
                    //strokeOpacity: 1,
                    //strokeWidth: 2,
                    //fillColor: "#0033ff",
                    //fillOpacity: 1,
                    graphicTitle: '${title}',
                    cursor: "pointer"
                }),
                "select": new OpenLayers.Style({
                    externalGraphic: "/images/hselicon.png"
                    //strokeColor: "#ff0000",
                    //strokeOpacity: .7,
                    //strokeWidth: 2,
                    //fillColor: "#ffcc00",
                    //fillOpacity: 1,
                    //graphicZIndex: 2,
                    //pointRadius: 24,
                    //cursor: "pointer"
                })
            }),
            rendererOptions: {zIndexing: true}
        });

        resultsModel = this.model.resultsModel;
        hits = resultsModel.getResults();

        if (hits == null) return;

        var that = this;
        $.each(hits, function(i, hit) {
            var ll = hit._source.geo.split(',');
            var latLon = new OpenLayers
                .LonLat(ll[1], ll[0])
                .transform( that.fromProjection, that.toProjection);

            point = new OpenLayers.Geometry.Point(latLon.lon, latLon.lat);
            that.markers.addFeatures([
                new OpenLayers.Feature.Vector(
                    point, {hit: hit, title: hit._source.name})])
        });

        this.highlightCtrl = new OpenLayers.Control.SelectFeature(this.markers, {
            hover: true,
            highlightOnly: true,
            renderIntent: "temporary"
//            eventListeners: {
//                featurehighlighted: function(e) {
//                    that.vent.trigger('show:details', e.feature.attributes.hit);
//                }
//            }
        });

        this.selectCtrl = new OpenLayers.Control.SelectFeature(this.markers, {
            clickout: true,
            onSelect: function(e) {
                that.vent.trigger('show:details', e.attributes.hit);
            },
            onUnselect: function(e) {
                that.vent.trigger('hide:details');
            }
        });

        this.map.addLayer(this.markers);

        this.map.addControl(this.highlightCtrl);
        this.map.addControl(this.selectCtrl);

        this.highlightCtrl.activate();
        this.selectCtrl.activate();

        var bounds = this.markers.getDataExtent();
        this.map.zoomToExtent(bounds);

    }

});


var esDetailsView = Backbone.View.extend({
    nationalStats: null,
    searchStats: null,

    events : {
        'click li.indicator' : 'indicatorClick',
        'click a.close' : 'hide'
    },

    initialize: function(options) {
        _.bindAll(this, "show", "hide", "indicatorClick");
        this.vent = options.vent;
        this.nationalStats = options.nationalStats;
        this.searchStats = options.searchStats;
        this.vent.bind("show:details", this.show);
        this.vent.bind("hide:details", this.hide);
        this.model.bind('search:end', this.hide, this);
        this.render();
    },

    render: function( note ) {
        this.$el.empty();
    },

    show: function(hit) {
        this.$el.empty();

        data = {
            name: hit._source.name,
            address: hit._source.location.address,
            city: hit._source.location.city,
            province: hit._source.location.province,
            indicators: []
        }

        var t = this;
        $.each(hit._source.indicators.properties, function(index, indicator) {
            var indicatorData = {
                id: index,
                disease: diseaseCoding[index].title,
                description: diseaseCoding[index].description,
                present: false,
                hospitalized: hit._source.hospitalized.properties[index],
                nationalIndicator: t.nationalStats['indicator_' + index],
                nationalHospitalized: t.nationalStats['hospitalized_' + index],
                currentSearchIndicator: t.searchStats['indicator_' + index],
                currentSearchHospitalized: t.searchStats['hospitalized_' + index]
            }
            if (indicator != null) {
                indicatorData.present = true;
                indicatorData.deaths = indicator;
                indicatorData.survivors = (100-indicator);
            }
            data.indicators.push(indicatorData)
        })

        //console.log(JSON.stringify(data.indicators));

        this.$el.html(ich.detailsTemplate(data));

    },

    hide: function() {
        this.$el.empty();
    },

    indicatorClick: function(evt) {
        evt.preventDefault();
        indicator = $(evt.currentTarget).attr('href');
        this.vent.trigger('calculate:topten', indicator);
    }
});

var esTopTenView = Backbone.View.extend({

    events : {
        'click a.close' : 'hide'
    },

    initialize: function(options) {
        _.bindAll(this, "calculate", "hide");
        this.vent = options.vent;
        this.vent.bind("calculate:topten", this.calculate);
        this.vent.bind("hide:details", this.hide);
        this.model.bind('search:end', this.hide);
        this.render();
    },

    render: function( note ) {
        this.$el.empty();
    },

    calculate: function(indicator) {
        this.$el.empty();
        resultsModel = this.model.resultsModel;
        hits = resultsModel.getResults();

        // genero una lista di risultati per i quali l'indicatore richiesto non è nullo
        nonNullList = [];
        $.each(hits, function(i,v) {
            if (v._source.indicators.properties[indicator] != null) {
                nonNullList.push({
                    id: v._id,
                    name: v._source.name,
                    score: v._source.indicators.properties[indicator]
                });
            }
        });

        // ordino la lista in maniera crescente
        nonNullList.sort(function(a,b) {
            return a.score < b.score ? -1 : 1;
        } );

        this.$el.html(ich.rankingsTemplate({
            disease: diseaseCoding[indicator].title,
            topten: nonNullList.slice(0, 10),
            bottomten: nonNullList.slice(-10).reverse()
        }));
    },

    hide: function() {
        this.$el.empty();
    }
});

var esMapAppView = Backbone.View.extend({
    query: null,
    vent: null,
    nationalStats: {},
    searchStats: {},

    initialize: function() {
        this.query = this.options.query;
        this.vent = _.extend({}, Backbone.Events);
        _.bindAll( this, 'render', 'updateStats', 'hideLoader', 'showLoader' );
        this.query.bind('search:start', this.showLoader, this );
        this.query.bind('search:end', this.updateStats, this );
        this.query.bind('search:end', this.hideLoader, this );
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
            el: '#map',
            vent: this.vent
        } );

        new esDetailsView( {
            model: this.query,
            nationalStats: this.nationalStats,
            searchStats: this.searchStats,
            el: '#' + this.options.id_prefix + '-details',
            vent: this.vent
        } );

        new esTopTenView( {
            model: this.query,
            el: '#' + this.options.id_prefix + '-rankings',
            vent: this.vent
        } );


        this.$el.show();
    },

    updateStats: function() {

        this.searchStats = $.extend(this.nationalStats, this.model.getFacets());

        if (Object.keys(this.nationalStats).length == 0) {
            if (this.searchStats != null) {
                $.extend (this.nationalStats, this.searchStats);
            }
        }

        console.log('Totale risultati: ' + this.model.getTotalHits()
            + '. Risultati visualizzati: ' + this.model.getNumHits());
    },

    showLoader: function() {
        $('#loader').show();
    },

    hideLoader: function() {
        $('#loader').hide();
    }

});

var basicQuery = {
    "query": {
        "filtered": {
            "query": {
                "match_all": { }
            },
            "filter": {
                "match_all": { }
            }
        }
    },
    "from": 0,
    "size": 2000,
    "sort": [],
    "facets": {
        "region": {
            "terms": {
                "field": "region"
            }
        },
        "province": {
            "terms": {
                "field": "province_ext"
            }
        },
        "property": {
            "terms": {
                "field": "property"
            }
        },
        "size": {
            "terms": {
                "field": "size"
            }
        },
        "hospitalized_tot": {
            "statistical": {
                "field": "hospitalized_tot"
            }
        }
    }
};

$.each(diseaseCoding, function(indicator, name) {
    indicator_index = 'indicator_' + indicator;
    hospitalized_index = 'hospitalized_' + indicator;
    basicQuery.facets[indicator_index] = {
        "statistical": {
            field: "indicators.properties." + indicator
        }
    };
    basicQuery.facets[hospitalized_index] = {
        "statistical": {
            field: "hospitalized.properties." + indicator
        }
    };
});

var esSearchQuery = new esSearchQueryModel( basicQuery );
var esSearchResults = new esSearchResultsModel( );

esSearchQuery.resultsModel = esSearchResults;
esSearchQuery.ajax_url = elastic_search_url;
esSearchQuery.index = 'doveticuri';
esSearchQuery.index_type = 'hospital';

var esMapApp = new esMapAppView( {
    model: esSearchResults,
    query: esSearchQuery,
    el: '#app-es-map',
    id_prefix: 'es-map'
} );


$(function() {
    esSearchQuery.search();
})