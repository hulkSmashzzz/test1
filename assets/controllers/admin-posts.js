function doPost(form){
    var formData={title: form.title.value, subTitle:form.subTitle.value,content:form.content.value,
    image:imagePath};
    $.ajax({
      url:"/do-posts",
      method:"POST",
      data:formData,
      success: function(response){
          alert(response.text);
          formData._id=response._id;
          var socket=io();
          socket.emit("new_post",formData);
      }
    });
    return false;
   }