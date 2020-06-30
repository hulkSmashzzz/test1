var socket = io();
    socket.on("new_post",function(formData){
      
var html= '<div class=" row">'
            +'<div class="col-sm-12 col-md-6 col-lg-6 padding_event">'
                +'<div class="card shadow">'
                    +'<div class="inner">'
                       +'<img class="img-fluid" src="'+formData.image+'">'  
                   +'</div>'              
                   +'<div class="card-body text-center">'
                        +'<h2>'+formData.title+'</h2>'
                        +'<p class="card-text">'+formData.subTitle+'</p>'
                        +'<a href="posts/'+formData._id+'" class="btn btn-success">Read More</a>'
                    +'</div>'
                +'</div>'
            +'</div>'
        +'</div>'    
    $("#event-posts").prepend(html);                    

});
  