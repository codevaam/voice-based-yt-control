$(document).on("click", ".play-button", function(e){
    console.log("played");
    e.preventDefault();
    var link = $(".link-input").val();
    link.replace("watch?v=", "embed");
    var iframe = '<iframe class="w-50" src='+ link +'></iframe>'
    $("#video").html(iframe);
})