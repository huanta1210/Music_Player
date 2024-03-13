const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'Huấn là siêu nhân'

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play')
const player = $('.player'); 
const progress = $('#progress');
const nextSong = $('.btn-next');
const prevSong = $('.btn-prev');
const randomSong = $('.btn-random');
const repeatSong = $('.btn-repeat');
const playList = $('.playlist');
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    confid: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: ' Ngắn Ngủi ft. Kel C',
            singer: 'Sol x LDleKING',
            path: 'music/ngan-ngui-ft-kel-c-audio.mp3',
            image: 'img/sol7.jpg',
        },
        {
            name: 'Biết rõ vẫn khó đi',
            singer: ' KraziNoyze ft. BlakRay, DSK',
            path: 'music/dsk-vrg.mp3',
            image: 'img/dsk.webp',
        },
        {
            name: 'Đôi bờ',
            singer: 'DSK [VRG]',
            path: 'music/krazinoyze-ft-blakray-dsk-lyric-video.mp3',
            image: 'img/dsk.webp',
        },
        {
            name: 'Đôi bờ',
            singer: 'DSK [VRG]',
            path: 'music/krazinoyze-ft-blakray-dsk-lyric-video.mp3',
            image: 'img/dsk.webp',
        },
        {
            name: 'Đôi bờ',
            singer: 'DSK [VRG]',
            path: 'music/krazinoyze-ft-blakray-dsk-lyric-video.mp3',
            image: 'img/dsk.webp',
        },
        {
            name: 'Đôi bờ',
            singer: 'DSK [VRG]',
            path: 'music/krazinoyze-ft-blakray-dsk-lyric-video.mp3',
            image: 'img/dsk.webp',
        },
        {
            name: 'Đôi bờ',
            singer: 'DSK [VRG]',
            path: 'music/krazinoyze-ft-blakray-dsk-lyric-video.mp3',
            image: 'img/dsk.webp',
        },
       
    ],
    setConfid: function(key, value) {
        this.confid[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.confid));
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active': ''}" data-index="${index}">
            <div class="thumb" style="background-image: url(${song.image});">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
        `
        })
        playList.innerHTML = htmls.join('');
    },
    definerProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
       
    },
    handelEvent: function() { 
        const cdWidth = cd.offsetWidth;
        const _this = this;
        //khi quay
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            interations: Infinity
            
        })
        cdThumbAnimate.pause();
        // phóng to thu nhỏ cd
        document.onscroll = function() {
            const scrollTop = window.scrollY;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0 ;
            cd.style.opacity = newCdWidth / cdWidth;  
        }
        // xử lí khi click play 
        playBtn.addEventListener('click', () => {

            if(_this.isPlaying) {
                audio.pause();   
            } else {
                audio.play(); 
            }
        })

       
        // khi chạy
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        // khi dừng
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();

        }
        // khi tiến độ thay đổi bài hát
        audio.ontimeupdate = function() {

            if(audio.duration) {
               const progressPercentage = Math.floor( audio.currentTime / audio.duration * 100);
               progress.value = progressPercentage;
            }
           
        }
        // xử lí tua
        progress.oninput = function(e) {
            if(audio.duration) {

                const seekTime = audio.duration / 100 * e.target.value ;
                audio.currentTime = seekTime;
            }
        }
        //khi chuyển bài tiếp
        nextSong.onclick = function() {
            if(_this.isRandom) {
                _this.randomSongs();
            } else {
                _this.nextSongs();
            }
            audio.play();
           _this.render();
           _this.scrollActiveSongNext();

        }
        //khi quay lai bai hat
        prevSong.onclick = function() {
            if(_this.isRandom) {
                _this.randomSongs();
            } else {
                _this.prevSongs();
            }
          
            audio.play();
            _this.render(); 
           _this.scrollActiveSongPrev();

        }
        // khi random
        randomSong.onclick = function() {
           _this.isRandom = !_this.isRandom;
           _this.setConfid('isRandom',_this.isRandom )
           randomSong.classList.toggle("active", _this.isRandom);
           
        }
        // khi repeat
        repeatSong.onclick = function(e) {
            _this.isRepeat =!_this.isRepeat;
            _this.setConfid('isRepeat',_this.isRepeat )
            
            repeatSong.classList.toggle("active", _this.isRepeat);
        }
        
        // khi next song ending
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextSong.click();
            }
          
            audio.play();
        }
        // lắng nghe hành vi click vào playlist
       playList.onclick = function(e) {
        const songNode = e.target.closest('.song:not(.active)');
        const songOption = e.target.closest('.option');
        if(songNode || songOption) {
            if(songNode) {
                _this.currentIndex = Number(songNode.dataset.index);
                _this.loadCurrentSong();
                audio.play();
                _this.render();
            }
        }
        if(songOption) {

        }
       }

    },

    scrollActiveSongPrev: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        },500)
    },
    scrollActiveSongNext: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        },300)
    },
    loadCurrentSong: function() {
 
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
    },
    loadConfig: function() {
        this.isRandom = this.confid.isRandom;
        this.isRepeat = this.confid.isRepeat;

    },
    nextSongs: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length ) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
        

    },
    prevSongs: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    randomSongs: function() {
        let newIndex ;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while(newIndex === this.currentIndex);
       this.currentIndex = newIndex;
       this.loadCurrentSong();
       
    },
    start: function() {

        //gán cáu hình con fig vàp ứng dụng
        this.loadConfig();
        // định nghĩa thuộc tính objecti
        this.definerProperties();


        // lắng nghe sự kiện
        this.handelEvent();
        // tải thông tin bài hát vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        this.render()
        // hiển thị trạng thái ban đầu của button repaet và random
        randomSong.classList.toggle("active", this.isRandom);
        repeatSong.classList.toggle("active", this.isRepeat);
    }
};
app.start()
