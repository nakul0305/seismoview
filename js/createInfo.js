var infoObj;

function getHTMLStr(){
    var htmlStr = "<div id='wrapper'><img class='bgImg' src='img/infoBG.gif'/><div class='row'><div class='leftCol'><label class='headText'>INTENSITY</label><br><label          class='bodyText'>"+infoObj.mag+"</label></div><div class='rightCol'><label class='headText'>DEPTH (KM)</label><br><label class='bodyText'>"+infoObj.depth+"</label></div></div><div class='row'><label class='headText'>TIME</label><br><label class='bodyText'>"+infoObj.time+"</label></div><div class='row' style='height:auto;border-bottom:none'><label class='headText'>LOCATION</label><br><div class='leftCol'><label class='bodyText'>"+infoObj.lat+"</label></div><div class='rightCol'><label class='bodyText'>"+infoObj.long+"</label></div><div style='clear:both'><label class='bodyText' style='font-size:12px;line-height:20px'>"+infoObj.place+"</label></div></div></div>";
    
    return htmlStr;
}

function getLat(val){
    if(val == 0){
        return val.toFixed(4)+"deg"
    }
    if(val < 0){
        return val.toFixed(4)*-1+" S"
    }
    if(val > 0){
        return val.toFixed(4)+" N"
    }
    return "N.A";
};
    
function getLong(val){
    if(val == 0){
        return val.toFixed(4)+"deg"
    }
    if(val < 0){
        return val.toFixed(4)*-1+" W"
    }
    if(val > 0){
        return val.toFixed(4)+" E"
    }
    return "N.A";
};
    

