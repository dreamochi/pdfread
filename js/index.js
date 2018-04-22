(function(){
    //初始化资源  一般默认加载mp3
    var audioplay=document.getElementById('audioplay')
    window.onload=function(){
        audioplay.src=dataSrc+mp3Src
    }


     // global arguments
     var _globalPdfSize = MusicData.pdfSize();
     var _globalSection = MusicData.measureItems();
     var _globalNote = MusicData.noteItems();
     var _globalTime = MusicData.noteTime();
     var _globalSpeed = $('#Speed').val();
     var _globaFunc = new AduioFun(MusicData);
     
     // init page
     $('#globalScale').on('change', function() {
         if($(this).val() !== '' && _globalScaleW === undefined && _globalScaleH === undefined) {
             var _Scale = $(this).val().split(',');
             _globalScaleW = parseFloat(_Scale[0]);
             _globalScaleH = parseFloat(_Scale[1]);
             LOADPAGE();
         }
     });
     function LOADPAGE() {
         var _startNote = _globalSection[0][1];
         var _startMusic = _globalNote[0][1];
         var _left, _top, _width, _height;
         _left = _startNote.x / _globalScaleW;
         _top = _startNote.y / _globalScaleH;
         _width = (_startNote.eX - _startNote.x) / _globalScaleW;
         _height = (_startNote.eY - _startNote.y) / _globalScaleH;
         // BLOCK
         var _markBlock = $('.showblock');
         _markBlock.css({
             'left': _left + 'px',
             'top': _top + 'px',
             'width': _width + 'px',
             'height': _height + 'px'
         });
         // LINE
         var _markLine = $('.showline');
         _markLine.css({
             'left': (_startMusic.x / _globalScaleW) + 'px',
             'top': (_startMusic.y /_globalScaleH)  + 'px',
             'height': ((_startMusic.eY - _startMusic.y) / _globalScaleH) + 'px'
         });
         // INIT PLAY TYPE
         if(parseInt($('#playType').val()) > 0) {
             $('#typeBlock').prop('checked', true);
             $('.showline').addClass('hide');
         }else {
             $('#typeNote').prop('checked', true);
             $('.showblock').addClass('hide');
         }
         // INIT EVENT
         changePlayType();
         changePlaySpeed();
         parseAudio();
         listerAudioTimeChange();
         moveLine();
         changePageNub();
         ClickPDF();
         selectPage();
     }
     // click pdf event
     // @
     function ClickPDF() {
         $(document).on('click touchend', '.musicShowModal', function(e) {
             
             let _pageNub = $('#pageNub').val();
             // click positon 
             let _mX = e.pageX;
             let _mY = e.pageY;
             // get pdf
             let _pdfL = $('.musicShowModal').offset().left;
             let _pdfT = $('.musicShowModal').offset().top;
 
             // left
             let _Clickleft = _mX -  _pdfL;
             let _leftSo = _Clickleft * _globalScaleW; 
             // top y -pdfT + hiddenHeight
             let _pdfClickH = (_mY - _pdfT);
             let _ClickTop = (_mY - _pdfT);
             let _topSo = _ClickTop  * _globalScaleH;
             let _yArray = [];
             let _note, _leftNoteTime, _rightNoteTime;
             let _blockLeft, _Height, _Top, _blockWidth, _lineLeft;
             $.each(_globalNote, function(index, val) {
                 if(val[1].eY >= _topSo && val[1].y <= _topSo && val[0][1] === parseInt(getPageNub()) ){
                     _yArray.push(val);
                 }
             })
             if(_yArray.length !== 0) {
                 let _linePosition;
                 let _nextNote;
                 for(var i=0; i< _yArray.length; i++) {
                     if(_leftSo < _yArray[0][1].x) {
                         // before the first note in this line
                         _note = _yArray[0][0][0];
                         _lineLeft = _yArray[0][1].x / _globalScaleW;
                         $.each(_globalTime, function(index, val) {
                             if(val[1] === _note) {
                                 $('#audioplay')[0].currentTime = val[0].toFixed(6);
                                 return false;
                             }
                         })
                         break;
                     }else if(_leftSo > _yArray[_yArray.length -1][1].x) {
                         // after the last note in this line
                         _note = _yArray[_yArray.length -1][0][0];
                         _lineLeft = _yArray[_yArray.length -1][1].x / _globalScaleW;
                         $.each(_globalTime, function(index, val) {
                             // TODO line position when click.
                             if(parseInt($('#playType').val()) === 0) {
                                 // LINE
                                 if(val[1] === _note) {
                                     let _nextTime = _globalTime[index+1][0];
                                     let _clickLeftCha = _leftSo - _yArray[_yArray.length -1][1].x;
                                     let _section = _globalSection[parseInt(_note)-1];
                                     let _chaTime = (_clickLeftCha / (_section[1].eX - _globaFunc.getNotePosition(_note)[1].x)) * (_nextTime - val[0]);
                                     $('#audioplay')[0].currentTime = (_chaTime + val[0]).toFixed(6);
                                     return false;
                                 }
                             }else {
                                 if(parseInt(val[1]) === parseInt(_note)) {
                                     $('#audioplay')[0].currentTime = val[0].toFixed(6);
                                     return false;
                                 }
                             }
                             
                         })
                         break;
                     }else if(_leftSo > _yArray[i][1].x && _leftSo < _yArray[i+1][1].x ) {
                         // between note in this line
                         let speed;
                         _lineLeft = _Clickleft;
                         const _leftNote = _yArray[i][0][0];
                         const _rightNote = _yArray[i+1][0][0];
                         // SET BLOCK POSITION
                         if(parseInt(_leftNote) !== parseInt(_rightNote)) {
                             _note = _leftNote;
                         }else {
                             // GET LEFT NOTE SECTION EX
                             const _leftSection = _globalSection[parseInt(_leftNote) -1];
                             if(_leftSection[1].eX <= _leftSo) {
                                 _note = _rightNote;
                             }else {
                                 _note = _leftNote;
                             }
                         }
                         // SET TIME
                         $.each(_globalTime, function(index, val) {
                             if(parseInt($('#playType').val()) === 1) {
                                 if(parseInt(_note) === parseInt(val[1])) {
                                     $('#audioplay')[0].currentTime = val[0].toFixed(6);
                                     return false;
                                 }
                             }else {
                                 if(val[1] === _yArray[i][0][0] &&  _leftNoteTime === undefined) {
                                     _leftNoteTime = val[0];
                                 }
                                 if(val[1] === _yArray[i+1][0][0] &&  _rightNoteTime === undefined) {
                                     _rightNoteTime = val[0];
                                 }
                                 if(_leftNoteTime !=='' && _rightNoteTime !=='' && _leftNoteTime !== undefined && _rightNoteTime !== undefined) {
                                     
                                     var _clickLeftCha = _leftSo - _yArray[i][1].x;
                                     var _chaTime = (_clickLeftCha / (_yArray[i+1][1].x - _yArray[i][1].x)) * (_rightNoteTime - _leftNoteTime);
                                     $('#audioplay')[0].currentTime = (_chaTime + _leftNoteTime).toFixed(6);
                                     return false;
                                 }
                             }
                         })
                         break;
                     }
                 }
             }else {
                 // INVALID CLICK
                 return false;
             }
 
             
         })
     }
 
     // get current speed
     function getSpeed() {
         return $('#Speed').val();
     }
     // get current type
     function getType() {
         return $('#playType').val();
     }
 
     // get current page
     function getPageNub() {
         return $('#pageNub').val();
     }
 
     // get top val
     function getTopVal(val) {
         return parseInt(val.replace(/[^0-9\.]/ig,""));
     }
 
     // AUDIO PLAY EVENT
     function listerAudioTimeChange() {
         $('#audioplay').on('seeked', function() {
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
             let _pageHeight = $('.showmusic canvas').height();
             if(!$('#audioplay')[0].paused) {
                 $('#audioplay')[0].pause();
                 _isplay = true;
             }
             $('.showline').hide();
             $('.showline').stop();
             for(var i=0; i< _globalTime.length; i++) {
                 if(_currentTme < _globalTime[0][0]) {
                     let _firstNote = _globalNote[0];
                     $('.showline').css({
                         'left': _firstNote[1].x /_globalScaleW,
                         'height': (_firstNote[1].eY - _firstNote.y) /_globalScaleH,
                         'top': _firstNote[1].y / _globalScaleH
                     })
                     $('#cureentNote').val(1);
                 }else if(_currentTme > _globalTime[_globalTime.length -1][0]) {
                     _leftNote = _globalNote[_globalNote.length-1];
                     _rightNote = _globalSection[_globalSection.length-1];
                     _proportion = (_currentTme - _globalTime[_globalTime.length -1][0]) / ($('#audioplay')[0].duration - _globalTime[_globalTime.length -1][0]);
                     if(_currentTme === $('#audioplay')[0].duration) {
                         _left = _rightNote[1].x;
                     }else {
                         _left = (_rightNote[1].x - _leftNote[1].x) * _proportion + _leftNote[1].x;
                     }
                     
                     _top = _leftNote[1].y/ _globalScaleH + parseInt(_pageHeight) * (_leftNote[0][1] -1) ;
                     _height = (_leftNote[1].eY-_leftNote[1].y) / _globalScaleH;
                     $('.showline').css({
                         'left': _left / _globalScaleW,
                         'top': _top,
                         'height': _height
                     });
                     $('#cureentNote').val(_globalTime.length);
                 }else if(_currentTme > _globalTime[i][0] && _currentTme < _globalTime[i+1][0]) {
                     _leftNote = _globalTime[i][1];
                     _rightNote = _globalTime[i+1][1];
                     _proportion = (_currentTme - _globalTime[i][0]) / (_globalTime[i+1][0] - _globalTime[i][0]);
                     _top = (_globaFunc.getNotePosition(_leftNote)[1].y) / _globalScaleH  + parseInt(_pageHeight) * (_globaFunc.getNotePosition(_leftNote)[0][1] -1);
                     _height = (_globaFunc.getNotePosition(_leftNote)[1].eY - _globaFunc.getNotePosition(_leftNote)[1].y) / _globalScaleH;
                     if(_globaFunc.getNotePosition(_rightNote)[1].x < _globaFunc.getNotePosition(_leftNote)[1].x) {
                         let _section = _globalSection[parseInt(_leftNote)-1];
                         _left = (_section[1].eX - _globaFunc.getNotePosition(_leftNote)[1].x) * _proportion + _globaFunc.getNotePosition(_leftNote)[1].x;
                     }else {
                         _left = (_globaFunc.getNotePosition(_rightNote)[1].x - _globaFunc.getNotePosition(_leftNote)[1].x) * _proportion + _globaFunc.getNotePosition(_leftNote)[1].x;
 
                     }
                     $('.showline').css({
                         'left': _left / _globalScaleW,
                         'top': _top,
                         'height': _height
                     });
                     $('#cureentNote').val(i+1);
                 }
             }
             if(parseInt($('#playType').val()) === 0) {
                 $('.showline').show();
             }
             if(_isplay) {
                 $('#audioplay')[0].play();
             }
         })
         $('#audioplay').on('timeupdate', function(){
             moveBlock();
         })
         $('#audioplay').on('play', function() {
             let _crrentTime = _globaFunc.getAudioCurrentTime();
             let _nextNote, _nextNotePos, _nextNoteNum;
             let _noteVal = parseInt($('#cureentNote').val());
             let _crrentNote =_globalTime[_noteVal];
 
             if( _noteVal === 0 ) {
                let timer =  setTimeout("$('#cureentNote').val(1).trigger('change')", (_globalTime[0][0] - _crrentTime) *1000 / _globalSpeed);
             }else {
                 let _preNoteVal = _noteVal -1;
                 let _preNote = _globalTime[_preNoteVal];
                 let _preNotePosition = _globaFunc.getNotePosition(_preNote[1]);
                 if( _globaFunc.getNotePosition(_crrentNote[1])[1].x >  _preNotePosition[1].x) {
                     $('.showline').animate({
                         'left': _globaFunc.getNotePosition(_crrentNote[1])[1].x / _globalScaleW
                     }, (_crrentNote[0] - _crrentTime) * 1000 / _globalSpeed, function() {
                         $('#cureentNote').val(_noteVal +1).trigger('change');
                     });
                 }else {
                     // THE NEXT NOTE ON THE NEXT LINE
                     // GOTO SECTION END
 
                     let _section = _globalSection[parseInt(_crrentNote[1])-2];
                     $('.showline').animate({
                         'left': _section[1].eX / _globalScaleW
                     }, (_crrentNote[0] - _crrentTime) * 1000 / _globalSpeed, function() {
                         $('.showline').hide();
                         $('.showline').stop();
                         clearInterval();
                         let _notePosition = _globaFunc.getNotePosition(_crrentNote[1]);
                         $('.showline').css({
                             'left': _notePosition[1].x / _globalScaleW,
                             'top': _notePosition[1].y / _globalScaleH,
                             'height': (_notePosition[1].eY - _notePosition[1].y ) / _globalScaleH
                         });
                         if(parseInt($('#playType').val()) === 0) {
                             $('.showline').show();
                         }
                         $('#cureentNote').val(_noteVal +1).trigger('change');
                     })
                 }
             }
         })
     }
     // AUDIO PAUSE EVENT
     function parseAudio() {
         $('#audioplay').on('pause', function() {
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
             let _primaryLeft = $('.showline').css('left');
             let _primaryTop = $('.showline').css('top');
             let _primaryHeight = $('.showline').css('height');
             $(document).off('change', '#cureentNote');
             $('.showline').hide();
             $('.showline').stop(true, true);
             clearInterval();
             $('.showline').css({
                 'left': _primaryLeft,
                 'top': _primaryTop,
                 'height': _primaryHeight
             })
             // if(_currentTime > _globalTime[_globalTime.length -1]) {
             //     let _lastSection = _globalSection[_globalSection.length -1];
             //     let _lastLeft = _lastSection[1].eX / _globalScaleW;
             //     $('.showline').animate({'left': _lastLeft}, (_nextNoteTime[0] - _preTime)* 1000 / parseFloat(getSpeed()));
             // }else if(_currentTime <= _globalTime[0][1]) {
             //     _left = _globalNote[0][1].x /_globalScaleW;
             //     _top = _globalNote[0][1].y / _globalScaleH;
             //     _height = (_globalNote[0][1].eY - _globalNote[0][1].y) / _globalScaleH;
             //     $('.showline').css({
             //         'left': _left,
             //         'top': _top,
             //         'height': _height
             //     })
             // }else {
             //     for(var i=0; i< _globalTime.length; i++) {
             //         if(_currentTime > _globalTime[i][0] && _currentTime <= _globalTime[i+1][0]) {
             //             _leftNote = _globalTime[i][1];
             //             _lefttime = _globalTime[i][0];
             //             _rightNote = _globalTime[i+1][1];
             //             _righttime = _globalTime[i+1][0];
             //         }
             //     }
             //     if( _globaFunc.getNotePosition(_rightNote)[1].x >  _globaFunc.getNotePosition(_leftNote)[1].x)  {
             //         _leftNotePosition = _globaFunc.getNotePosition(_leftNote);
             //         _rightNotePosition = _globaFunc.getNotePosition(_rightNote);
             //         _left = (_currentTime - _lefttime)/(_righttime- _lefttime) * (_rightNotePosition[1].x - _leftNotePosition[1].x) + _leftNotePosition[1].x;
             //         _top = _leftNotePosition[1].y / _globalScaleH;
             //         _height = (_rightNotePosition[1].eY - _rightNotePosition[1].y) / _globalScaleH;
             //         $('.showline').css({
             //             'left': _left / _globalScaleW,
             //             'top': _top,
             //             'height': _height
             //         })
             //     }else {
             //         // ON DIFFERENT LINES
             //         _leftNotePosition  = _globaFunc.getNotePosition(_leftNote);
             //         _rightNotePosition = _globalSection[parseInt(_leftNote)-1];
             //         _left = (_currentTime - _lefttime) / (_righttime - _lefttime) * (_rightNotePosition[1].eX - _leftNotePosition[1].X) + _leftNotePosition[1].X;
             //         $('.showline').css({
             //             'left' : _left / _globalScaleW
             //         });
             //     }
             // }
             if(parseInt($('#playType').val()) === 0) {
                 $('.showline').show();
             }
             moveLine();
         })
     }
     // BLOCK MOVE EVENT
     function moveBlock() {
         // get the current audio time -currentTime
         // get = current time note
         let _currentTime = _globaFunc.getAudioCurrentTime();
         let _note;
         let _leftNote;
         let _rightNote;
         let _page;
         if(_currentTime > _globalTime[_globalTime.length -1][0]) {
             _note = _globalSection[_globalSection.length -1][0][0];
             _page = _globalSection[_globalSection.length -1][0][1];
         }else if(_currentTime < _globalTime[0][0]) {
             _note = _globalSection[0][0][0];
             _page = 1;
         } else {
             for(var i =0; i < _globalTime.length; i++) {
                 if(_currentTime >= _globalTime[i][0].toFixed(6) && _currentTime < _globalTime[i+1][0].toFixed(6)) {
                     _leftNote = _globalTime[i][1];
                     _rightNote = _globalTime[i+1][1];
                     const _leftNoteVal = _globaFunc.getNotePosition(_leftNote);
                     const _rightNoteVal = _globaFunc.getNotePosition(_rightNote);
 
                     // IF ON ONELINE
                     if (parseInt(_leftNote) === parseInt(_rightNote)) {
                         const _currentLenght = (_rightNoteVal[1].x - _leftNoteVal[1].x) / (_globalTime[i+1][0] - _globalTime[i][0]) * ( _currentTime - _globalTime[i][0]);
                         // Pre-Note
                         if(_currentLenght < _globalSection[parseInt(_leftNote) - 1].x) {
                             _note = _leftNote;
                         }else {
                             _note = _rightNote;
                         }
                     }else {
                         _note = _globalTime[i][1];
                     }
                     _page = _globaFunc.getNotePosition(_note)[0][1];
                 }
             }
         }
         $('#pageNub').val(_page).trigger('change');
         $('#currentPage').html(_page);
         _globaFunc.setBlockPosition(_note);
     }
     // LINE MOVE EVENT
     function moveLine() {
         $(document).on('change', '#cureentNote', function() {
              var _val = $(this).val();
              let _nextNoteTime = _globalTime[_val]; // TO LINE TIME
              var _nextNotePosition, _nextNotePage;
              let _preNote = _globalTime[_val - 1][1];
              let _preTime = _globalTime[_val - 1][0].toFixed(6);
              let _pageHeight = $('#muscic-pdf canvas').height();
              if(_nextNoteTime[1] === 'end') {
                 let _lastSection = _globalSection[_globalSection.length -1];
                 let _lastLeft = _lastSection[1].eX / _globalScaleW;
                 $('.showline').animate({'left': _lastLeft}, (_nextNoteTime[0] - _preTime).toFixed(6)* 1000 / parseFloat(getSpeed()));
              }else {
                 $.each(_globalNote, function(index, val) {
                     if(val[0][0] === _nextNoteTime[1]) {
                         _nextNotePosition = val[1];
                         _nextNotePage = val[0][1];
                         
                         if((_nextNotePosition.x / _globalScaleW) > parseFloat($('.showline').css('left'))) {
                             $('.showline').animate({'left': _nextNotePosition.x / _globalScaleW}, ((_nextNoteTime[0] -_preTime).toFixed(6)*1000) / parseFloat(getSpeed()), function() {
                                 $('#cureentNote').val(parseInt(_val)+1).trigger('change');
                             });
                             return false;
                         }else {
                             // page position
                             let _destinationSection;
                             let _note = val;
                             let _left, _top, _height;
                             
                             $.each(_globalSection, function(m, nVal) {
                                 if(nVal[0][0] === parseInt(_preNote)) {
                                     _destinationSection = nVal;
                                     return false;
                                 }
                             });
                             
                             $('.showline').animate({'left': _destinationSection[1].eX / _globalScaleW}, (_nextNoteTime[0] - _preTime).toFixed(6)*1000/parseFloat(getSpeed()), function() {
                                 _left = _note[1].x / _globalScaleW;
                                 _height= (_note[1].eY - _note[1].y) / _globalScaleH;
                                 _top = _note[1].y / _globalScaleH + _pageHeight*(_note[0][1] - 1);
                                 $('.showline').hide();
                                 $('.showline').stop();
                                 clearInterval();
                                 $('.showline').css({
                                     'left': _left,
                                     'top': _top,
                                     'height': _height
                                 });
                                 
                                 if(parseInt($('#playType').val()) === 0) {
                                     $('.showline').show();
                                 }
                                 $('#cureentNote').val(parseInt(_val)+1).trigger('change');
                             });
                             return false;
                         }
                     }
                  });
              }
 
         })
     }
     // SWITCH PLAY TYPE
     // @ showlin or showblock
     function changePlayType() {
         $(document).on('change', '#typeBlock', function() {
             if( $(this).prop('checked')) {
                 $('.showline').addClass('hide');
                 $('.showblock').removeClass('hide');
                 $('#playType').val(1);
             }else {
                 $('.showline').removeClass('hide');
                 $('.showblock').addClass('hide');
             }
         });
         $(document).on('change', '#typeNote', function() {
             if( $(this).prop('checked')) {
                 $('.showline').removeClass('hide');
                 $('.showblock').addClass('hide');
                 $('#playType').val(0);
             }else {
                 $('.showline').addClass('hide');
                 $('.showblock').removeClass('hide');
             }
         });
     }
 
     // SWITCH PLAY SPEED
     function changePlaySpeed() {
         $(document).on('change', '#swicthSpeed', function() {
             var _speed = $(this).val();
             $('#audioplay')[0].playbackRate = _speed;
             $('#Speed').val(_speed);
         })
     }
 
     // PAGE CHANGE
     function changePageNub() {
         $(document).on('change', '#pageNub', function() {
             let _pageHeight = $('.showmusic canvas').height();
             $('#muscic-pdf').css({
                 'top': - _pageHeight * ($(this).val() -1 ) + 'px'
             });
         })
     }
 
     // SET PAGE SELECT
     function selectPage() {
         $(document).on('click', '.ico-pre', function() {
             let _currentPage = parseInt($('#currentPage').text());
             let _pageLenght = parseInt($('#pageLength').text());
             let _canvasH = $('#muscic-pdf canvas').height();
             if(_currentPage > 1) {
                 $('#audioplay')[0].pause();
                 $('#currentPage').text(_currentPage -1);
                 $('#pageNub').val(_currentPage -1).trigger('change');
             }
         });
         $(document).on('click', '.ico-next', function() {
             let _currentPage = parseInt($('#currentPage').text());
             let _pageLenght = parseInt($('#pageLength').text());
             let _canvasH = $('#muscic-pdf canvas').height();
             if(_currentPage < _pageLenght) {
                 $('#audioplay')[0].pause();
                 $('#currentPage').text(_currentPage + 1);
                 $('#pageNub').val(_currentPage + 1).trigger('change');
             }
         });
     }
})()