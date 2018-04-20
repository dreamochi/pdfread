(function() {
    var url = dataSrc + pdfSrc;

    PDFJS.workerSrc = "js/pdfjs/pdf.worker.js";
    var windowWidth = document.querySelector(".musicShowModal").offsetWidth;
    var windowHeight = window.innerHeight;
    var scalePrimary = windowWidth / MusicData.pdfSize().width;
    // Asynchronous download of PDF
    // var loadingTask = PDFJS.getDocument(url);
    // loadingTask.promise.then(
    //     function(pdf) {
    //         console.log("PDF loaded");
    //         for (var i = 0; i < pdf.numPages; i++) {
    //             // Fetch the first page
    //             var pageNumber = i + 1;
    //             pdf.getPage(pageNumber).then(function(page) {
    //                 console.log("Page loaded");

    //                 var scale = scalePrimary * (pdf.numPages * 2);
    //                 var viewport = page.getViewport(scale);

    //                 // Prepare canvas using PDF page dimensions
    //                 var canvas = document.createElement("canvas");
    //                 canvas.className = "swiper-slide";
    //                 var context = canvas.getContext("2d");
    //                 canvas.height = viewport.height;
    //                 canvas.width = viewport.width;
    //                 document.getElementById("muscic-pdf").appendChild(canvas);
    //                 // Render PDF page into canvas context
    //                 var renderContext = {
    //                     canvasContext: context,
    //                     viewport: viewport
    //                 };
    //                 var renderTask = page.render(renderContext);
    //                 renderTask.then(function() {
    //                     console.log("Page rendered");
    //                     document.getElementById("globalScale").value =
    //                         MusicData.pdfSize().width / document.querySelector("#muscic-pdf canvas").offsetWidth + "," + MusicData.pdfSize().height / document.querySelector(".showmusic canvas").offsetHeight;

    //                     triggerChange(document.getElementById('globalScale'))

    //                     document.getElementById("pageLength").innerHTML = pdf.numPages;
    //                     var _canvasH = document.querySelector(".showmusic canvas").offsetHeight;
    //                     document.querySelector(".musicShowModal").style.height=_canvasH+'px';
    //                 });
    //             });
    //         }
    //     },
    //     function(reason) {
    //         console.error(reason);
    //     }
    // );
    PDFJS.getDocument(url).then(function(pdf){
        for (var i = 0; i < pdf.numPages; i++) {
            var pageNumber = i + 1;
            pdf.getPage(pageNumber).then(function(page) {
                var scale = scalePrimary * (pdf.numPages * 2);
                var viewport = page.getViewport(scale);
                // Prepare canvas using PDF page dimensions
                var canvas = document.createElement("canvas");
                canvas.className = "swiper-slide";
                var context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                document.getElementById("muscic-pdf").appendChild(canvas);
                // Render PDF page into canvas context
                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                var renderTask = page.render(renderContext);
                renderTask.then(function() {
                    console.log("Page rendered");
                    document.getElementById("globalScale").value =
                        MusicData.pdfSize().width / document.querySelector("#muscic-pdf canvas").offsetWidth + "," + MusicData.pdfSize().height / document.querySelector(".showmusic canvas").offsetHeight;

                    triggerChange(document.getElementById('globalScale'))

                    document.getElementById("pageLength").innerHTML = pdf.numPages;
                    var _canvasH = document.querySelector(".showmusic canvas").offsetHeight;
                    document.querySelector(".musicShowModal").style.height=_canvasH+'px';
                });
            });
        }
    }).catch(function(err){
        console.log(err)
    })
})();
