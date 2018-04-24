(function() {
    if ("addEventListener" in document) {
        document.addEventListener(
            "DOMContentLoaded",
            function() {
                FastClick.attach(document.body);
            },
            false
        );
    }
    // global arguments
    var _globalPdfSize = MusicData.pdfSize();
    var _globalSection = MusicData.measureItems();
    var _globalNote = MusicData.noteItems();
    var _globalTime = MusicData.noteTime();
    var _globaFunc = new AduioFun(MusicData);
    var playType = 0; //当前播放模式0块1线
    var globalScaleEle = "";
    var _globalSpeed = getSpeed();
    var audioplayEle = document.getElementById("audioplay");
    var containerEle = document.querySelector(".swiper-container");
    var cavansEle = null;
    var cavansList = null;
    /**
     * 屏幕尺寸变化
     */
    function sendSize() {
        cavansEle = document.querySelector(".swiper-container .cavans");
        globalScaleEle = MusicData.pdfSize().width / cavansEle.offsetWidth + "," + MusicData.pdfSize().height / cavansEle.offsetHeight;

        if (globalScaleEle !== "" && _globalScaleW === undefined && _globalScaleH === undefined) {
            var _Scale = globalScaleEle.split(",");
            _globalScaleW = parseFloat(_Scale[0]);
            _globalScaleH = parseFloat(_Scale[1]);
            loadPage();
        }
    }

    /**
     * 显示或隐藏线
     */
    function showSign() {
        if (document.getElementById("typeBlock").checked) {
            showblockEle.classList.remove("hide");
            $(".showline").stop();
        } else {
            showlineEle.classList.remove("hide");
        }
    }
    function hideSign() {
        if (document.getElementById("typeBlock").checked) {
            showblockEle.classList.add("hide");
        } else {
            showlineEle.classList.add("hide");
        }
    }

    /**
     * 根据尺寸加载图片及初始化swiper
     */
    function isMob() {
        var u = navigator.userAgent;
        return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || u.indexOf("Android") > -1 || u.indexOf("Linux") > -1 || u.indexOf("iPad") > -1;
    }
    function hengshupingevent() {
        location.reload();
    }
    function initSwiper() {
        function hengshuping() {
            //test
            var ss = false;
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
            pagePattern = "h";
            mySwiper = new Swiper(".swiper-container", {
                slidesPerView: 2,
                pagination: {
                    el: ".swiper-pagination"
                }
            });
            sendSize();
        }
        function renderPdfSig() {
            document.querySelector(".swiper-container .swiper-wrapper").innerHTML = gennerHtmlStr();
            pagePattern = "v";
            mySwiper = new Swiper(".swiper-container", {
                direction: "vertical",
                pagination: {
                    el: ".swiper-pagination"
                }
            });
            sendSize();
        }
        function gennerHtmlStr() {
            var htmlStr = "";
            for (var i = 0; i < imgCount; i++) {
                // if (i == 0) {
                //     htmlStr += '<div class="swiper-slide"><img onload="getInitSize(this)" class="cavans" src="' + imgSrc + '" /></div>';
                // } else {
                //     htmlStr += '<div class="swiper-slide"><img class="cavans" src="' + imgSrc + '" /></div>';
                // }
                htmlStr +=
                    '<div class="swiper-slide cavans" data-page="' +
                    (i + 1) +
                    '" style="background-image:url(base/img/' +
                    (i + 1) +
                    '.png)"></div>';
            }
            return htmlStr;
        }

        if (isMob()) {
            window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", hengshupingevent, false);
            document.querySelector(".container").classList.add("mob");
            hengshuping();
        } else {
            renderPdfDub();
        }
    }

    /**
     * 通用方法
     */
    // get current speed
    function getSpeed() {
        return Number(document.getElementById("swicthSpeed").value);
    }
    function getStyle(ele, attr) {
        return getComputedStyle(ele, false)[attr];
    }
    // // get current type
    // function getType() {
    //     return $("#playType").val();
    // }

    // // get top val
    // function getTopVal(val) {
    //     return parseInt(val.replace(/[^0-9\.]/gi, ""));
    // }

    /**
     * 初始化资源  一般默认加载mp3
     */
    var audioplay = document.getElementById("audioplay");
    window.onload = function() {
        audioplay.src = dataSrc + mp3Src;
    };

    function loadPage() {
        cavansList = document.querySelectorAll(".swiper-container .cavans");

        var _startNote = _globalSection[0][1];
        var _startMusic = _globalNote[0][1];
        var _left, _top, _width, _height;
        _left = _startNote.x / _globalScaleW;
        _top = _startNote.y / _globalScaleH;
        _width = (_startNote.eX - _startNote.x) / _globalScaleW;
        _height = (_startNote.eY - _startNote.y) / _globalScaleH;
        // BLOCK
        showblockEle.style.left = _left + "px";
        showblockEle.style.top = _top + "px";
        showblockEle.style.width = _width + "px";
        showblockEle.style.height = _height + "px";
        // LINE
        showlineEle.style.left = _startMusic.x / _globalScaleW + "px";
        showlineEle.style.top = _startMusic.y / _globalScaleH + "px";
        showlineEle.style.height = (_startMusic.eY - _startMusic.y) / _globalScaleH + "px";

        // INIT EVENT
        changePlayType();
        changePlaySpeed();
        parseAudio();
        listerAudioTimeChange();
        ClickPDF();
        moveLine();
    }

    // SWITCH PLAY TYPE showlin or showblock
    function changePlayType() {
        document.getElementById("typeBlock").onchange = function(eve) {
            if (!eve.currentTarget.checked || playType === 0) return;
            playType = 0;
            showlineEle.classList.add("hide");
            showblockEle.classList.remove("hide");
        };
        document.getElementById("typeNote").onchange = function(eve) {
            if (!eve.currentTarget.checked || playType === 1) return;
            playType = 1;
            showblockEle.classList.add("hide");
            showlineEle.classList.remove("hide");
        };
    }

    // SWITCH PLAY SPEED
    function changePlaySpeed() {
        document.getElementById("swicthSpeed").onchange = function(eve) {
            _globalSpeed = Number(eve.currentTarget.value);
            audioplayEle.playbackRate = _globalSpeed;
        };
    }

    //  // AUDIO PAUSE EVENT
    function parseAudio() {
        audioplayEle.onpause = function() {
            // hideSign()
            let _currentTime = _globaFunc.getAudioCurrentTime();
            let _tempNote;
            let _leftNote;
            let _rightNote;
            let _lefttime;
            let _righttime;
            let _leftNotePosition;
            let _rightNotePosition;
            let _left;
            let _top;
            let _height;
            let _primaryLeft = getStyle(document.querySelector(".showline"), "left");
            let _primaryTop = getStyle(document.querySelector(".showline"), "top");
            let _primaryHeight = getStyle(document.querySelector(".showline"), "height");

            //jq动画
            // $(".showline").hide();
            $(".showline").stop();
            clearInterval();
            $(".showline").css({
                left: _primaryLeft,
                top: _primaryTop,
                height: _primaryHeight
            });

            // if (playType === 1) {
            //     debugger
            //     showblockEle.classList.add("hide");
            //     showblockEle.classList.remove("hide");
            // }
        };
    }

    // LINE MOVE EVENT  cureentNote change
    function moveLine() {
        cureentNoteEle.addEventListener("change", function(eve) {
            var _val = eve.currentTarget.value;
            let _nextNoteTime = _globalTime[_val]; // TO LINE TIME
            var _nextNotePosition, _nextNotePage;
            let _preNote = _globalTime[_val - 1][1];
            let _preTime = _globalTime[_val - 1][0].toFixed(6);
            let _pageHeight = containerEle.offsetHeight;
            if (_nextNoteTime[1] === "end") {
                let _lastSection = _globalSection[_globalSection.length - 1];
                let _lastLeft = _lastSection[1].eX / _globalScaleW;
                //jq动画
                $(".showline").animate({ left: _lastLeft }, (_nextNoteTime[0] - _preTime).toFixed(6) * 1000 / parseFloat(getSpeed()));
            } else {
                for (const val of _globalNote) {
                    if (val[0][0] === _nextNoteTime[1]) {
                        _nextNotePosition = val[1];
                        _nextNotePage = val[0][1];

                        if (_nextNotePosition.x / _globalScaleW > parseFloat(getStyle(showlineEle, "left"))) {
                            //jq动画
                            $(".showline").animate(
                                { left: _nextNotePosition.x / _globalScaleW },
                                (_nextNoteTime[0] - _preTime).toFixed(6) * 1000 / parseFloat(getSpeed()),
                                function() {
                                    cureentNoteEle.value = parseInt(_val) + 1;
                                    triggerChange(cureentNoteEle);
                                }
                            );
                            return false;
                        } else {
                            // page position
                            let _destinationSection;
                            let _note = val;
                            let _left, _top, _height;

                            for (const nVal of _globalSection) {
                                if (nVal[0][0] === parseInt(_preNote)) {
                                    _destinationSection = nVal;
                                    return false;
                                }
                            }
                            //jq动画
                            $(".showline").animate(
                                { left: _destinationSection[1].eX / _globalScaleW },
                                (_nextNoteTime[0] - _preTime).toFixed(6) * 1000 / parseFloat(getSpeed()),
                                function() {
                                    _left = _note[1].x / _globalScaleW;
                                    _height = (_note[1].eY - _note[1].y) / _globalScaleH;
                                    _top = _note[1].y / _globalScaleH + _pageHeight * (_note[0][1] - 1);
                                    // $(".showline").hide();
                                    $(".showline").stop();
                                    clearInterval();
                                    $(".showline").css({
                                        left: _left,
                                        top: _top,
                                        height: _height
                                    });
                                    if (playType === 1) {
                                        showlineEle.classList.remove("hide");
                                    }
                                    cureentNoteEle.value = parseInt(_val) + 1;
                                    triggerChange(cureentNoteEle);
                                }
                            );
                            return false;
                        }
                    }
                }
            }
        });
    }

    // BLOCK MOVE EVENT
    function moveBlock() {
        let _currentTime = _globaFunc.getAudioCurrentTime();
        let _note;
        let _leftNote;
        let _rightNote;
        let _page;
        if (_currentTime > _globalTime[_globalTime.length - 1][0]) {
            _note = _globalSection[_globalSection.length - 1][0][0];
            _page = _globalSection[_globalSection.length - 1][0][1];
        } else if (_currentTime < _globalTime[0][0]) {
            _note = _globalSection[0][0][0];
            _page = 1;
        } else {
            for (var i = 0; i < _globalTime.length; i++) {
                if (_currentTime >= _globalTime[i][0].toFixed(6) && _currentTime < _globalTime[i + 1][0].toFixed(6)) {
                    _leftNote = _globalTime[i][1];
                    _rightNote = _globalTime[i + 1][1];
                    const _leftNoteVal = _globaFunc.getNotePosition(_leftNote);
                    const _rightNoteVal = _globaFunc.getNotePosition(_rightNote);
                    // IF ON ONELINE
                    if (parseInt(_leftNote) === parseInt(_rightNote)) {
                        const _currentLenght =
                            (_rightNoteVal[1].x - _leftNoteVal[1].x) /
                            (_globalTime[i + 1][0] - _globalTime[i][0]) *
                            (_currentTime - _globalTime[i][0]);
                        // Pre-Note
                        if (_currentLenght < _globalSection[parseInt(_leftNote) - 1].x) {
                            _note = _leftNote;
                        } else {
                            _note = _rightNote;
                        }
                    } else {
                        _note = _globalTime[i][1];
                    }
                    _page = _globaFunc.getNotePosition(_note)[0][1];
                }
            }
        }
        changePageNub(_page);
        // $("#currentPage").html(_page);
        _globaFunc.setBlockPosition(_note);
    }

    // AUDIO PLAY EVENT
    function listerAudioTimeChange() {
        audioplayEle.onseeked = function() {
            debugger
            moveBlock();
            let _isplay = false;
            var _currentTme = _globaFunc.getAudioCurrentTime();
            var _tempNote;
            let _leftNote;
            let _rightNote;
            let _proportion;
            let _left;
            let _height;
            let _top;
            let _pageHeight = containerEle.offsetHeight;
            if (!audioplayEle.paused) {
                audioplayEle.pause();
                _isplay = true;
            }
            //jq动画
            // $(".showline").hide();
            $(".showline").stop();
            for (var i = 0; i < _globalTime.length; i++) {
                if (_currentTme < _globalTime[0][0]) {
                    let _firstNote = _globalNote[0];
                    showlineEle.style.left = _firstNote[1].x / _globalScaleW;
                    showlineEle.style.height = (_firstNote[1].eY - _firstNote.y) / _globalScaleH;
                    showlineEle.style.top = _firstNote[1].y / _globalScaleH;
                    cureentNoteEle.value = 1;
                } else if (_currentTme > _globalTime[_globalTime.length - 1][0]) {
                    _leftNote = _globalNote[_globalNote.length - 1];
                    _rightNote = _globalSection[_globalSection.length - 1];
                    _proportion =
                        (_currentTme - _globalTime[_globalTime.length - 1][0]) /
                        (audioplayEle.duration - _globalTime[_globalTime.length - 1][0]);
                    if (_currentTme === audioplayEle.duration) {
                        _left = _rightNote[1].x;
                    } else {
                        _left = (_rightNote[1].x - _leftNote[1].x) * _proportion + _leftNote[1].x;
                    }

                    _top = _leftNote[1].y / _globalScaleH + parseInt(_pageHeight) * (_leftNote[0][1] - 1);
                    _height = (_leftNote[1].eY - _leftNote[1].y) / _globalScaleH;
                    showlineEle.left = _left / _globalScaleW;
                    showlineEle.top = _top;
                    showlineEle.height = _height;
                    cureentNoteEle.value = _globalTime.length;
                } else if (_currentTme > _globalTime[i][0] && _currentTme < _globalTime[i + 1][0]) {
                    _leftNote = _globalTime[i][1];
                    _rightNote = _globalTime[i + 1][1];
                    _proportion = (_currentTme - _globalTime[i][0]) / (_globalTime[i + 1][0] - _globalTime[i][0]);
                    _top =
                        _globaFunc.getNotePosition(_leftNote)[1].y / _globalScaleH +
                        parseInt(_pageHeight) * (_globaFunc.getNotePosition(_leftNote)[0][1] - 1);
                    _height = (_globaFunc.getNotePosition(_leftNote)[1].eY - _globaFunc.getNotePosition(_leftNote)[1].y) / _globalScaleH;
                    if (_globaFunc.getNotePosition(_rightNote)[1].x < _globaFunc.getNotePosition(_leftNote)[1].x) {
                        let _section = _globalSection[parseInt(_leftNote) - 1];
                        _left =
                            (_section[1].eX - _globaFunc.getNotePosition(_leftNote)[1].x) * _proportion +
                            _globaFunc.getNotePosition(_leftNote)[1].x;
                    } else {
                        _left =
                            (_globaFunc.getNotePosition(_rightNote)[1].x - _globaFunc.getNotePosition(_leftNote)[1].x) * _proportion +
                            _globaFunc.getNotePosition(_leftNote)[1].x;
                    }
                    showlineEle.left = _left / _globalScaleW;
                    showlineEle.top = _top;
                    showlineEle.height = _height;
                    cureentNoteEle.value = i + 1;
                }
            }
            if (playType === 1) {
                showlineEle.classList.remove("hide");
            }
            if (_isplay) {
                audioplayEle.play();
            }
        };
        audioplayEle.ontimeupdate = function() {
            moveBlock();
        };
        audioplayEle.onplay = function() {
            // showSign()
            let _crrentTime = _globaFunc.getAudioCurrentTime();
            let _nextNote, _nextNotePos, _nextNoteNum;
            let _noteVal = parseInt(cureentNoteEle.value);
            let _crrentNote = _globalTime[_noteVal];

            if (_noteVal === 0) {
                let timer = setTimeout(function() {
                    cureentNoteEle.value = 1;
                    triggerChange(cureentNoteEle);
                }, (_globalTime[0][0] - _crrentTime) * 1000 / _globalSpeed);
            } else {
                let _preNoteVal = _noteVal - 1;
                let _preNote = _globalTime[_preNoteVal];
                let _preNotePosition = _globaFunc.getNotePosition(_preNote[1]);
                if (_globaFunc.getNotePosition(_crrentNote[1])[1].x > _preNotePosition[1].x) {
                    //jq动画
                    $(".showline").animate(
                        {
                            left: _globaFunc.getNotePosition(_crrentNote[1])[1].x / _globalScaleW
                        },
                        (_crrentNote[0] - _crrentTime) * 1000 / _globalSpeed,
                        function() {
                            cureentNoteEle.value = _noteVal + 1;
                            triggerChange(cureentNoteEle);
                        }
                    );
                } else {
                    let _section = _globalSection[parseInt(_crrentNote[1]) - 2];
                    //jq动画
                    $(".showline").animate(
                        {
                            left: _section[1].eX / _globalScaleW
                        },
                        (_crrentNote[0] - _crrentTime) * 1000 / _globalSpeed,
                        function() {
                            // $(".showline").hide();
                            $(".showline").stop();
                            clearInterval();
                            let _notePosition = _globaFunc.getNotePosition(_crrentNote[1]);
                            showlineEle.style.left = _notePosition[1].x / _globalScaleW;
                            showlineEle.style.top = _notePosition[1].y / _globalScaleH;
                            showlineEle.style.height = (_notePosition[1].eY - _notePosition[1].y) / _globalScaleH;
                            // if (playType === 1) {
                            //     showlineEle.classList.remove("hide");
                            // }
                            cureentNoteEle.value = _noteVal + 1;
                            triggerChange(cureentNoteEle);
                        }
                    );
                }
            }
        };
    }

    // click pdf event
    // @
    function ClickPDF() {
        for (const item of cavansList) {
            item.addEventListener("click", clickCavans);
        }
        function clickCavans(eve) {
            // showSign()
            var clickPage = parseInt(eve.currentTarget.dataset.page);
            // globalPageNub
            // click positon
            let _mX = eve.pageX;
            let _mY = eve.pageY;
            // get pdf
            let _pdfL = eve.currentTarget.getBoundingClientRect().x;
            let _pdfT = eve.currentTarget.getBoundingClientRect().y;
            // left
            let _Clickleft = _mX - _pdfL;
            let _leftSo = _Clickleft * _globalScaleW;
            // top y -pdfT + hiddenHeight
            let _pdfClickH = _mY - _pdfT;
            let _ClickTop = _mY - _pdfT;
            let _topSo = _ClickTop * _globalScaleH;
            let _yArray = [];
            let _note, _leftNoteTime, _rightNoteTime;
            let _blockLeft, _Height, _Top, _blockWidth, _lineLeft;

            for (const val of _globalNote) {
                if (val[1].eY >= _topSo && val[1].y <= _topSo && val[0][1] === clickPage) {
                    _yArray.push(val);
                }
            }
            if (_yArray.length !== 0) {
                let _linePosition;
                let _nextNote;
                for (var i = 0; i < _yArray.length; i++) {
                    if (_leftSo < _yArray[0][1].x) {
                        // before the first note in this line
                        _note = _yArray[0][0][0];
                        _lineLeft = _yArray[0][1].x / _globalScaleW;
                        for (const val of _globalTime) {
                            if (val[1] === _note) {
                                audioplayEle.currentTime = val[0].toFixed(6);
                                // return false;
                                return false;
                            }
                        }
                        break;
                    } else if (_leftSo > _yArray[_yArray.length - 1][1].x) {
                        // after the last note in this line
                        _note = _yArray[_yArray.length - 1][0][0];
                        _lineLeft = _yArray[_yArray.length - 1][1].x / _globalScaleW;

                        var index = 0;
                        for (const val of _globalTime) {
                            if (playType === 1) {
                                // LINE
                                if (val[1] === _note) {
                                    let _nextTime = _globalTime[index + 1][0];
                                    let _clickLeftCha = _leftSo - _yArray[_yArray.length - 1][1].x;
                                    let _section = _globalSection[parseInt(_note) - 1];
                                    let _chaTime =
                                        _clickLeftCha / (_section[1].eX - _globaFunc.getNotePosition(_note)[1].x) * (_nextTime - val[0]);
                                    audioplayEle.currentTime = (_chaTime + val[0]).toFixed(6);
                                    return false;
                                    // return false;
                                }
                            } else {
                                if (parseInt(val[1]) === parseInt(_note)) {
                                    audioplayEle.currentTime = val[0].toFixed(6);
                                    // return false;
                                    return false;
                                }
                            }
                            index++;
                        }
                        break;
                    } else if (_leftSo > _yArray[i][1].x && _leftSo < _yArray[i + 1][1].x) {
                        // between note in this line
                        let speed;
                        _lineLeft = _Clickleft;
                        const _leftNote = _yArray[i][0][0];
                        const _rightNote = _yArray[i + 1][0][0];
                        // SET BLOCK POSITION
                        if (parseInt(_leftNote) !== parseInt(_rightNote)) {
                            _note = _leftNote;
                        } else {
                            // GET LEFT NOTE SECTION EX
                            const _leftSection = _globalSection[parseInt(_leftNote) - 1];
                            if (_leftSection[1].eX <= _leftSo) {
                                _note = _rightNote;
                            } else {
                                _note = _leftNote;
                            }
                        }
                        // SET TIME

                        for (const val of _globalTime) {
                            if (playType === 0) {
                                if (parseInt(_note) === parseInt(val[1])) {
                                    audioplayEle.currentTime = val[0].toFixed(6);
                                    return false;
                                }
                            } else {
                                if (val[1] === _yArray[i][0][0] && _leftNoteTime === undefined) {
                                    _leftNoteTime = val[0];
                                }
                                if (val[1] === _yArray[i + 1][0][0] && _rightNoteTime === undefined) {
                                    _rightNoteTime = val[0];
                                }
                                if (
                                    _leftNoteTime !== "" &&
                                    _rightNoteTime !== "" &&
                                    _leftNoteTime !== undefined &&
                                    _rightNoteTime !== undefined
                                ) {
                                    var _clickLeftCha = _leftSo - _yArray[i][1].x;
                                    var _chaTime =
                                        _clickLeftCha / (_yArray[i + 1][1].x - _yArray[i][1].x) * (_rightNoteTime - _leftNoteTime);
                                    audioplayEle.currentTime = (_chaTime + _leftNoteTime).toFixed(6);
                                    return false;
                                }
                            }
                        }
                        break;
                    }
                }
            } else {
                // INVALID CLICK
                return false;
            }
        }
    }

    //  // SET PAGE SELECT
    //  function selectPage() {
    //      $(document).on('click', '.ico-pre', function() {
    //          let _currentPage = parseInt($('#currentPage').text());
    //          let _pageLenght = parseInt($('#pageLength').text());
    //          let _canvasH = $('#muscic-pdf .canvas').height();
    //          if(_currentPage > 1) {
    //              $('#audioplay')[0].pause();
    //              $('#currentPage').text(_currentPage -1);
    //              $('#pageNub').val(_currentPage -1).trigger('change');
    //          }
    //      });
    //      $(document).on('click', '.ico-next', function() {
    //          let _currentPage = parseInt($('#currentPage').text());
    //          let _pageLenght = parseInt($('#pageLength').text());
    //          let _canvasH = $('#muscic-pdf .canvas').height();
    //          if(_currentPage < _pageLenght) {
    //              $('#audioplay')[0].pause();
    //              $('#currentPage').text(_currentPage + 1);
    //              $('#pageNub').val(_currentPage + 1).trigger('change');
    //          }
    //      });
    //  }

    initSwiper();
})();
