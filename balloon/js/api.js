var refresh = function(){
    $('#filetable').bootstrapTable('refresh',{silent: true});
};

var listRefresh = function () {
    $.ajax({
        url: '/api/listFile',
        type: 'GET',
        success: function(data){
            console.log('Get Success');
            refresh();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    console.log("Status: " + textStatus + " listFile GET Error: " + errorThrown); 
                }
    }).done(function(){
        refresh();
    });
    
    console.log("List Refresh");
};

var caldata = function () {
    $("#showStatus").html('<span class="label label-danger">running...</span>');
    $.ajax({
        url: '/api/cal',
        type: 'GET',
        success: function(data){
            console.log('Get CAL Success');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    console.log("Status: " + textStatus + " CAL GET Error: " + errorThrown); 
                }
    }).done(function(){
        $("#showStatus").html('<span class="label label-success">Done!</span>');
    });
};

var uploadDelItem = function (delData){
    var filename = [];
    for(var i= 0; i< delData.length; i++){
        var name = delData[i].name;
        filename.push(name);
    }
    $.ajax({
        url: '/api/delFile',
        type: 'POST',
        data: { filename: filename},
        success: function(data){
            console.log(filename + ': Delete Success');
            listRefresh();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    console.log("Status: " + textStatus + " delFile POST Error: " + errorThrown); 
        }
    }).done(function(){
        listRefresh();
    });
}
var show_height_time = function (){
    $.ajax({
        url: '/data/height_time_data.js',
        type: 'GET',
        success: function(data){
            eval(data);    
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus + " height_time.js GET Error: " + errorThrown); 
        }
     }).done(function(){
        draw_height_time();
    });
}

var show_ascRate_time = function (){
    $.ajax({
        url: '/data/ascRate_time_data.js',
        type: 'GET',
        success: function(data){
            eval(data);  
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus + " ascRate_time.js GET Error: " + errorThrown); 
        }
     }).done(function(){
        draw_ascRate_time();
    });
}

var show_accRate_time = function (){
        draw_accRate_time();
}

var show_p_height = function (){
    $.ajax({
        url: '/data/p_height_data.js',
        type: 'GET',
        success: function(data){
            eval(data);  
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus + " p_height.js GET Error: " + errorThrown); 
        }
     }).done(function(){
        draw_p_height();
    });
}

var show_temp_height = function (){
    $.ajax({
        url: '/data/temp_height_data.js',
        type: 'GET',
        success: function(data){
            eval(data);  
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus + " temp_height.js GET Error: " + errorThrown); 
        }
     }).done(function(){
        draw_temp_height();
    });
}

var show_rh_height = function (){
    $.ajax({
        url: '/data/rh_height_data.js',
        type: 'GET',
        success: function(data){
            eval(data);  
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus + " rh_height.js GET Error: " + errorThrown); 
        }
     }).done(function(){
        draw_rh_height();
    });
}

var show_azimuth = function (){
    $.ajax({
        url: '/data/azimuth.js',
        type: 'GET',
        success: function(data){
            eval(data);  
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus + " azimuth GET Error: " + errorThrown); 
        }
     })
}

var connect = function(){
    var socket = io.connect(); //put in the head
    // Add a connect listener
    socket.on('connect',function() {
        $("#connected").html('<div class="alert alert-success"><strong>Success Connect!</strong></div>');
    });
    // Add a disconnect listener
    socket.on('disconnect',function() {
        $("#connected").html('<div class="alert alert-danger"><strong>Disconnect!</strong> Please excute the server again!</div>');
    });
}