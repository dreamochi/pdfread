class AduioFun {
    constructor(MusicData) {
        var _globalPdfSize, _globalSection, _globalNote, _globalTime, _globalSpeed, _globalScaleW, _globalScaleH;
        this._globalPdfSize = MusicData.pdfSize();
        this._globalSection = MusicData.measureItems();
        this._globalNote = MusicData.noteItems();
        this._globalTime = MusicData.noteTime();
        this._globalSpeed = document.getElementById("swicthSpeed").value;
        this.audioplay = document.getElementById("audioplay");
    }

    // GET AUDIO CURRENT TIME
    getAudioCurrentTime() {
        var currentTime = this.audioplay.currentTime;
        return currentTime;
    }

    setBlockPosition(note) {
        note = note > 1 ? parseInt(note) - 1 : 0;
        let _tempNote = this._globalSection[note][1];
        let _pageNub = this._globalSection[note][0][1];
        let _left, _top, _height, _width;
        // let _canvasHeight = document.querySelector(".musicShowModal").offsetHeight;
        _left = _tempNote.x / _globalScaleW;
        _top = _tempNote.y / _globalScaleH
        // _top = _tempNote.y / _globalScaleH + _canvasHeight * (_pageNub - 1);
        _width = (_tempNote.eX - _tempNote.x) / _globalScaleW;
        _height = (_tempNote.eY - _tempNote.y) / _globalScaleH;

        changePageNub(_pageNub)

        showblockEle.style.width = _width + "px";
        showblockEle.style.height = _height + "px";
        showblockEle.style.left = _left + "px";
        showblockEle.style.top = _top + "px";
    }

    getNotePosition(note) {
        let _note;
        for (const val of this._globalNote) {
            if (val[0][0] === note) {
                _note = val;
                break;
            }
        }
        return _note;
    }
}
