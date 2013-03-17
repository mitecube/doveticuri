#!/usr/bin/env php
<?php

spl_autoload_register(function($class){
    $path = str_replace('\\', '/', $class);
    $file = dirname(__FILE__).'/../vendor/elastica/lib/' . $path . '.php';
    if (file_exists($file)) {
        require_once($file);
    }
});


function provinceMap($prov) {
    $provMap = array(
        'AG' => 'Agrigento',
        'AL' => 'Alessandria',
        'AN' => 'Ancona',
        'AO' => 'Aosta',
        'AP' => 'Ascoli Piceno',
        'AQ' => 'L\'Aquila',
        'AR' => 'Arezzo',
        'AT' => 'Asti',
        'AV' => 'Avellino',
        'BA' => 'Bari',
        'BG' => 'Bergamo',
        'BI' => 'Biella',
        'BL' => 'Belluno',
        'BN' => 'Benevento',
        'BO' => 'Bologna',
        'BR' => 'Brindisi',
        'BS' => 'Brescia',
        'BT' => 'Barletta-Andria-Trani',
        'BZ' => 'Bolzano',
        'CA' => 'Cagliari',
        'CB' => 'Campobasso',
        'CE' => 'Caserta',
        'CH' => 'Chieti',
        'CI' => 'Carbonia-Iglesias',
        'CL' => 'Caltanissetta',
        'CN' => 'Cuneo',
        'CO' => 'Como',
        'CR' => 'Cremona',
        'CS' => 'Cosenza',
        'CT' => 'Catania',
        'CZ' => 'Catanzaro',
        'EE' => 'Stato Estero',
        'EN' => 'Enna',
        'FC' => 'Forlì Cesena',
        'FE' => 'Ferrara',
        'FG' => 'Foggia',
        'FI' => 'Firenze',
        'FM' => 'Fermo',
        'FR' => 'Frosinone',
        'GE' => 'Genova',
        'GO' => 'Gorizia',
        'GR' => 'Grosseto',
        'IM' => 'Imperia',
        'IS' => 'Isernia',
        'KR' => 'Crotone',
        'LC' => 'Lecco',
        'LE' => 'Lecce',
        'LI' => 'Livorno',
        'LO' => 'Lodi',
        'LT' => 'Latina',
        'LU' => 'Lucca',
        'MB' => 'Monza e Brianza',
        'MC' => 'Macerata',
        'ME' => 'Messina',
        'MI' => 'Milano',
        'MN' => 'Mantova',
        'MO' => 'Modena',
        'MS' => 'Massa-Carrara',
        'MT' => 'Matera',
        'NA' => 'Napoli',
        'NO' => 'Novara',
        'NU' => 'Nuoro',
        'OG' => 'Ogliastra',
        'OR' => 'Oristano',
        'OT' => 'Olbia-Tempio',
        'PA' => 'Palermo',
        'PC' => 'Piacenza',
        'PD' => 'Padova',
        'PE' => 'Pescara',
        'PG' => 'Perugia',
        'PI' => 'Pisa',
        'PN' => 'Pordenone',
        'PO' => 'Prato',
        'PR' => 'Parma',
        'PT' => 'Pistoia',
        'PU' => 'Pesaro e Urbino',
        'PV' => 'Pavia',
        'PZ' => 'Potenza',
        'RA' => 'Ravenna',
        'RC' => 'Reggio Calabria',
        'RE' => 'Reggio Emilia',
        'RG' => 'Ragusa',
        'RI' => 'Rieti',
        'RM' => 'Roma',
        'RN' => 'Rimini',
        'RO' => 'Rovigo',
        'SA' => 'Salerno',
        'SI' => 'Siena',
        'SO' => 'Sondrio',
        'SP' => 'La Spezia',
        'SR' => 'Siracusa',
        'SS' => 'Sassari',
        'SV' => 'Savona',
        'TA' => 'Taranto',
        'TE' => 'Teramo',
        'TN' => 'Trento',
        'TO' => 'Torino',
        'TP' => 'Trapani',
        'TR' => 'Terni',
        'TS' => 'Trieste',
        'TV' => 'Treviso',
        'UD' => 'Udine',
        'VA' => 'Varese',
        'VB' => 'Verbano-Cusio-Ossola',
        'VC' => 'Vercelli',
        'VE' => 'Venezia',
        'VI' => 'Vicenza',
        'VR' => 'Verona',
        'VS' => 'Medio Campidano',
        'VT' => 'Viterbo',
        'VV' => 'Vibo Valentia'
    );

    if (isset($provMap[$prov]))
        return $provMap[$prov];
    else
        return '';
}


$elasticaClient = new \Elastica\Client();
//$elasticaClient = new \Elastica\Client(array(
//    'host' => '33.33.33.101',
//    'port' => 9200
//));


$elasticaIndex = $elasticaClient->getIndex('doveticuri');
$elasticaIndex->create(
    array(
        'number_of_shards' => 4,
        'number_of_replicas' => 1,
        'analysis' => array(
            'analyzer' => array(
                'indexAnalyzer' => array(
                    'type' => 'custom',
                    'tokenizer' => 'whitespace',
                    'filter' => array('lowercase', 'stop')
                ),
                'searchAnalyzer' => array(
                    'type' => 'custom',
                    'tokenizer' => 'whitespace',
                    'filter' => array('stop', 'lowercase', 'shingle')
                )
            ),
            'filter' => array(
                'mySnowball' => array(
                    'type' => 'snowball',
                    'language' => 'Italian'
                )
            )
        )
    ),
    true
);

$elasticaType = $elasticaIndex->getType('hospital');

// Define mapping
$mapping = new \Elastica\Type\Mapping();
$mapping->setType($elasticaType);
$mapping->setParam('index_analyzer', 'indexAnalyzer');
$mapping->setParam('search_analyzer', 'searchAnalyzer');

// Define boost field
//$mapping->setParam('_boost', array('name' => '_boost', 'null_value' => 1.0));

// Set mapping
$mapping->setProperties(array(
    'id'        => array('type' => 'integer', 'include_in_all' => TRUE),
    'name'      => array('type' => 'string', 'include_in_all' => TRUE),
    'location'  => array(
        'type' => 'object',
        'properties' => array(
            'address'   => array('type' => 'string', 'include_in_all' => TRUE),
            'city'      => array('type' => 'string', 'include_in_all' => TRUE),
            'region'    => array('type' => 'string', 'include_in_all' => TRUE),
            'province'  => array('type' => 'string', 'include_in_all' => TRUE),
            'province_ext'  => array('type' => 'string', 'include_in_all' => TRUE),
            'cap'       => array('type' => 'string', 'include_in_all' => TRUE)
        ),
    ),
    'property'      => array('type' => 'string', 'include_in_all' => FALSE),
    'size'          => array('type' => 'string', 'include_in_all' => FALSE),
    'hospitalized_tot'  => array('type' => 'long', 'include_in_all' => FALSE),
    'hospitalized'  => array(
        'type' => 'object',
        'properties' => array(
            '1'   => array('type' => 'long', 'include_in_all' => FALSE),
            '3'   => array('type' => 'long', 'include_in_all' => FALSE),
            '4'   => array('type' => 'long', 'include_in_all' => FALSE),
            '5'   => array('type' => 'long', 'include_in_all' => FALSE),
            '14'   => array('type' => 'long', 'include_in_all' => FALSE),
            '15'   => array('type' => 'long', 'include_in_all' => FALSE),
            '18'   => array('type' => 'long', 'include_in_all' => FALSE),
            '19'   => array('type' => 'long', 'include_in_all' => FALSE),
            '21'   => array('type' => 'long', 'include_in_all' => FALSE),
            '35'   => array('type' => 'long', 'include_in_all' => FALSE),
            '38'   => array('type' => 'long', 'include_in_all' => FALSE),
            '55'   => array('type' => 'long', 'include_in_all' => FALSE),
            '63'   => array('type' => 'long', 'include_in_all' => FALSE),
            '82'   => array('type' => 'long', 'include_in_all' => FALSE),
            '83'   => array('type' => 'long', 'include_in_all' => FALSE),
            '84'   => array('type' => 'long', 'include_in_all' => FALSE),
            '88'   => array('type' => 'long', 'include_in_all' => FALSE),

        ),
    ),
    'indicators'  => array(
        'type' => 'object',
        'properties' => array(
            '1'   => array('type' => 'float', 'include_in_all' => FALSE),
            '3'   => array('type' => 'float', 'include_in_all' => FALSE),
            '4'   => array('type' => 'float', 'include_in_all' => FALSE),
            '5'   => array('type' => 'float', 'include_in_all' => FALSE),
            '14'   => array('type' => 'float', 'include_in_all' => FALSE),
            '15'   => array('type' => 'float', 'include_in_all' => FALSE),
            '18'   => array('type' => 'float', 'include_in_all' => FALSE),
            '19'   => array('type' => 'float', 'include_in_all' => FALSE),
            '21'   => array('type' => 'float', 'include_in_all' => FALSE),
            '35'   => array('type' => 'float', 'include_in_all' => FALSE),
            '38'   => array('type' => 'float', 'include_in_all' => FALSE),
            '55'   => array('type' => 'float', 'include_in_all' => FALSE),
            '63'   => array('type' => 'float', 'include_in_all' => FALSE),
            '82'   => array('type' => 'float', 'include_in_all' => FALSE),
            '83'   => array('type' => 'float', 'include_in_all' => FALSE),
            '84'   => array('type' => 'float', 'include_in_all' => FALSE),
            '88'   => array('type' => 'float', 'include_in_all' => FALSE),

        ),
    ),
    'geo'           => array('type' => 'geo_point', 'include_in_all' => FALSE),
));

// Send mapping to type
$mapping->send();

if ($argc < 3) {
    echo "\nUsage:\t";
    echo "{$argv[0]} <input-file.csv> <input-file-extended.csv> <localization-file.kml>\n\n\n";
    die();
}

// Read CSV
if (($handle = fopen($argv[1], "r")) !== FALSE) {
    while (($row = fgetcsv($handle, 1000, ",")) !== FALSE) {
        if (empty($row[0])) continue;
        $id = $row[0];
        $data[$id] = $row;
    }
    fclose($handle);
}

// Read CSV Extended
if (($handle = fopen($argv[2], "r")) !== FALSE) {
    while (($row = fgetcsv($handle, 1000, ",")) !== FALSE) {
        if (empty($row[0])) continue;
        $id = $row[0];
        $extdata[$id] = $row;
    }
    fclose($handle);
}


// Read KML
$kml = new DOMDocument();
$kml->load($argv[3]);
$points = $kml->getElementsByTagName( "Placemark" );
// For every point, extract the coordinates
foreach( $points as $point ) {
    $schemadata = $point->getElementsByTagName( "SimpleData" );

    $id = (string) $schemadata->item(0)->nodeValue;
    list($lon,$lat) = explode(',', (string) $point->getElementsByTagName( "Point" )->item(0)->nodeValue);
    $data[$id][] = $lat;
    $data[$id][] = $lon;

}

// output csv on STDOUT
//$fp = STDOUT;
//foreach ($data as $row) {
//    fputcsv($fp, $row);
//}
//fclose($fp);

// Index in Elastic Search
$documents = array();
foreach ($data as $row) {
    $id = $row[0];
    if (!isset($row[30])) {
        echo "punto non localizzato codice ISTAT $id\n";
        continue;
    }

    if ($row[30] < 35.4 || $row[30] > 47.08 ||
        $row[31] < 6.60 || $row[31] > 18.6) {
        echo "punto fuori confini italiani codice ISTAT $id\n";
        continue;
    }

    $hospitalized = array(
        'type' => 'object',
        'properties' => array(
            '1'    => trim($extdata[$id][23]) != '#N/D' ? intval($extdata[$id][23]) : null,
            '3'    => trim($extdata[$id][24]) != '#N/D' ? intval($extdata[$id][24]) : null,
            '4'    => trim($extdata[$id][25]) != '#N/D' ? intval($extdata[$id][25]) : null,
            '5'    => trim($extdata[$id][26]) != '#N/D' ? intval($extdata[$id][26]) : null,
            '14'   => trim($extdata[$id][27]) != '#N/D' ? intval($extdata[$id][27]) : null,
            '15'   => trim($extdata[$id][28]) != '#N/D' ? intval($extdata[$id][28]) : null,
            '18'   => trim($extdata[$id][29]) != '#N/D' ? intval($extdata[$id][29]) : null,
            '19'   => trim($extdata[$id][30]) != '#N/D' ? intval($extdata[$id][30]) : null,
            '21'   => trim($extdata[$id][31]) != '#N/D' ? intval($extdata[$id][31]) : null,
            '35'   => trim($extdata[$id][32]) != '#N/D' ? intval($extdata[$id][32]) : null,
            '38'   => trim($extdata[$id][33]) != '#N/D' ? intval($extdata[$id][33]) : null,
            '55'   => trim($extdata[$id][34]) != '#N/D' ? intval($extdata[$id][34]) : null,
            '63'   => trim($extdata[$id][35]) != '#N/D' ? intval($extdata[$id][35]) : null,
            '82'   => trim($extdata[$id][36]) != '#N/D' ? intval($extdata[$id][36]) : null,
            '83'   => trim($extdata[$id][37]) != '#N/D' ? intval($extdata[$id][37]) : null,
            '84'   => trim($extdata[$id][38]) != '#N/D' ? intval($extdata[$id][38]) : null,
            '88'   => trim($extdata[$id][39]) != '#N/D' ? intval($extdata[$id][39]) : null
        ),
    );

    $documents[] = new \Elastica\Document($row[0], array(
        'id'        => $row[0],
        'name'      => $row[4],
        'location'    => array(
            'address'   => $row[8],
            'city'      => $row[5],
            'region'    => $row[6],
            'province'  => $row[7],
            'province_ext'  => provinceMap($row[7]),
            'cap'       => $row[9]
        ),
        'property'      => $row[10],
        'size'          => $row[11],
        'hospitalized_tot'  => $row[12],
        'hospitalized'  => $hospitalized,
        'indicators'  => array(
            'type' => 'object',
            'properties' => array(
                '1'    => trim($row[13]) != '-' ? floatval(str_replace(',', '.', $row[13])) : null,
                '3'    => trim($row[14]) != '-' ? floatval(str_replace(',', '.', $row[14])) : null,
                '4'    => trim($row[15]) != '-' ? floatval(str_replace(',', '.', $row[15])) : null,
                '5'    => trim($row[16]) != '-' ? floatval(str_replace(',', '.', $row[16])) : null,
                '14'   => trim($row[17]) != '-' ? floatval(str_replace(',', '.', $row[17])) : null,
                '15'   => trim($row[18]) != '-' ? floatval(str_replace(',', '.', $row[18])) : null,
                '18'   => trim($row[19]) != '-' ? floatval(str_replace(',', '.', $row[19])) : null,
                '19'   => trim($row[20]) != '-' ? floatval(str_replace(',', '.', $row[20])) : null,
                '21'   => trim($row[21]) != '-' ? floatval(str_replace(',', '.', $row[21])) : null,
                '35'   => trim($row[22]) != '-' ? floatval(str_replace(',', '.', $row[22])) : null,
                '38'   => trim($row[23]) != '-' ? floatval(str_replace(',', '.', $row[23])) : null,
                '55'   => trim($row[24]) != '-' ? floatval(str_replace(',', '.', $row[24])) : null,
                '63'   => trim($row[25]) != '-' ? floatval(str_replace(',', '.', $row[25])) : null,
                '82'   => trim($row[26]) != '-' ? floatval(str_replace(',', '.', $row[26])) : null,
                '83'   => trim($row[27]) != '-' ? floatval(str_replace(',', '.', $row[27])) : null,
                '84'   => trim($row[28]) != '-' ? floatval(str_replace(',', '.', $row[28])) : null,
                '88'   => trim($row[29]) != '-' ? floatval(str_replace(',', '.', $row[29])) : null,
            ),
        ),
        'geo'  => "{$row[30]},{$row[31]}"
    ));

}

$elasticaType->addDocuments($documents);
$elasticaType->getIndex()->refresh();