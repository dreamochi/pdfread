(function(){
    //初始化资源  一般默认加载mp3
    var audioplay=document.getElementById('audioplay')
    window.onload=function(){
        audioplay.src=dataSrc+mp3Src
    }
})()