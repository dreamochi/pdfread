function loadPdf(){
    return new Promise(function(res,rej){
        function isMob() {
            var u = navigator.userAgent;
            return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || u.indexOf("Android") > -1 || u.indexOf("Linux") > -1 || u.indexOf("iPad") > -1;
        }
        var mySwiper = null;
        var url = dataSrc + pdfSrc;
        PDFJS.workerSrc = "js/pdfjs/pdf.worker.js";
        var windowWidth = document.querySelector(".musicShowModal").offsetWidth;
        var windowHeight = window.innerHeight;
        var scalePrimary = windowWidth / MusicData.pdfSize().width;
        var _pdf = null;
        PDFJS.getDocument(url)
            .then(function(pdf) {
                _pdf = pdf;
                // for (var i = 0; i < pdf.numPages; i++) {
                //     var pageNumber = i + 1;
                //     pdf.getPage(pageNumber).then(function(page) {
                // var scale = scalePrimary * (pdf.numPages * 2);
                // var viewport = page.getViewport(scale);
                // // Prepare canvas using PDF page dimensions
                // var canvas = document.createElement("canvas");
                // canvas.className = "swiper-slide";
                // var context = canvas.getContext("2d");
                // canvas.height = viewport.height;
                // canvas.width = viewport.width;
                // document.getElementById("muscic-pdf").appendChild(canvas);
                // // Render PDF page into canvas context
                // var renderContext = {
                //     canvasContext: context,
                //     viewport: viewport
                // };
                // var renderTask = page.render(renderContext);
                // renderTask.then(function() {
                //     console.log("Page rendered");
                //     document.getElementById("globalScale").value =
                //         MusicData.pdfSize().width / document.querySelector("#muscic-pdf canvas").offsetWidth +
                //         "," +
                //         MusicData.pdfSize().height / document.querySelector(".showmusic canvas").offsetHeight;
    
                //     triggerChange(document.getElementById("globalScale"));
    
                //     var _canvasH = document.querySelector(".showmusic canvas").offsetHeight;
                //     document.querySelector(".musicShowModal").style.height = _canvasH + "px";
                // });
                //     });
                // }
    
                if (isMob()) {
                    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", hengshupingevent, false);
                    document.querySelector(".container").classList.add("mob");
                    hengshuping();
                } else {
                    renderPdfDub();
                }
            })
            .catch(function(err) {
                console.log(err);
            });
        function hengshupingevent() {
            location.reload();
        }
    
        function hengshuping() {
            //test
            var ss = true;
            if (window.orientation === 180 || window.orientation === 0 || ss) {
                document.querySelector(".container").classList.remove("heng");
                document.querySelector(".container").classList.add("shu");
                renderPdfSig();
            }
            if (window.orientation === 90 || window.orientation === -90 || !ss) {
                document.querySelector(".container").classList.remove("shu");
                document.querySelector(".container").classList.add("heng");
                renderPdfDub();
            }
        }
    
        function renderPdfDub() {
            document.querySelector(".swiper-container .swiper-wrapper").innerHTML = gennerHtmlStr();
            mySwiper = new Swiper(".swiper-container", {
                slidesPerView: 2,
                pagination: {
                    el: ".swiper-pagination"
                }
            });
            res()
        }
        function renderPdfSig() {
            document.querySelector(".swiper-container .swiper-wrapper").innerHTML = gennerHtmlStr();
            mySwiper = new Swiper(".swiper-container", {
                direction: "vertical",
                pagination: {
                    el: ".swiper-pagination"
                }
            });
            res()
        }
        function gennerHtmlStr() {
            var imgSrc = "http://pic.qiantucdn.com/58pic/28/49/22/19z58PICxPehs4eK9922d_PIC2018.jpg!/fw/780/watermark/url/L3dhdGVybWFyay12MS4zLnBuZw==/align/center/crop/0x1009a0a0";
            var htmlStr = "";
            for (var i = 0; i < 3; i++) {
                // if (i == 0) {
                //     htmlStr += '<div class="swiper-slide"><img onload="getInitSize(this)" class="cavans" src="' + imgSrc + '" /></div>';
                // } else {
                //     htmlStr += '<div class="swiper-slide"><img class="cavans" src="' + imgSrc + '" /></div>';
                // }
                htmlStr += '<div class="swiper-slide cavans" style="background-image:url(' + imgSrc + ')"></div>';
            }
            return htmlStr;
        }
    })
}

// function getInitSize(ele) {
//     if (!ele) return;
//     var cavansEle = ele;
//     document.getElementById("globalScale").value = MusicData.pdfSize().width / cavansEle.offsetWidth + "," + MusicData.pdfSize().height / cavansEle.offsetHeight;
//     triggerChange(document.getElementById("globalScale"));
//     // var _canvasH = cavansEle.offsetHeight;
//     // document.querySelector(".musicShowModal").style.height = _canvasH + "px";
// }
