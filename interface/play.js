$(document).on("click", ".play-button", function(){
    var player;
    function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: 'M7lc1UVf-VE',
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }
      function onPlayerReady(event) {
        event.target.playVideo();
      }
      var done = false;
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 6000);
          done = true;
        }
      }
      function stopVideo() {
        player.stopVideo();
      }
      function seek(){
          player.seekTo(10, true);
      }
    console.log("played");
    e.preventDefault();
    var link = $(".link-input").val();
    link = link.replace("watch?v=", "embed/");
    console.log(link);
    var jumptime = 60;
    var record = '<div class="ml-auto mr-auto pt-2"><button class="btn btn-primary record-button">Record Audio</button></div>'
    $("#video").html(iframe);
    $(".record-button").html(record);
    // $(".hot-links").html(timestamps);
})


var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'M7lc1UVf-VE',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

$(document).on("click", ".record-button", function(e){
    e.preventDefault();
    var player = document.getElementById("player");
    player.seekTo(10,true)
})
// $(document).ready(function() {
//     swfobject.embedSWF("//www.youtube.com/e/Py_IndUbcxc?enablejsapi=1&playerapiid=ytplayer &version=3",
//     "ytapiplayer", // where the embedded player ends up
//     "425", // width    
//     "356", // height    
//     "8", // swf version    
//     null,
//     null, {
//         allowScriptAccess: "always"
//     }, {
//         id: "video"
//     });
//     console.log("ran");
// });