var keys = {
    STOP: 413,
    PAUSE: 19,
    PLAY: 415,
    OK: 13,
    FORWARD: 417,
    BACKWARD: 412,
    BACK: 461,
    RIGHT: 39,
    LEFT: 37,
    UP: 38,
    DOWN: 40,
    INFO: 457
};

/**
 * Make request on Crunchyroll API
 * @param {String} method
 * @param {String} endpoint
 * @param {Object} data
 * @return {Promise}
 */
function apiRequest(method, endpoint, data){

    var url = 'https://api.crunchyroll.com';
        url += endpoint + '.0.json';

    data.version = '0';
    data.connectivity_type = 'ethernet';

    if( method == 'POST' ){

        var formData = new FormData();
        for ( var key in data ) {
            formData.append(key, data[key]);
        }

        return V.http.request(method, url, formData);
    }

    return V.http.request(method, url, data);
}

/**
 * Create UUID V4
 * @return {String}
 */
function createUuid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.
    replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

V.component('[data-app-events]', {

    /**
     * Constructor
     * @param {Function} resolve
     * @param {Function} reject
     * @return {void}
     */
    constructor: function(resolve, reject){

        var self = this;

        // Public
        window.handleKeyPress = function(key){
            return self.handleKeyPress(key);
        };

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
            self.lastKey = null;
            self.lastKeyTime = null;

        // Private
        self.on('keydown', function(e){
            self.handleKeyPress(e.keyCode);
        });

        resolve(this);

    },

    /**
     * Handle key press
     * @param {Number} key
     * @return {void}
     */
    handleKeyPress: function(key){

        var self = this;
        var body = document.body;
        var videoActive = body.classList.contains('video-active');

        // STOP
        if( key == keys.STOP ){
            videoActive && window.stopVideo();

        // PAUSE
        }else if( key == keys.PAUSE ){
            videoActive && window.pauseVideo();

        // PLAY
        }else if( key == keys.PLAY ){
            videoActive && window.playVideo();

        // OK
        }else if( key == keys.OK ){

            if( videoActive ) {
                window.toggleVideo();
            }else{
                // TODO: menu or element click
                // return this.menu(keys.OK);
            }

        // FORWARD
        }else if( key == keys.FORWARD ){
            videoActive && window.forwardVideo();

        // BACKWARD
        }else if( key == keys.BACKWARD ){
            videoActive && window.backwardVideo();

        // RIGHT
        }else if( key == keys.RIGHT ){

            if( videoActive ) {
                window.forwardVideo();
            }else{
                // TODO: right menu or element
                // return this.menu(keys.RIGHT);
            }

        // LEFT
        }else if( key == keys.LEFT ){

            if( videoActive ) {
                window.backwardVideo();
            }else{
                // TODO: left menu or element
                // return this.menu(keys.LEFT);
            }

        // UP
        }else if( key == keys.UP ){

            // TODO: up menu or element
            // return this.menu(keys.UP);

        // DOWN
        }else if( key == keys.DOWN ){

            // TODO: down menu or element
            // return this.menu(keys.DOWN);

        // INFO
        }else if( key == keys.INFO ){

            // TODO: menu or element click
            // return this.menu(keys.OK);

        // BACK
        }else if( key == keys.BACK ){

            if( videoActive ){
                window.stopVideo();
                window.hideVideo();
            }else{

                // TODO: menu or element back
                // return this.menu(keys.OK);

            }

        }

        self.lastKey = key;
        self.lastKeyTime = new Date();

    }

});

V.component('[data-app-history]', {

    /**
     * Constructor
     * @param {Function} resolve
     * @param {Function} reject
     * @return {void}
     */
    constructor: function(resolve, reject){

        var self = this;

        // Public
        window.pushHistory = function(key){
            return self.pushHistory(key);
        };
        window.resetHistory = function(){
            return self.resetHistory();
        };

        resolve(this);

    },

    /**
     * Push history based on key
     * @param {Number} key
     * @return {void}
     */
    pushHistory: function(key){

        // PUSH
        if( key == keys.OK || key == keys.INFO ){

            history.pushState({
                uuid: createUuid()
            }, document.title);

        // BACK
        }else if( key == keys.BACK ){
            history.back();
        }

    },

    /**
     * Reset browsing history
     * @return {void}
     */
    resetHistory: function(){
        history.go(0);
    }

});

V.component('[data-loading]', {

    /**
     * Constructor
     * @param {Function} resolve
     * @param {Function} reject
     * @return {void}
     */
    constructor: function(resolve, reject){

        var self = this;

        // Public
        window.showLoading = function(){
            return self.showLoading();
        };
        window.hideLoading = function(){
            return self.hideLoading();
        };

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

        // Private
        self.on('show', function(e){
            e.preventDefault();
            self.showLoading();
        });

        self.on('hide', function(e){
            e.preventDefault();
            self.hideLoading();
        });

        resolve(this);

    },

    /**
     * Show loading box
     * @return {void}
     */
    showLoading: function(){
        var element = this.element;
            element.classList.add('active');
    },

    /**
     * Hide loading box
     * @return {void}
     */
    hideLoading: function(){
        var element = this.element;
            element.classList.remove('active');
    }

});

V.component('[data-login]', {

    /**
     * Constructor
     * @param {Function} resolve
     * @param {Function} reject
     * @return {void}
     */
    constructor: function(resolve, reject){

        var self = this;

        // Public
        window.showLogin = function(){
            return self.showLogin();
        };
        window.hideLogin = function(){
            return self.hideLogin();
        }
        window.makeLogin = function(){
            return self.makeLogin();
        }
        window.makeLogout = function(){
            return self.makeLogout();
        }
        window.getSessionData = function(){
            return self.getSessionData();
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

        // Private
        self.on('show', function(e){
            e.preventDefault();
            self.showLogin();
        });

        self.on('hide', function(e){
            e.preventDefault();
            self.hideLogin();
        });

        self.on('submit', 'form', function(e){
            e.preventDefault();
            self.makeLogin();
        });

        self.on('login', function(e){
            e.preventDefault();
            self.makeLogin();
        });

        self.on('logout', function(e){
            e.preventDefault();
            self.makeLogout();
        });

        // Init
        self.loadSessionData();

        if( !self.isLoggedIn() ){
            self.showLogin();
        }

        resolve(this);
    },

    /**
     * Retrieve login data
     * @return {Object}
     */
    getSessionData: function(){

        var data = localStorage.getItem('cr');
            data = ( data ) ? JSON.parse(data) : {};

        return data;
    },

    /**
     * Set login data
     * @param {Object} data
     * @return {void}
     */
    setSessionData: function(data){
        localStorage.setItem('cr', JSON.stringify(data));
        window.updateMenu();
    },

    /**
     * Load login data
     * @return {void}
     */
    loadSessionData: function(){

        var self = this;
        var element = self.element;
        var data = this.getSessionData();

        if( data.email ){
            V.$('input#email', element).value = data.email;
        }
        if( data.password ){
            V.$('input#password', element).value = data.password;
        }
        if( data.locale ){
            V.$('select#locale', element).value = data.locale;
        }

    },

    /**
     * Return if is logged in
     * @return {Boolean}
     */
    isLoggedIn: function(){

        var data = this.getSessionData();

        if( data.expires &&
            new Date() < new Date(data.expires) ){
            return true;
        }

        // Clear all session data
        this.setSessionData({});

        return false;
    },

    /**
     * Show login box
     * @return {void}
     */
    showLogin: function(){
        var element = this.element;
            element.classList.add('active');
    },

    /**
     * Hide login box
     * @return {void}
     */
    hideLogin: function(){
        var element = this.element;
            element.classList.remove('active');
    },

    /**
     * Try make login on Crunchyroll
     * @return {Promise}
     */
    makeLogin: function(){

        var self = this;
        var element = this.element;

        var message = V.$('#message', element);
            message.innerHTML = '';

        var email = V.$('input#email', element);
        var password = V.$('input#password', element);
        var locale = V.$('select#locale', element);

        var accessToken = 'LNDJgOit5yaRIWN';
        var deviceType = 'com.crunchyroll.windows.desktop';
        var deviceId = createUuid();
        var sessionId = null;

        window.showLoading();

        return apiRequest('GET', '/start_session', {
            access_token: accessToken,
            device_type: deviceType,
            device_id: deviceId,
            locale: locale.value
        })
        .then(function(response){

            if( response.error ){
                throw new Error('Session cannot be started.');
            }

            sessionId = response.data.session_id;

            return apiRequest('POST', '/login', {
                session_id: sessionId,
                account: email.value,
                password: password.value,
                locale: locale.value
            });
        })
        .then(function(response){

            if( response.error ){
                throw new Error('Invalid login.');
            }

            self.setSessionData({
                accessToken: accessToken,
                deviceType: deviceType,
                deviceId: deviceId,
                sessionId: sessionId,
                locale: locale.value,
                email: email.value,
                password: password.value,
                userId: response.data.user.user_id,
                userName: response.data.user.username,
                auth: response.data.auth,
                expires: response.data.expires
            });

            self.hideLogin();
            window.hideLoading();

            return response;
        })
        .catch(function(error){

            password.value = '';
            message.innerHTML = error.message;

            self.showLogin();
            window.hideLoading();

        });
    },

    /**
     * Try make logout on Crunchyroll
     * @return {Promise}
     */
    makeLogout: function(){

        if( !this.isLoggedIn() ){
            return this.showLogin();
        }

        var self = this;
        var element = this.element;

        var password = V.$('input#password', element);
            password.value = '';

        var message = V.$('#message', element);
            message.innerHTML = '';

        var data = this.getSessionData();

        self.showLogin();
        window.showLoading();

        return apiRequest('POST', '/logout', {
            session_id: data.sessionId,
            locale: data.locale
        }).then(function(response){

            // Clear all session data
            self.setSessionData({});
            window.hideLoading();

            return response;
        })
        .catch(function(error){
            message.innerHTML = error.message;
            window.hideLoading();
        });
    }

});

V.component('[data-menu]', {

    /**
     * Constructor
     * @param {Function} resolve
     * @param {Function} reject
     * @return {void}
     */
    constructor: function(resolve, reject){

        var self = this;

        // Public
        window.updateMenu = function(){
            return self.updateMenu();
        };

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
        var content = V.$('#content');

        self.on('click', '.menu-link', function(e){

            e.preventDefault();
            window.pushHistory(keys.OK);

            V.$('.menu-link.active', element).classList.remove('active');
            this.classList.add('active');

            content.innerHTML = '<div class="inside" data-' + this.dataset.content + '></div>';
            V.mount(content);

        });

        self.on('click', '.account-logout', function(e){
            window.makeLogout();
            window.resetHistory();
        });

        self.updateMenu();

        resolve(this);
    },

    /**
     * Update menu
     * @return {Promise}
     */
    updateMenu: function(){

        var element = this.element;

        if( !element ){
            return;
        }

        var data = window.getSessionData();
        var name = V.$('.account-name', element);

        if( data.userName ){
            name.innerHTML = data.userName
            element.classList.add('logged');
        }else{
            name.innerHTML = '';
            element.classList.remove('logged');
        }

    }

});

V.component('[data-queue]', {

    /**
     * Constructor
     * @param {Function} resolve
     * @param {Function} reject
     * @return {void}
     */
    constructor: function(resolve, reject){

        var self = this;

        // Public
        window.listQueue = function(){
            return self.listQueue();
        };

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

        // Private
        self.on('show-queue', function(e){
            e.preventDefault();
            self.listQueue();
        });

        resolve(this);

    },

    /**
     * After render
     * @param {Function} resolve
     * @param {Function} reject
     * @return {void}
     */
    afterRender: async function(resolve, reject){
        await this.listQueue();
        resolve(this);
    },

    /**
     * List queue
     * @return {Promise}
     */
    listQueue: function(){

        var data = window.getSessionData();
        var self = this;
        var element = self.element;
        var html = '';

        window.showLoading();

        return apiRequest('POST', '/queue', {
            session_id: data.sessionId,
            locale: data.locale,
            media_types: 'anime'
        }).then(function(response){

            if( response.error
                && response.code == 'bad_session' ){
                return window.makeLogin().then(function(){
                    return self.listQueue();
                });
            }

            html += '<h1>Queue</h1>';
            html += '<div class="list-items">';
                response.data.map(function(item){
                    html += self.toQueue(item);
                });
            html += '</div>';

            element.innerHTML = html;

            V.mount(element);
            window.hideLoading();

        })
        .catch(function(error){
            window.hideLoading();
        });
    },

    /**
     * Transform data to queue item
     * @param {Object} data
     * @return {String}
     */
    toQueue: function(data){

        var html = '';
        var serie = data.series;
        var episode = data.last_watched_media;
        var playhead = data.last_watched_media_playhead;

        html += '<div class="list-item queue-item" ';
        html += 'data-episode="{EPISODE_ID}" ';
        html += 'data-number="{EPISODE_NUMBER}" ';
        html += 'data-name="{EPISODE_NAME}">';
            html += '<div class="list-item-image">';
                html += '<img src="{EPISODE_IMAGE}" />';
                html += '<div class="list-item-progress" data-progress="{EPISODE_PROGRESS}">&nbsp;</div>';
            html += '</div>';
            html += '<div class="list-item-info">';
                html += '<h2>{SERIE_NAME}</h2>';
                html += '<h3>{EPISODE_NUMBER} - {EPISODE_NAME}</h3>';
            html += '</div>';
        html += '</div>';

        html = html
        .replace('{EPISODE_ID}', episode.media_id)
        .replace('{SERIE_NAME}', serie.name)
        .replace('{EPISODE_NAME}', episode.name)
        .replace('{EPISODE_NAME}', episode.name)
        .replace('{EPISODE_NUMBER}', episode.episode_number)
        .replace('{EPISODE_NUMBER}', episode.episode_number)
        .replace('{EPISODE_IMAGE}', episode.screenshot_image.full_url)
        .replace('{EPISODE_PROGRESS}', playhead);

        return html;
    }

});

V.component('[data-history]', {

    /**
     * Constructor
     * @param {Function} resolve
     * @param {Function} reject
     * @return {void}
     */
    constructor: function(resolve, reject){

        var self = this;

        // Public
        window.listHistory = function(){
            return self.listHistory();
        };

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

        // Private
        self.on('show-history', function(e){
            e.preventDefault();
            self.listHistory();
        });

        resolve(this);

    },

    /**
     * After render
     * @param {Function} resolve
     * @param {Function} reject
     * @return {void}
     */
    afterRender: async function(resolve, reject){
        await this.listHistory();
        resolve(this);
    },

    /**
     * List history
     * @return {void}
     */
    listHistory: function(){

        var data = window.getSessionData();
        var self = this;
        var element = self.element;
        var html = '';

        window.showLoading();

        return apiRequest('POST', '/recently_watched', {
            session_id: data.sessionId,
            locale: data.locale,
            limit: 8,
            offset: 0
        }).then(function(response){

            if( response.error
                && response.code == 'bad_session' ){
                return window.makeLogin().then(function(){
                    return self.listHistory();
                });
            }

            html += '<h1>History</h1>';
            html += '<div class="list-items">';
                response.data.map(function(item){
                    html += self.toHistory(item);
                });
            html += '</div>';

            element.innerHTML = html;

            V.mount(element);
            window.hideLoading();

        })
        .catch(function(error){
            window.hideLoading();
        });
    },

    /**
     * Transform data to history item
     * @param {Object} data
     * @return {String}
     */
    toHistory: function(data){

        var html = '';
        var serie = data.series;
        var collection = data.collection;
        var episode = data.media;
        var playhead = data.playhead;

        html += '<div class="list-item history-item" ';
        html += 'data-episode="{EPISODE_ID}" ';
        html += 'data-number="{EPISODE_NUMBER}" ';
        html += 'data-name="{EPISODE_NAME}">';
            html += '<div class="list-item-image">';
                html += '<img src="{EPISODE_IMAGE}" />';
                html += '<div class="list-item-progress" data-progress="{EPISODE_PROGRESS}">&nbsp;</div>';
            html += '</div>';
            html += '<div class="list-item-info">';
                html += '<h2>{SERIE_NAME}</h2>';
                html += '<h3>{EPISODE_NUMBER} - {EPISODE_NAME}</h3>';
            html += '</div>';
        html += '</div>';

        html = html
        .replace('{EPISODE_ID}', episode.media_id)
        .replace('{SERIE_NAME}', serie.name)
        .replace('{EPISODE_NAME}', episode.name)
        .replace('{EPISODE_NAME}', episode.name)
        .replace('{EPISODE_NUMBER}', episode.episode_number)
        .replace('{EPISODE_NUMBER}', episode.episode_number)
        .replace('{EPISODE_IMAGE}', episode.screenshot_image.full_url)
        .replace('{EPISODE_PROGRESS}', playhead);

        return html;
    }

});

V.component('[data-series]', {

    /**
     * Constructor
     * @param {Function} resolve
     * @param {Function} reject
     * @return {void}
     */
    constructor: function(resolve, reject){

        var self = this;

        // Public
        window.listSeries = function(){
            return self.listSeries();
        };

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

        // Private
        self.on('show-series', function(e){
            e.preventDefault();
            self.listSeries();
        });

        self.on('change', 'select' , function(e){
            self.listSeries();
        });

        self.on('change', 'input' , function(e){
            self.listSeries();
        });

        resolve(this);

    },

    /**
     * After render
     * @param {Function} resolve
     * @param {Function} reject
     * @return {void}
     */
    afterRender: async function(resolve, reject){
        await this.listSeries();
        resolve(this);
    },

    /**
     * List series
     * @return {void}
     */
    listSeries: function(){

        var data = window.getSessionData();
        var self = this;
        var element = self.element;
        var html = '';

        // Filter option
        var filter = 'popular';
        var search = '';

        if( V.$('select#filter', element) ){
            filter = V.$('select#filter', element).value;
        }

        if( V.$('input#search', element) ){
            search = V.$('input#search', element).value;
        }

        if( search ){
            filter = 'prefix:' + search;
        }

        // Fields option
        var fields = [
            'series.series_id',
            'series.name',
            'series.in_queue',
            'series.description',
            'series.portrait_image',
            'series.landscape_image',
            'series.media_count',
            'series.publisher_name',
            'series.year',
            'series.rating',
            'series.url',
            'series.media_type',
            'series.genres',
            'series.etp_guid',
            'image.wide_url',
            'image.fwide_url',
            'image.widestar_url',
            'image.fwidestar_url',
            'image.full_url'
        ];

        window.showLoading();

        return apiRequest('POST', '/list_series', {
            session_id: data.sessionId,
            locale: data.locale,
            media_type: 'anime',
            filter: filter,
            fields: fields,
            limit: 20,
            offset: 0
        }).then(async function(response){

            if( response.error
                && response.code == 'bad_session' ){
                return window.makeLogin().then(function(){
                    return self.listSeries();
                });
            }

            html += '<h1>Series</h1>';
            html += '<div class="list-filters">';
                html += await self.getFilters(filter, search);
            html += '</div>';
            html += '<div class="list-items">';
                response.data.map(function(item){
                    html += self.toSerie(item);
                });
            html += '</div>';

            element.innerHTML = html;

            V.mount(element);
            window.hideLoading();

        })
        .catch(function(error){
            window.hideLoading();
        });
    },

    /**
     * Retrieve series filter
     * @param {String} selected,
     * @param {String} search
     * @return {String}
     */
    getFilters: async function(selected, search){

        var data = window.getSessionData();
        var options = [];
        var categories = [];
        var html = '';

        // Retrieve options
        options.push({id: '', name: '== FILTERS =='});
        options.push({id: 'alpha', name: 'Alphabetical'});
        options.push({id: 'featured', name: 'Featured'});
        options.push({id: 'newest', name: 'Newest'});
        options.push({id: 'popular', name: 'Popular'});
        options.push({id: 'updated', name: 'Updated'});
        options.push({id: 'simulcast', name: 'Simulcasts'});

        // Retrieve categories
        window.categoriesData = window.categoriesData || {};

        if( window.categoriesData[ data.locale ] ){
            categories = window.categoriesData[ data.locale ];

        }else{

            await apiRequest('POST', '/categories', {
                session_id: data.sessionId,
                locale: data.locale,
                media_type: 'anime'
            }).then(function(response){

                categories.push({id: '-', name: '== GENRES =='});
                response.data.genre.map(function(item){
                    categories.push({id: item.tag, name: item.label});
                });

                // categories.push({id: '-', name: '== SEASONS =='});
                // response.data.season.map(function(item){
                //     categories.push({id: item.tag, name: item.label});
                // });

                window.categoriesData[ data.locale ] = categories;

            });

        }

        categories.map(function(item){
            options.push({id: 'tag:' + item.id, name: item.name});
        });

        // Create select
        html += '<select id="filter">';
        html += options.map(function(option){
            return '<option {SELECTED} value="{VALUE}">{LABEL}</option>'
                .replace('{SELECTED}', (option.id == selected) ? 'selected="selected"' : '')
                .replace('{VALUE}', option.id)
                .replace('{LABEL}', option.name);
        });
        html += '</select>';

        html += '<input type="text" id="search" value="{VALUE}" placeholder="{LABEL}">'
            .replace('{VALUE}', search)
            .replace('{LABEL}', 'Search');

        return html;
    },

    /**
     * Transform data to serie item
     * @param {Object} data
     * @return {String}
     */
    toSerie: function(data){

        var html = '';

        html += '<div class="list-item serie-item" ';
        html += 'data-serie="{SERIE_ID}" ';
        html += 'data-name="{SERIE_NAME}">';
            html += '<div class="list-item-image">';
                html += '<img src="{SERIE_IMAGE}" />';
            html += '</div>';
            html += '<div class="list-item-info">';
                html += '<h2>{SERIE_NAME}</h2>';
                // html += '<p>{SERIE_DESCRIPTION}</p>';
            html += '</div>';
        html += '</div>';

        html = html
        .replace('{SERIE_ID}', data.series_id)
        .replace('{SERIE_NAME}', data.name)
        .replace('{SERIE_NAME}', data.name)
        .replace('{SERIE_DESCRIPTION}', data.description)
        .replace('{SERIE_IMAGE}', data.portrait_image.full_url);

        return html;
    }

});

V.component('[data-episodes]', {

    /**
     * Constructor
     * @param {Function} resolve
     * @param {Function} reject
     * @return {void}
     */
    constructor: function(resolve, reject){

        var self = this;

        // Public
        window.listEpisodes = function(){
            return self.listEpisodes();
        };

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

        // Private
        self.on('show-episodes', function(e){
            e.preventDefault();
            self.listEpisodes();
        });

        resolve(this);

    },

    /**
     * After render
     * @param {Function} resolve
     * @param {Function} reject
     * @return {void}
     */
    afterRender: async function(resolve, reject){
        await this.listEpisodes();
        resolve(this);
    },

    /**
     * List episodes
     * @return {void}
     */
    listEpisodes: function(){

        var data = window.getSessionData();
        var self = this;
        var element = self.element;
        var html = '';

        var serieId = element.dataset.id;
        var serieName = element.dataset.name;
        var sort = 'asc'; // asc | desc

        window.showLoading();

        return apiRequest('POST', '/list_media', {
            session_id: data.sessionId,
            locale: data.locale,
            series_id: serieId,
            sort: sort,
            limit: 30,
            offset: 0
        }).then(function(response){

            if( response.error
                && response.code == 'bad_session' ){
                return window.makeLogin().then(function(){
                    return self.listEpisodes();
                });
            }

            html += '<h1>';
                html += '<small>Serie</small><br/>';
                html += serieName + ' - Episodes';
            html += '</h1>';
            html += '<div class="list-items">';
                response.data.map(function(item){
                    html += self.toEpisode(item);
                });
            html += '</div>';

            element.innerHTML = html;

            V.mount(element);
            window.hideLoading();

        })
        .catch(function(error){
            window.hideLoading();
        });
    },

    /**
     * Transform data to episode item
     * @param {Object} data
     * @return {String}
     */
    toEpisode: function(data){

        var self = this;
        var element = self.element;
        var html = '';

        var serieId = element.dataset.id;
        var serieName = element.dataset.name;

        html += '<div class="list-item episode-item" ';
        html += 'data-episode="{EPISODE_ID}" ';
        html += 'data-number="{EPISODE_NUMBER}" ';
        html += 'data-name="{EPISODE_NAME}">';
            html += '<div class="list-item-image">';
                html += '<img src="{EPISODE_IMAGE}" />';
                html += '<div class="list-item-progress" data-progress="{EPISODE_PROGRESS}">&nbsp;</div>';
            html += '</div>';
            html += '<div class="list-item-info">';
                html += '<h2>{SERIE_NAME}</h2>';
                html += '<h3>{EPISODE_NUMBER} - {EPISODE_NAME}</h3>';
            html += '</div>';
        html += '</div>';

        html = html
        .replace('{SERIE_ID}', serieId)
        .replace('{SERIE_NAME}', serieName)
        .replace('{EPISODE_ID}', data.media_id)
        .replace('{EPISODE_NAME}', data.name)
        .replace('{EPISODE_NAME}', data.name)
        .replace('{EPISODE_NUMBER}', data.episode_number)
        .replace('{EPISODE_NUMBER}', data.episode_number)
        .replace('{EPISODE_IMAGE}', data.screenshot_image.full_url)
        .replace('{EPISODE_PROGRESS}', data.playhead);

        return html;
    }

});

V.component('[data-serie]', {

    /**
     * On render
     * @param {Function} resolve
     * @param {Function} reject
     * @return {void}
     */
    onRender: function(resolve, reject){

        var self = this;
        var element = this.element;
        var content = V.$('#content');

        self.on('click', function(e){

            e.preventDefault();
            window.pushHistory(keys.OK);

            content.innerHTML = '<div class="inside" data-episodes data-id="{SERIE_ID}" data-name="{SERIE_NAME}"></div>'
                .replace('{SERIE_ID}', element.dataset.serie)
                .replace('{SERIE_NAME}', element.dataset.name);

            V.mount(content);

        });

        resolve(this);
    }

});

V.component('[data-episode]', {

    /**
     * On render
     * @param {Function} resolve
     * @param {Function} reject
     * @return {void}
     */
    onRender: function(resolve, reject){

        var self = this;
        var element = this.element;

        self.on('click', function(e){

            e.preventDefault();
            window.pushHistory(keys.OK);

            window.episodeId = element.dataset.episode;
            window.episodeNumber = element.dataset.number;
            window.episodeName = element.dataset.name;

            window.loadVideo().then(function(){
                window.showVideo();
                window.playVideo();
            });

        });

        resolve(this);
    },

    /**
     * After render
     * @param {Function} resolve
     * @param {Function} reject
     * @return {void}
     */
    afterRender: async function(resolve, reject){

        var data = window.getSessionData();
        var self = this;
        var element = self.element;

        var episodeId = element.dataset.episode;
        var fields = 'media.stream_data,media.media_id,media.playhead,media.duration';

        await apiRequest('POST', '/info', {
            session_id: data.sessionId,
            locale: data.locale,
            media_id: episodeId,
            fields: fields
        }).then(function(response){
            var stream = response.data.stream_data.streams[0].url;
                element.dataset.stream = stream;
        });

        resolve(this);
    }

});

V.component('[data-video]', {

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
        var player = videojs(video);
            player.hide();

        self.player = player;
        self.playing = false;

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

        resolve(this);
    },

    /**
     * Show video
     * @return {void}
     */
    showVideo: function(){

        var self = this;
        var element = self.element;
        var player = self.player;

        element.classList.add('active');
        document.body.classList.add('video-active');

        player.show();

    },

    /**
     * Hide video
     * @return {void}
     */
    hideVideo: function(){

        var self = this;
        var element = self.element;
        var player = self.player;

        element.classList.remove('active');
        document.body.classList.remove('video-active');

        player.hide();

    },

    /**
     * Load video
     * @return {Promise}
     */
    loadVideo: function(){

        var self = this;
        var player = self.player;

        var data = window.getSessionData();
        var episodeId = window.episodeId;
        var fields = 'media.stream_data,media.media_id,media.playhead,media.duration';

        return apiRequest('POST', '/info', {
            session_id: data.sessionId,
            locale: data.locale,
            media_id: episodeId,
            fields: fields
        }).then(function(response){

            var streams = response.data.stream_data.streams;
            var stream = streams[ streams.length - 1 ].url;

            player.src({
                src: stream,
                type: 'application/x-mpegURL',
                withCredentials: true
            });

            return response;
        });
    },

    /**
     * Play video
     * @return {void}
     */
    playVideo: function(){

        var self = this;
        var player = self.player;

        player.play();
        self.playing = true;

    },

    /**
     * Pause video
     * @return {void}
     */
    pauseVideo: function(){

        var self = this;
        var player = self.player;

        player.pause();
        self.playing = false;

    },

    /**
     * Stop video
     * @return {void}
     */
    stopVideo: function(){

        var self = this;
        var player = self.player;

        player.pause();
        player.currentTime(0);
        self.playing = false;

    },

    /**
     * Toggle video
     * @return {void}
     */
    toggleVideo: function(){

        var self = this;
        var player = self.player;

        if( self.playing ){
            player.pause();
        } else {
            player.play();
        }

    },

    /**
     * Forward video
     * @return {void}
     */
    forwardVideo: function(){

        var self = this;
        var player = self.player;
            player.currentTime( player.currentTime() + 10 );

    },

    /**
     * Backward video
     * @return {void}
     */
    backwardVideo: function(){

        var self = this;
        var player = self.player;
            player.currentTime( player.currentTime() - 10 );

    },

    /**
     * Update playback status at Crunchyroll
     * @return {Promise}
     */
    updatePlayback: function(){

        var self = this;
        var player = self.player;

        var data = window.getSessionData();

        var elapsed = 60;
        var elapsedDelta = 60;
        var playhead = player.currentTime();

        return apiRequest('POST', '/log', {
            session_id: data.sessionId,
            locale: data.locale,
            event: 'playback_status',
            media_id: episodeId,
            playhead: playhead,
            elapsed: elapsed,
            elapsedDelta: elapsedDelta
        });
    }

});

window.addEventListener('load', function(){
    V.mount(document.body);
}, false);

window.addEventListener('keydown', function(e){
    window.handleKeyPress(e.keyCode);
    window.pushHistory(e.keyCode);
}, false);

window.addEventListener('blur', function(){
    window.handleKeyPress(keys.PAUSE);
}, false);

window.addEventListener('focus', function(){
    window.handleKeyPress(keys.PLAY);
}, false);

window.addEventListener('popstate', function(event){

    var data = event.state;

    if( data ){
        window.handleKeyPress(keys.BACK);
    } else {
        webOS.platformBack();
    }

}, false);