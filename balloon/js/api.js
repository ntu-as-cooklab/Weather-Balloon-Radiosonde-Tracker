var refresh = function(){
    $('#filetable').bootstrapTable('refresh',{silent: true});
};

var listRefresh = function () {
    $.ajax({
        url: '/api/listFile',
        type: 'GET',
        success: function(data){
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
    $("#showStatus").show();
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
        setTimeout(function(){$("#showStatus").hide();}, 2000);
    });
};

var modalSet = function(){
    var options = [];
    $("[name=option]").each(function(){
        options.push($(this).val());
    });
    $.ajax({
        url: '/api/setup',
        type: 'POST',
        data: { options: options},
        success: function(data){
            console.log('Options Setting Success');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log("Status: " + textStatus + " Options Setting GET Error: " + errorThrown);
        }
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
//---------- With Time ----------------
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
        $("#height_time").empty();
        linechart(height_time_data);
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
        $("#ascRate_time").empty();
        linechart(ascRate_time_data);
    });
}

var show_accRate_time = function (){
  $.ajax({
      url: '/data/accRate_time_data.js',
      type: 'GET',
      success: function(data){
          eval(data);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log("Status: " + textStatus + " accRate_time.js GET Error: " + errorThrown);
      }
   }).done(function(){
      $("#accRate_time").empty();
      linechart(accRate_time_data);
  });
}

var show_p_time = function (){
    $.ajax({
        url: '/data/p_time_data.js',
        type: 'GET',
        success: function(data){
            eval(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Status: " + textStatus + " p_time.js GET Error: " + errorThrown);
        }
     }).done(function(){
        $("#p_time").empty();
        linechart(p_time_data);
    });
}

var show_temp_time = function (){
    $.ajax({
        url: '/data/temp_time_data.js',
        type: 'GET',
        success: function(data){
            eval(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Status: " + textStatus + " temp_time.js GET Error: " + errorThrown);
        }
     }).done(function(){
        $("#temp_time").empty();
        linechart(temp_time_data);
    });
}

var show_rh_time = function (){
    $.ajax({
        url: '/data/rh_time_data.js',
        type: 'GET',
        success: function(data){
            eval(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Status: " + textStatus + " rh_time.js GET Error: " + errorThrown);
        }
     }).done(function(){
        $("#rh_time").empty();
        linechart(rh_time_data);
    });
}
var show_vT_time = function (){
    $.ajax({
        url: '/data/vT_time_data.js',
        type: 'GET',
        success: function(data){
            eval(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Status: " + textStatus + " vT_time.js GET Error: " + errorThrown);
        }
     }).done(function(){
        $("#vT_time").empty();
        linechart(vT_time_data);
    });
}
var show_ws_time = function (){
    $.ajax({
        url: '/data/ws_time_data.js',
        type: 'GET',
        success: function(data){
            eval(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Status: " + textStatus + " ws_time.js GET Error: " + errorThrown);
        }
     }).done(function(){
        $("#ws_time").empty();
        linechart(ws_time_data);
    });
}
var show_wd_time = function (){
    $.ajax({
        url: '/data/wd_time_data.js',
        type: 'GET',
        success: function(data){
            eval(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Status: " + textStatus + " wd_time.js GET Error: " + errorThrown);
        }
     }).done(function(){
        $("#wd_time").empty();
        linechart(wd_time_data);
    });
}

// --------  With Height
var show_accRate_height = function (){
    $.ajax({
        url: '/data/accRate_height_data.js',
        type: 'GET',
        success: function(data){
            eval(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Status: " + textStatus + " accRate_height.js GET Error: " + errorThrown);
        }
     }).done(function(){
        $("#accRate_height").empty();
        linechart(accRate_height_data);
    });
}

var show_ascRate_height = function (){
    $.ajax({
        url: '/data/ascRate_height_data.js',
        type: 'GET',
        success: function(data){
            eval(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Status: " + textStatus + " ascRate_height.js GET Error: " + errorThrown);
        }
     }).done(function(){
        $("#ascRate_height").empty();
        linechart(ascRate_height_data);
    });
}

var show_time_height = function (){
    $.ajax({
        url: '/data/time_height_data.js',
        type: 'GET',
        success: function(data){
            eval(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Status: " + textStatus + " time_height.js GET Error: " + errorThrown);
        }
     }).done(function(){
        $("#time_height").empty();
        linechart(time_height_data);
    });
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
        $("#p_height").empty();
        linechart(p_height_data);
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
        $("#temp_height").empty();
        linechart(temp_height_data);
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
        $("#rh_height").empty();
        linechart(rh_height_data);
    });
}
var show_vT_height = function (){
    $.ajax({
        url: '/data/vT_height_data.js',
        type: 'GET',
        success: function(data){
            eval(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Status: " + textStatus + " vT_height.js GET Error: " + errorThrown);
        }
     }).done(function(){
        $("#vT_height").empty();
        linechart(vT_height_data);
    });
}
var show_ws_height = function (){
    $.ajax({
        url: '/data/ws_height_data.js',
        type: 'GET',
        success: function(data){
            eval(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Status: " + textStatus + " ws_height.js GET Error: " + errorThrown);
        }
     }).done(function(){
        $("#ws_height").empty();
        linechart(ws_height_data);
    });
}
var show_wd_height = function (){
    $.ajax({
        url: '/data/wd_height_data.js',
        type: 'GET',
        success: function(data){
            eval(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Status: " + textStatus + " wd_height.js GET Error: " + errorThrown);
        }
     }).done(function(){
        $("#wd_height").empty();
        linechart(wd_height_data);
    });
}
//-----------------

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
        $("#connected").html('<div class="alert alert-danger"><strong>Disconnect!</strong>\nExcute the server again!</div>');
    });
}
