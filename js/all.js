var quakeJSON = null;
var quakeArr = null;
var map = null;
var duration = "day";
var intensity = "all";
var allMarkers = [];
var warnings = [];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var clkIndex, infoWindow;

$( document ).ready(function() {
    console.log( "this is working!" );
});

function resizeElem(){
    $("#mapCont").height(parseInt($(window).height())-50+"px");
};

function toggleFullScreen() {
  if ((document.fullScreenElement && document.fullScreenElement !== null) ||    
   (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        $("#toggleFullScreen").html("EXIT FULL SCREEN");
        if (document.documentElement.requestFullScreen) {

          document.documentElement.requestFullScreen();  
        } else if (document.documentElement.mozRequestFullScreen) {  
          document.documentElement.mozRequestFullScreen();  
        } else if (document.documentElement.webkitRequestFullScreen) {  
          document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
        }  
      } else { 
          $("#toggleFullScreen").html("GO FULL SCREEN");
        if (document.cancelFullScreen) {  
          document.cancelFullScreen();  
        } else if (document.mozCancelFullScreen) {  
          document.mozCancelFullScreen();  
        } else if (document.webkitCancelFullScreen) {  
          document.webkitCancelFullScreen();  
        }  
      }  
};

function bindEvents(){
    $(window).resize(function(){
        resizeElem();
    });
    
    $("#intensity li").unbind('click').bind('click',function(){
        updateIntensity(this);
    });
    
    $( "#durationDD" ).unbind('mouseover').bind('mouseover',function(){
        $("#durationOptions").show();
        $("#durationOptions").animate({opacity:1},200,function(){
            
        });
    });
    
    $( "#durationDD" ).unbind('mouseleave').bind('mouseleave',function(){
        $("#durationOptions").animate({opacity:0},200,function(){
            $("#durationOptions").hide();
        });
    });
    
    $("#durationOptions li").unbind('click').bind('click',function(){
        $( "#durationDD label" ).html($(this).html());
        var newDuration = $(this).attr("value");
        if(newDuration!=duration){
            $("#intensity li").removeClass("selected");
            $("#intensity li:eq(0)").addClass("selected");
            $(".selectInt","#intensity li:eq(0)").addClass("selected");
            
            intensity = "all";
            duration = newDuration;
            getQuakeData();
        }
        $("#durationOptions").hide();
    });
    
    $("#toggleFullScreen").unbind('click').bind('click',function(){
        toggleFullScreen();
    });
    
    setTimeout(function(){
        getQuakeData();
    },300000)
};

function updateIntensity(that){
    $("#intensity li").removeClass("selected");
    $(that).addClass("selected");
    $(".selectInt",that).addClass("selected");
    if(intensity!=$(that).attr("value")){
        intensity = $(that).attr("value");
        plotQuakeData();
    };
};

function initMap() {
    
    var mapCenter = new google.maps.LatLng(26,0);

    var mapOptions = {
        center : mapCenter,
        zoom : (parseInt($(window).width())>1400)?3:2,
        scrollwheel : true,
        draggable : true,
        minZoom : 2,
        mapTypeControl : false,
        zoomControl : false,
        streetViewControl : false
    }
    
    map = new google.maps.Map(document.getElementById('mapCont'), mapOptions);
    
    map.setOptions({styles:
        [
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "lightness": "30"
            },
            {
                "gamma": "2.57"
            },
            {
                "weight": "1.58"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": "20"
            },
            {
                "weight": "1.00"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "lightness": "30"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "lightness": "15"
            },
            {
                "gamma": "1"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "lightness": "20"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            },
            {
                "lightness": "20"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "lightness": "-7"
            }
        ]
    },
    {
        "featureType": "landscape.natural.landcover",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": "-2"
            }
        ]
    },
    {
        "featureType": "landscape.natural.landcover",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "lightness": "-11"
            }
        ]
    },
    {
        "featureType": "landscape.natural.terrain",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "lightness": "4"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "lightness": "40"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "lightness": "-30"
            },
            {
                "saturation": "-37"
            },
            {
                "hue": "#a6ff00"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "hue": "#00ff17"
            },
            {
                "saturation": "11"
            },
            {
                "lightness": "-70"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "saturation": "32"
            },
            {
                "lightness": "2"
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#35464b"
            }
        ]
    }
]
    });
    
    google.maps.event.addListener(map, "click", function(){
        infoWindow.close();
    });
    
    google.maps.event.addListenerOnce(map, 'idle', function(){
        if (typeof google === 'object' && typeof google.maps === 'object'){
            infoWindow = new InfoBubble({
                shadowStyle: 0,
                padding: 0,
                backgroundColor: '#063036',
                borderRadius: 2,
                minWidth:'320',
                minHeight:'220',
                arrowSize: 10,
                borderWidth: 0,
                borderColor: '#2c2c2c',
                arrowPosition: 10,
                disableAutoPan: true
            });
            
            addMarkerJS();
        }
    });

};

function addMarkerJS(){
    $("<script type='text/javascript' src='js/markerwithlabel.js'></script>").insertAfter($("body"));
    getQuakeData();
};

function getQuakeData(){
    $(".overlay").show();
    
    var dataURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_"+duration+".geojson";
    var request = createCORSRequest("get", dataURL);
        if (request){
            request.onload = function(){
                
                var quakeData = request.responseText;
                quakeJSON = JSON.parse(quakeData);
                plotQuakeData();
                //do something with request.responseText
            };
            request.send();
    }
    /*
    $.getJSON(dataURL, function(quakeData){
        quakeJSON = quakeData;
        plotQuakeData();
    });
    */
};

function createCORSRequest(method, url){
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr){
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined"){
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
}



/*function showWarning(){
    $("#warning").animate({top:"5px"},200,function(){
        
    });
    
    if(intensity=="all" && duration=="month"){
        $("#warning label").html("DATA TOO LARGE! PLOTTING EARTHQUAKES WITH MAGNITUDE >2.5. BROWSER MAY SLOW DOWN.");
    }
    else if(intensity=="-2.5" && duration=="month"){
        $("#warning label").html("DATA TOO LARGE! PLOTTING EARTHQUAKES WITH MAGNITUDE BETWEEN 1.5 AND 2.5. BROWSER MAY SLOW DOWN");
    }
    else if(intensity=="all" && duration=="week"){
        $("#warning label").html("DATA TOO LARGE! BROWSER MAY SLOW DOWN");
    }
    else if(intensity=="-2.5" && duration=="week"){
        $("#warning label").html("DATA TOO LARGE! BROWSER MAY SLOW DOWN");
    }
    else
        return 0;
    $("#warning").animate({top:"30px"},500,function(){
        
    });
};*/

function getMarkerClass(mag){
    
    var classSuffix = (duration=='hour'|| duration=='day')?"Ripple":"Point";
    /*if(mag<2.5)
        return {
            class : "green"+classSuffix,
            mar : (classSuffix=='Ripple')?8:3
        };*/
    if(mag>=2.5 && mag<4.5)
        return {
            class : "green"+classSuffix,
            mar : (classSuffix=='Ripple')?15:5
        };
    if(mag>=4.5 && mag<6)
        return {
            class : "yellow"+classSuffix,
            mar : (classSuffix=='Ripple')?20:8
        };
    if(mag>=6 && mag<7.5)
        return {
            class : "red"+classSuffix,
            mar : (classSuffix=='Ripple')?25:10,
            BG : "#A6FFB5"
        };
    if(mag>=7.5)
        return {
            class : "purple"+classSuffix,
            mar : (classSuffix=='Ripple')?30:13
        };
    return {
        class : "green"+classSuffix,
        mar : (classSuffix=='Ripple')?15:5
    };
};

function doIPlot(mag){
 /*   if(intensity=="all" && duration!="month")
        return true;
    
    if(intensity=="all" && duration=="month"){
        if(mag>=2.5)
            return true;
    };
    
    if(intensity=="-2.5" && duration=="month"){
        if(mag>=1.5 && mag<2.5)
            return true;
    };
    
    if(intensity=="-2.5" && duration!="month"){
        if(mag<2.5)
            return true;
    };*/
    
    if(intensity=="all"){
        if(mag>=2.5)
            return true;
    };
    
    if(intensity=="2.5+"){
        if(mag>=2.5 && mag<4.5)
            return true;
    }
    
    if(intensity=="4.5+"){
        if(mag>=4.5 && mag<6)
            return true;
    }
    if(intensity=="6+"){
        if(mag>=6)
            return true;
    }
    
    return false;
};

function getCount(quakeArr){
    var count = 0;
    for(var i=0; i<quakeArr.length; i++){
        if(intensity == "-2.5"){
            if(parseFloat(quakeArr[i].properties.mag)<2.5)
                count++;
        }
        if(intensity == "2.5+"){
            if(parseFloat(quakeArr[i].properties.mag)>=2.5 && parseFloat(quakeArr[i].properties.mag)<4.5)
                count++;
        }
        if(intensity == "4.5+"){
            if(parseFloat(quakeArr[i].properties.mag)>=4.5 && parseFloat(quakeArr[i].properties.mag)<6)
                count++;
        }
        if(intensity == "6+"){
            if(parseFloat(quakeArr[i].properties.mag)>=6)
                count++;
        }
    }
    if(intensity == "all"){
        count = quakeArr.length;
    }
    
    return count;
};

function clearMap(){
    for (var i = 0; i < allMarkers.length; i++) {
        allMarkers[i].setMap(null);
    }
    allMarkers = [];
};

function setUpdated(epoch){
    $(".updated").html(getFormattedTime(epoch));
};

function getFormattedTime(epoch){
    var date = new Date(epoch);
    var formattedDate = months[date.getUTCMonth()]+ ' ' + date.getUTCDate() + ', ' + addLeadingZero(date.getUTCHours()+"") + addLeadingZero(date.getUTCMinutes()+"") + "hrs UTC";
    return formattedDate;
};

function addLeadingZero(arg){
    if(arg.length<2)
        return "0"+arg;
    return arg;
}

function initInfoObj(){
    infoObj ={
        mag : quakeArr[clkIndex].properties.mag,
        lat : getLat(parseFloat(quakeArr[clkIndex].geometry.coordinates[1])),
        long : getLong(parseFloat(quakeArr[clkIndex].geometry.coordinates[0])),
        depth : quakeArr[clkIndex].geometry.coordinates[2],
        time : getFormattedTime(quakeArr[clkIndex].properties.time),
        place : quakeArr[clkIndex].properties.place
    };
};

function plotQuakeData(){
    
    clearMap();
    //showWarning();
    setUpdated(quakeJSON.metadata.generated);
    
    quakeArr = quakeJSON.features;
    var quakeNo = quakeArr.length;
    $(".quakeNo").html(getCount(quakeArr));
    
    for(var i=0; i<quakeNo; i++){
        
        var latitude = quakeArr[i].geometry.coordinates[1];
        var longitude = quakeArr[i].geometry.coordinates[0];
        var mag = quakeArr[i].properties.mag;
        
        if(doIPlot(parseFloat(mag))){
            var marker = new MarkerWithLabel({
                position: {
                    lat:latitude,
                    lng:longitude
                },
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale : 0
                },
                map: map,
                labelAnchor: new google.maps.Point(getMarkerClass(parseFloat(mag)).mar, getMarkerClass(parseFloat(mag)).mar),
                labelClass: getMarkerClass(parseFloat(mag)).class,
                myBG: getMarkerClass(parseFloat(mag)).BG,
                arrIndex : i
            });
            allMarkers.push(marker);
            marker.addListener('click', function() {
                infoWindow.close();
                clkIndex = this.arrIndex;
                if(quakeArr[clkIndex].properties.mag>=2.5){
                    initInfoObj();
                    infoWindow.open(map, this);
                    infoWindow.setContent(getHTMLStr());
                }
                
            });
        }
             
    }
    
    $(".overlay").hide();
    $(".plotNo").html(allMarkers.length);
};

$(document).ready(function(){
    resizeElem();
    bindEvents();
});
