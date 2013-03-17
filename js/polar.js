function polar(data, panel_id, click_callback, mouseover_callback, mouseout_callback) {
    var width = 800;
    var height = 850;
    var innerRadius = 120;
    var outerRadius = 300 - 10;

    var colors = {
        hospitalized: 'rgba(180, 180, 180, 0.5000)',
        deaths: 'rgba(251, 20, 16, 1.0000)',
        national_deaths: 'rgba(248, 163, 164, 1.0000)',
        bg: 'rgba(0, 0, 0, 0.001)',
        hover: 'rgba(102, 204, 255, 0.3)'
    }

    var labels = {
        deaths: 'deceduti',
        survivors: 'rimessi',
        hospitalized: 'ricoverati'
    }

    var causes = ["deaths", "survivors"];

    /* Compute maximum. */
    //data.forEach(function(d) d.max = Math.max(350, d.dead, d.survivors, d.disease));
    max = 0;
    data.forEach(function (d) { max = d.hospitalized > max ? d.hospitalized : max });

    /* Scales for radius, angle, and fill. */
    var radius = pv.Scale.linear(0.01, max).range(innerRadius, outerRadius);
    var angle = 2.0 * Math.PI / (data.length);
    var smallAngle = angle * 0.7;

    var vis = new pv.Panel().canvas(panel_id)
        .def("i", -1)
        .width(width)
        .height(height);

    function mouseover(index) {
        mouseover_callback(data[index]);
        return vis.i(index)
    }

    function mouseout() {
        mouseout_callback();
        return vis.i(-1)
    }

    function click(index) {
        return click_callback(data[index]);
    }

    /* Add a panel per month, and sort causes by that month's deaths. */

    var wedge = vis.add(pv.Wedge)
        .data(data)
        .left(width / 2)
        .top(height / 2)
        .angle(angle)
        .startAngle(function(d) { return this.index * angle - Math.PI / 2; })
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .cursor("pointer")
        .fillStyle(function() { return vis.i() == this.index ? colors.hover : colors.bg; })
        .strokeStyle(null)
        .event("mouseover", function() { return mouseover(this.index);})
        .event("mouseout", function() { return mouseout(-1);})
        .event("click", function(d) { return click(this.index);})
    ;

    wedge.add(pv.Wedge)
        .data(data)
        .left(width / 2)
        .top(height / 2)
        .angle(angle)
        .startAngle(function(d) { return this.index * angle - Math.PI / 2; })
        .innerRadius(innerRadius)
        .outerRadius(function(d) { return radius(d.hospitalized != null ? d.hospitalized : 0.0); })
        .cursor("pointer")
        .fillStyle(function() { return vis.i() == this.index ? colors.hover : colors.hospitalized; })
        .strokeStyle(null)
        .event("mouseover", function() { return mouseover(this.index);})
        .event("mouseout", function() { return mouseout(-1);})
        .event("click", function(d) { return click(this.index);})
    ;

    /* Media nazionale Deceduti (%) */
    wedge.add(pv.Wedge)
        .outerRadius(function(d) { return radius(d.hospitalized != null ? (d.hospitalized * d.nationalIndicator.mean / 100) : 0.0);})
        .fillStyle(null)
        .fillStyle(colors.national_deaths)
        .lineWidth(0)
        .event("mouseover", function() { return mouseover(this.index);})
        .event("mouseout", function() { return mouseout(-1);})
        .event("click", function(d) { return click(this.index);})
    ;

    /* Deceduti (%) */
    wedge.add(pv.Wedge)
        .angle(smallAngle)
        .startAngle(function(d) { return this.proto.startAngle() + smallAngle/5;} )
        .outerRadius(function(d) { return radius(d.present ? (d.deaths * d.hospitalized)/100 : 0.0);})
        .fillStyle(colors.deaths)
        .lineWidth(0)
        .event("mouseover", function() { return mouseover(this.index);})
        .event("mouseout", function() { return mouseout(-1);})
        .event("click", function(d) { return click(this.index);})
    ;

    /* Radial grid lines. */
    wedge.add(pv.Wedge)
        .data(pv.range(data.length + 1))
        .innerRadius(innerRadius - 10)
        .outerRadius(outerRadius + 10)
        .fillStyle(null)
        .strokeStyle('rgba(110, 110, 110, 1)')
        .angle(0).lineWidth(2)
    ;

    /* Circular grid lines. */
//    wedge.add(pv.Dot)
//            .data(pv.range(10, 100))
//            .fillStyle(null)
//            .strokeStyle("#eee")
//            .lineWidth(1)
//            .size(function(i) radius(i))
//            .anchor("top").add(pv.Label)
//            .visible(function(i) i < 3)
//            .textBaseline("middle")
//            .text(function(i) i);

    /* Labels. */
    wedge.anchor("outer").add(pv.Label)
        .textStyle('white')
        .font('12px sans-serif')
        .textAlign("center")
        .text(function(d) { return d.disease;})
    ;


    /* Morti/Sopravvissuti legend. */
/*
    vis.add(pv.Bar)
        .data(pv.keys(dataTypes))
        .right(width / 2 + 3)
        .top(function() height / 2 - 28 + this.index * 18)
        .fillStyle(function(d) dataTypes[d].color)
        .width(36)
        .height(12)
    .anchor("right").add(pv.Label)
        .text(function(d) dataTypes[d].label)
        .textMargin(6)
        .textStyle('white')
        .font('12px sans-serif')
        .textAlign("left");
*/
    /* Add a label using the pre-computed maximum value. */
    //        wedge.add(pv.Wedge)
    //            .data(["max"])
    //            .fillStyle(null)
    //            .strokeStyle(null)
    //            .anchor("outer").add(pv.Label)
    //            .text(function(c, d) format(d.date))
    //            .textAlign("center")
    //            .textBaseline("bottom")
    //            .textAngle(function() this.anchorTarget().midAngle() + Math.PI / 2);

    vis.render();

}