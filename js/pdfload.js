(function() {
    var browser = {
        versions: (function() {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            return {
                //移动终端浏览器版本信息
                trident: u.indexOf("Trident") > -1, //IE内核
                presto: u.indexOf("Presto") > -1, //opera内核
                webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
                gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或者uc浏览器
                iPhone: u.indexOf("iPhone") > -1 || u.indexOf("Mac") > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf("iPad") > -1, //是否iPad
                webApp: u.indexOf("Safari") == -1 //是否web应该程序，没有头部与底部
            };
        })(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };
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

            if (browser.versions.mobile) {
                window.addEventListener(
                    "onorientationchange" in window ? "orientationchange" : "resize",
                    hengshupingevent,
                    false
                );
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
        if (typeof window.orientation === "undefined") {
            document.querySelector(".container").classList.add("mob");
            renderPdfSig();
        }
        if (window.orientation === 180 || window.orientation === 0) {
            document.querySelector(".container").classList.add("mob");
            renderPdfSig();
        }
        if (window.orientation === 90 || window.orientation === -90) {
            document.querySelector(".container").classList.remove("mob");
            alert("heng");
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
    }
    function renderPdfSig() {
        document.querySelector(".swiper-container .swiper-wrapper").innerHTML = gennerHtmlStr();
        mySwiper = new Swiper(".swiper-container", {
            direction: "vertical",
            pagination: {
                el: ".swiper-pagination"
            }
        });
    }
    function gennerHtmlStr() {
        var imgSrc =
            "http://pic.qiantucdn.com/58pic/28/49/22/19z58PICxPehs4eK9922d_PIC2018.jpg!/fw/780/watermark/url/L3dhdGVybWFyay12MS4zLnBuZw==/align/center/crop/0x1009a0a0";
        var htmlStr = "";
        for (var i = 0; i < 3; i++) {
            htmlStr += '<div class="swiper-slide"><img src="' + imgSrc + '"></div>';
        }
        return htmlStr;
    }
})();
