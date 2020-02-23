V.component('[data-video]', {

    /**
     * Format time
     * @param {Number} time
     * @return {Object}
     */
    formatTime: function(time){

        var result = new Date(time * 1000).toISOString().substr(11, 8);
        var minutes = result.substr(3, 2);
        var seconds = result.substr(6, 2);

        return {
            m: minutes,
            s: seconds
        }
    },

    /**
     * Constructor
     * @param {Function} resolve
     * @param {Function} reject
     * @return {void}
     */
    constructor: function(resolve, reject){

        var self = this;

        // Public
        window.showVideo = function(){
            return self.showVideo();
        };
        window.hideVideo = function(){
            return self.hideVideo();
        };
        window.loadVideo = function(){
            return self.loadVideo();
        };
        window.playVideo = function(){
            return self.playVideo();
        };
        window.pauseVideo = function(){
            return self.pauseVideo();
        };
        window.stopVideo = function(){
            return self.stopVideo();
        };
        window.toggleVideo = function(){
            return self.toggleVideo();
        }
        window.forwardVideo = function(){
            return self.forwardVideo();
        }
        window.backwardVideo = function(){
            return self.backwardVideo();
        }
        window.setWatched = function(){
            return self.setWatched();
        }

        resolve(this);

    },

    /**
     * On render
     * @param {Function} resolve
     * @param {Function} reject
     * @return {void}
     */
    onRender: function(resolve, reject){

        var self = this;
        var element = this.element;
        var video = V.$('video', element);
            video.controls = false;

        self.video = video;
        self.playing = false;

        // Video Events
        V.on(video, 'click', function(e){
            e.preventDefault();
            self.toggleVideo();
        });

        V.on(video, 'loadedmetadata', function(e){
            self.initializeVideo();
        });

        V.on(video, 'timeupdate', function(e){
            self.updateTimeElapsed();
            self.updateProgress();
        });

        // UI Events
        self.on('click', '.video-extra-play', function(e){
            e.preventDefault();
            self.toggleVideo();
        });

        self.on('click', '.video-extra-watched', function(e){
            e.preventDefault();
            self.setWatched();
        });

        self.on('click', '.video-extra-episodes', function(e){
            e.preventDefault();
            self.pauseVideo();
            self.hideVideo();
            self.listRelatedEpisodes();
        });

        self.on('click', '.video-extra-close', function(e){
            e.preventDefault();
            self.pauseVideo();
            self.hideVideo();
        });

        var controlsTimeout = null;
        V.on(element, 'mouseenter mousemove', function(e){

            element.classList.add('show-controls');

            if( controlsTimeout ){
                window.clearTimeout(controlsTimeout);
            }

            controlsTimeout = window.setTimeout(function(){
                element.classList.remove('show-controls');
            }, 2000); // 2s

        });

        V.on(element, 'mouseleave', function(e){
            element.classList.remove('show-controls');
        });

        self.on('mousemove', 'input[type="range"]', function(e){
            self.updateSeekTooltip(e);
        });

        self.on('input', 'input[type="range"]', function(e){
            self.skipAhead(e.target.dataset.seek);
        });

        // Private
        self.on('show', function(e){
            e.preventDefault();
            self.showVideo();
        });

        self.on('hide', function(e){
            e.preventDefault();
            self.hideVideo();
        });

        self.on('load', function(e){
            e.preventDefault();
            self.loadVideo();
        });

        self.on('play', function(e){
            e.preventDefault();
            self.playVideo();
        });

        self.on('pause', function(e){
            e.preventDefault();
            self.pauseVideo();
        });

        self.on('stop', function(){
            e.preventDefault();
            self.stopVideo();
        });

        self.on('toggle', function(){
            e.preventDefault();
            self.toggleVideo();
        });

        self.on('forward', function(){
            e.preventDefault();
            self.forwardVideo();
        });

        self.on('backward', function(){
            e.preventDefault();
            self.backwardVideo();
        });

        self.on('watched', function(){
            e.preventDefault();
            self.setWatched();
        });

        resolve(this);
    },

    /**
     * List related episodes
     * @return {void}
     */
    listRelatedEpisodes: function(){

        var serieId = window.serieId;
        var serieName = window.serieName;
        var serieInQueue = window.serieInQueue;

        window.mountEpisodes(
            serieId,
            serieName,
            serieInQueue
        );

    },

    /**
     * Show video
     * @return {void}
     */
    showVideo: function(){

        var self = this;
        var element = self.element;
        var playButton = V.$('.video-extra-play', element);

        element.classList.add('active');
        document.body.classList.add('video-active');
        window.setActiveElement(playButton);

    },

    /**
     * Hide video
     * @return {void}
     */
    hideVideo: function(){

        var self = this;
        var element = self.element;

        element.classList.remove('active');
        document.body.classList.remove('video-active');

    },

    /**
     * Load video
     * @return {Promise}
     */
    loadVideo: function(){

        if( !Hls.isSupported() ) {
            throw Error('Video format not supported.');
        }

        var self = this;
        var element = self.element;
        var video = self.video;
        var title = V.$('.video-title-bar', element);

        var episodeId = window.episodeId;
        var episodeNumber = window.episodeNumber;
        var episodeName = window.episodeName;
        var serieId = window.serieId;
        var serieName = window.serieName;

        if( self.lastEpisodeId == episodeId ){
            return Promise.resolve();
        }

        self.lastEpisodeId = episodeId;
        title.innerHTML = serieName + ' / EP ' + episodeNumber + ' - ' + episodeName;

        var data = window.getSessionData();
        var fields = [
            'media.stream_data',
            'media.media_id',
            'media.playhead',
            'media.duration'
        ];

        window.pushHistory('video/' + serieId + '/' + episodeId);
        window.showLoading();

        element.classList.add('video-loading');

        return Api.request('POST', '/info', {
            session_id: data.sessionId,
            locale: data.locale,
            media_id: episodeId,
            fields: fields.join(',')
        }).then(function(response){

            var streams = response.data.stream_data.streams;
            var stream = streams[ streams.length - 1 ].url;

            var startTime = response.data.playhead || 0;
            var duration = response.data.duration || 0;

            if( startTime / duration > 0.85 || startTime < 30 ){
                startTime = 0;
            }

            return new Promise(function (resolve, reject){

                var hls = new Hls();
                    hls.loadSource(stream);
                    hls.attachMedia(video);

                hls.on(Hls.Events.MANIFEST_PARSED, function(){
                    window.hideLoading();
                    element.classList.remove('video-loading');
                    element.classList.add('video-loaded');
                    video.currentTime = startTime;
                    resolve(response);
                });

                return response;
            });
        }).catch(function(error){
            window.hideLoading();
        });
    },

    /**
     * Initialize video
     * @return {void}
     */
    initializeVideo: function(){

        var self = this;
        var element = self.element;
        var video = self.video;
        var duration = V.$('.duration', element);
        var seek = V.$('input[type="range"]', element);
        var progress = V.$('progress', element);

        var time = Math.round(video.duration);
        var format = self.formatTime(time);

        duration.innerText = format.m + ':' + format.s;
        duration.setAttribute('datetime', format.m + 'm ' + format.s + 's');

        seek.setAttribute('max', time);
        progress.setAttribute('max', time);

    },

    /**
     * Play video
     * @return {void}
     */
    playVideo: function(){

        var self = this;
        var element = self.element;
        var video = self.video;

        video.play();
        element.classList.remove('video-paused');
        element.classList.add('video-playing');

        self.playing = true;
        self.trackProgress();

    },

    /**
     * Pause video
     * @return {void}
     */
    pauseVideo: function(){

        var self = this;
        var element = self.element;
        var video = self.video;

        video.pause();
        element.classList.remove('video-playing');
        element.classList.add('video-paused');

        self.playing = false;
        self.stopTrackProgress();

    },

    /**
     * Stop video
     * @return {void}
     */
    stopVideo: function(){

        var self = this;

        self.pauseVideo();
        self.skipAhead(0);

    },

    /**
     * Toggle video
     * @return {void}
     */
    toggleVideo: function(){

        var self = this;

        if( self.playing ){
            self.pauseVideo();
        } else {
            self.playVideo();
        }

    },

    /**
     * Forward video
     * @return {void}
     */
    forwardVideo: function(){

        var self = this;
        var video = self.video;

        self.skipAhead(video.currentTime + 10);

    },

    /**
     * Backward video
     * @return {void}
     */
    backwardVideo: function(){

        var self = this;
        var video = self.video;

        self.skipAhead(video.currentTime - 10);

    },

    /**
     * Skip ahead video
     * @param {Number} skipTo
     * @return {void}
     */
    skipAhead: function(skipTo){

        var self = this;
        var element = self.element;
        var video = self.video;
        var seek = V.$('input[type="range"]', element);
        var progress = V.$('progress', element);

        video.currentTime = skipTo;
        seek.value = skipTo;
        progress.value = skipTo;

    },

    /**
     * Update seek tooltip text and position
     * @param {Event} event
     * @return {void}
     */
    updateSeekTooltip: function(event){

        var self = this;
        var element = self.element;
        var tooltip = V.$('.tooltip', element);
        var seek = V.$('input[type="range"]', element);

        var skipTo = Math.round(
            (event.offsetX / event.target.clientWidth)
            * parseInt(event.target.getAttribute('max'), 10)
        );

        var format = self.formatTime(skipTo);

        seek.dataset.seek = skipTo;
        tooltip.textContent = format.m + ':' + format.s;
        tooltip.style.left = event.pageX + 'px';

    },

    /**
     * Update video time elapsed
     * @return {void}
     */
    updateTimeElapsed: function(){

        var self = this;
        var element = self.element;
        var video = self.video;
        var elapsed = V.$('.elapsed', element);

        var time = Math.round(video.currentTime);
        var format = self.formatTime(time);

        elapsed.innerText = format.m + ':' + format.s;
        elapsed.setAttribute('datetime', format.m + 'm ' + format.s + 's');

    },

    /**
     * Update video progress
     * @return {void}
     */
    updateProgress: function(){

        var self = this;
        var element = self.element;
        var video = self.video;
        var seek = V.$('input[type="range"]', element);
        var progress = V.$('progress', element);

        seek.value = Math.floor(video.currentTime);
        progress.value = Math.floor(video.currentTime);

    },

    /**
     * Start progress tracking
     * @return {void}
     */
    trackProgress: function(){

        var self = this;

        if( self.trackTimeout ){
            self.stopTrackProgress();
        }

        self.trackTimeout = window.setTimeout(function(){
            self.updatePlaybackStatus();
        }, 30000); // 30s

    },

    /**
     * Stop progress tracking
     * @return {void}
     */
    stopTrackProgress: function(){

        var self = this;

        if( self.trackTimeout ){
            window.clearTimeout(self.trackTimeout);
        }

    },

    /**
     * Update playback status at Crunchyroll
     * @return {Promise}
     */
    updatePlaybackStatus: function(){

        var self = this;
        var video = self.video;
        var data = window.getSessionData();

        var elapsed = 30;
        var elapsedDelta = 30;
        var playhead = video.currentTime;

        return Api.request('POST', '/log', {
            session_id: data.sessionId,
            locale: data.locale,
            event: 'playback_status',
            media_id: episodeId,
            playhead: playhead,
            elapsed: elapsed,
            elapsedDelta: elapsedDelta
        }).then(function(response){
            self.trackProgress();
        });
    },

    /**
     * Set video as watched at Crunchyroll
     * @return {Promise}
     */
    setWatched: function(){

        var self = this;
        var video = self.video;
        var data = window.getSessionData();

        var duration = Math.floor(video.duration);
        var playhead = Math.floor(video.currentTime);
        var elapsed = duration - playhead;
        var elapsedDelta = duration - playhead;

        return Api.request('POST', '/log', {
            session_id: data.sessionId,
            locale: data.locale,
            event: 'playback_status',
            media_id: episodeId,
            playhead: duration,
            elapsed: elapsed,
            elapsedDelta: elapsedDelta
        }).then(function(response){
            self.stopTrackProgress();
        });
    }

});