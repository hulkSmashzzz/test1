var imagePath="";

$("#image-upload").on("submit",function(e){
    e.preventDefault();
    $.ajax({
        url:"/do-image-upload",
        method:"POST",
        data:new FormData(this),
        contentType:false,
        cache:false,
        processData:false,
        success:function(response){
            alert(response);
            imagePath=response;
            $("#modal-image").modal("hide");
        }
    }); 
});