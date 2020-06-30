var socket=io();
function doComment(form){
  var formData={username: form.username.value, comment:form.comment.value,
    post_id:form.post_id.value};
  $.ajax({
    url:"/posts/do-comment",
    method:"POST",
    data:formData, 
    success: function(response){
      formData._id=response._id;  
      socket.emit("new_comment",formData);
      //alert(response.text);
    }
  });
  return false;
  }

  socket.on("new_comment",function(comment){
               
    

    var html =  '<div class="single-comment justify-content-between d-flex">'
                  +'<div class="user justify-content-between d-flex">'
                    +'<div class="thumb">'
                        +'<img src="http://placehold.it/50x50" alt="">'
                    +'</div>'
                    +'<div class="desc">'
                        +'<h5>'
                            + comment.username 
                        +'</h5>'
                        +'<p class="date">December 4, 2017 at 3:12 pm </p>'
                        +'<p class="comment">'
                            +comment.comment
                        +'</p>'
                    +'</div>'
                +'</div>'
                +'<div class="reply-btn">'
                    +'<a href="" class="btn-reply text-uppercase">reply</a>'
                +'</div>'
            +'</div>';
          
$("#comments").prepend(html);                    

});

