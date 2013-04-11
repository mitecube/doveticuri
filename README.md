#doveticuri
=====================

*[see it in action](http://doveticuri.mitecube.com)*

Description
-----------

"#doveticuri" is a platform designed to display a map with the best and worst italian hospitals.
This project, which began in 2013 as a collaboration between Wired Italia ([www.wired.it](http://www.wired.it)) and Mitecube ([www.mitecube.com](http://www.mitecube.com)), is aimed to inspect the quality of italian hospitals, by measuring the percentage of deaths caused by 19 types of illnesses.


Data source: [Age.Na.S. - Agenzia Nazionale per i Servizi Sanitari - http://www.agenas.it](http://www.agenas.it)

\#doveticuri is a single html5 page that displays a map, queries a search engine to retrieve points (hospitals), and shows them as markers. The markers are clickable, and show a form with hospital info and the 19 percentages. 
To maximize performance, data are hosted on an Elasticsearch backend, which is queried from a client-side javascript. The client application logic is developed over a Backbone.js framework.


Features
-----------

* OpenLayers / GoogleMap
* Elasticsearch to store hospital's data
* Backbone.js to develop the client-side MVC (and query the Elasticsearch search engine)
* Bootstrap / Fuelux based template
