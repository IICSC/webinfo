class SystemAnalyzer {
    constructor() {
        this.memoryChart = null;
        this.screenChart = null;
        this.init();
    }

    init() {
        this.detectSystemInfo();
        this.detectPerformance();
        this.detectFeatures();
        this.detectNetwork();
        this.detectBattery();
        this.detectBrowserDetails();
        this.detectLocationAndTimezone();
        this.detectMediaDevices();
        this.detectWebGLInfo();
        this.detectScreenDetails();
        this.detectAPIs();
        this.detectUserAgent();
        this.detectSensors();
        this.detectStorageDetails();
        this.detectNetworkDetails();
        this.runPerformanceTests();
        this.initCharts();
    }

    detectSystemInfo() {
        const os = this.getOS();
        const browser = this.getBrowser();
        const resolution = `${window.screen.width} x ${window.screen.height}`;
        const language = navigator.language || navigator.userLanguage;

        document.getElementById('os').textContent = os;
        document.getElementById('browser').textContent = browser;
        document.getElementById('resolution').textContent = resolution;
        document.getElementById('language').textContent = language;
    }

    getOS() {
        const userAgent = navigator.userAgent;
        let os = 'Unknown';

        if (userAgent.indexOf('Win') !== -1) os = 'Windows';
        else if (userAgent.indexOf('Mac') !== -1) os = 'macOS';
        else if (userAgent.indexOf('Linux') !== -1) os = 'Linux';
        else if (userAgent.indexOf('Android') !== -1) os = 'Android';
        else if (userAgent.indexOf('iOS') !== -1) os = 'iOS';

        return os;
    }

    getBrowser() {
        const userAgent = navigator.userAgent;
        let browser = 'Unknown';

        if (userAgent.indexOf('Chrome') !== -1 && userAgent.indexOf('Edge') === -1) {
            browser = 'Chrome';
        } else if (userAgent.indexOf('Safari') !== -1 && userAgent.indexOf('Chrome') === -1) {
            browser = 'Safari';
        } else if (userAgent.indexOf('Firefox') !== -1) {
            browser = 'Firefox';
        } else if (userAgent.indexOf('Edge') !== -1) {
            browser = 'Edge';
        } else if (userAgent.indexOf('Opera') !== -1) {
            browser = 'Opera';
        }

        return browser;
    }

    detectPerformance() {
        const cpuCores = navigator.hardwareConcurrency || '未知';
        const memory = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : '未知';
        const network = this.getNetworkType();
        const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 ? '支持' : '不支持';

        document.getElementById('cpu-cores').textContent = cpuCores;
        document.getElementById('memory').textContent = memory;
        document.getElementById('network').textContent = network;
        document.getElementById('touch').textContent = touch;
    }

    getNetworkType() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            return connection.effectiveType || '未知';
        }
        return '未知';
    }

    detectFeatures() {
        const features = {
            webgl: this.checkWebGL(),
            webgl2: this.checkWebGL2(),
            webrtc: this.checkWebRTC(),
            localstorage: this.checkLocalStorage(),
            indexeddb: this.checkIndexedDB(),
            serviceworker: this.checkServiceWorker()
        };

        Object.keys(features).forEach(feature => {
            const element = document.getElementById(`feature-${feature}`);
            const statusElement = element.querySelector('.feature-status');
            
            if (features[feature]) {
                statusElement.textContent = '支持';
                statusElement.classList.add('supported');
            } else {
                statusElement.textContent = '不支持';
            }
        });
    }

    checkWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    checkWebGL2() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
        } catch (e) {
            return false;
        }
    }

    checkWebRTC() {
        return !!(window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);
    }

    checkLocalStorage() {
        try {
            return 'localStorage' in window && window.localStorage !== null;
        } catch (e) {
            return false;
        }
    }

    checkIndexedDB() {
        return 'indexedDB' in window;
    }

    checkServiceWorker() {
        return 'serviceWorker' in navigator;
    }

    detectNetwork() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (connection) {
            const type = connection.effectiveType || '未知';
            const speed = connection.downlink ? `${connection.downlink} Mbps` : '未知';
            const rtt = connection.rtt ? `${connection.rtt} ms` : '未知';

            document.getElementById('connection-type').textContent = type;
            document.getElementById('connection-speed').textContent = speed;
            document.getElementById('connection-rtt').textContent = rtt;
        } else {
            document.getElementById('connection-type').textContent = '不支持';
            document.getElementById('connection-speed').textContent = '-';
            document.getElementById('connection-rtt').textContent = '-';
        }
    }

    detectBattery() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                this.updateBatteryInfo(battery);
                
                battery.addEventListener('levelchange', () => this.updateBatteryInfo(battery));
                battery.addEventListener('chargingchange', () => this.updateBatteryInfo(battery));
            });
        } else {
            document.getElementById('battery-percentage').textContent = '不支持';
            document.getElementById('battery-status').textContent = '此浏览器不支持电池API';
        }
    }

    updateBatteryInfo(battery) {
        const level = Math.round(battery.level * 100);
        const charging = battery.charging;
        
        document.getElementById('battery-fill').style.width = `${level}%`;
        document.getElementById('battery-percentage').textContent = `${level}%`;
        
        let statusText = '';
        if (charging) {
            statusText = '充电中';
        } else if (level <= 20) {
            statusText = '电量低';
        } else {
            statusText = '使用电池';
        }
        
        document.getElementById('battery-status').textContent = statusText;
    }

    initCharts() {
        this.initMemoryChart();
        this.initScreenChart();
        this.initStorageChart();
        this.initPerformanceChart();
    }

    initMemoryChart() {
        const ctx = document.getElementById('memoryChart').getContext('2d');
        const deviceMemory = navigator.deviceMemory || 8;
        
        this.memoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['已使用', '可用'],
                datasets: [{
                    data: [deviceMemory * 0.6, deviceMemory * 0.4],
                    backgroundColor: [
                        'rgba(0, 240, 255, 0.8)',
                        'rgba(123, 44, 191, 0.3)'
                    ],
                    borderColor: [
                        'rgba(0, 240, 255, 1)',
                        'rgba(123, 44, 191, 0.6)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

    initScreenChart() {
        const ctx = document.getElementById('screenChart').getContext('2d');
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const screenArea = screenWidth * screenHeight;
        
        this.screenChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['宽度', '高度', '像素总数 (万)'],
                datasets: [{
                    label: '屏幕信息',
                    data: [screenWidth, screenHeight, Math.round(screenArea / 10000)],
                    backgroundColor: [
                        'rgba(0, 240, 255, 0.6)',
                        'rgba(123, 44, 191, 0.6)',
                        'rgba(255, 0, 110, 0.6)'
                    ],
                    borderColor: [
                        'rgba(0, 240, 255, 1)',
                        'rgba(123, 44, 191, 1)',
                        'rgba(255, 0, 110, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        });
    }

    detectBrowserDetails() {
        const browserVersion = this.getBrowserVersion();
        const browserEngine = this.getBrowserEngine();
        const cookieEnabled = navigator.cookieEnabled ? '启用' : '禁用';
        const doNotTrack = navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes' ? '启用' : '禁用';

        document.getElementById('browser-version').textContent = browserVersion;
        document.getElementById('browser-engine').textContent = browserEngine;
        document.getElementById('cookie-enabled').textContent = cookieEnabled;
        document.getElementById('do-not-track').textContent = doNotTrack;
    }

    getBrowserVersion() {
        const userAgent = navigator.userAgent;
        let version = '未知';

        if (userAgent.indexOf('Chrome') !== -1 && userAgent.indexOf('Edge') === -1) {
            const match = userAgent.match(/Chrome\/(\d+\.\d+\.\d+\.\d+)/);
            if (match) version = match[1];
        } else if (userAgent.indexOf('Safari') !== -1 && userAgent.indexOf('Chrome') === -1) {
            const match = userAgent.match(/Version\/(\d+\.\d+)/);
            if (match) version = match[1];
        } else if (userAgent.indexOf('Firefox') !== -1) {
            const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
            if (match) version = match[1];
        } else if (userAgent.indexOf('Edge') !== -1) {
            const match = userAgent.match(/Edge\/(\d+\.\d+\.\d+\.\d+)/);
            if (match) version = match[1];
        }

        return version;
    }

    getBrowserEngine() {
        const userAgent = navigator.userAgent;
        let engine = '未知';

        if (userAgent.indexOf('WebKit') !== -1) {
            engine = 'WebKit';
        } else if (userAgent.indexOf('Gecko') !== -1) {
            engine = 'Gecko';
        } else if (userAgent.indexOf('Trident') !== -1) {
            engine = 'Trident';
        }

        return engine;
    }

    detectLocationAndTimezone() {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const localTime = new Date().toLocaleTimeString('zh-CN');
        const utcOffset = new Date().getTimezoneOffset();
        const offsetHours = Math.abs(Math.floor(utcOffset / 60));
        const offsetMinutes = Math.abs(utcOffset % 60);
        const offsetSign = utcOffset <= 0 ? '+' : '-';
        const utcOffsetStr = `UTC${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;

        document.getElementById('timezone').textContent = timezone;
        document.getElementById('local-time').textContent = localTime;
        document.getElementById('utc-offset').textContent = utcOffsetStr;

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude.toFixed(4);
                    const lon = position.coords.longitude.toFixed(4);
                    document.getElementById('location').textContent = `${lat}, ${lon}`;
                },
                (error) => {
                    document.getElementById('location').textContent = '无法获取';
                }
            );
        } else {
            document.getElementById('location').textContent = '不支持';
        }
    }

    detectMediaDevices() {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            navigator.mediaDevices.enumerateDevices().then(devices => {
                let cameraCount = 0;
                let microphoneCount = 0;
                let speakerCount = 0;

                devices.forEach(device => {
                    if (device.kind === 'videoinput') cameraCount++;
                    else if (device.kind === 'audioinput') microphoneCount++;
                    else if (device.kind === 'audiooutput') speakerCount++;
                });

                document.getElementById('camera-count').textContent = cameraCount > 0 ? `${cameraCount} 个` : '未检测到';
                document.getElementById('microphone-count').textContent = microphoneCount > 0 ? `${microphoneCount} 个` : '未检测到';
                document.getElementById('speaker-count').textContent = speakerCount > 0 ? `${speakerCount} 个` : '未检测到';
            }).catch(() => {
                document.getElementById('camera-count').textContent = '无法访问';
                document.getElementById('microphone-count').textContent = '无法访问';
                document.getElementById('speaker-count').textContent = '无法访问';
            });
        } else {
            document.getElementById('camera-count').textContent = '不支持';
            document.getElementById('microphone-count').textContent = '不支持';
            document.getElementById('speaker-count').textContent = '不支持';
        }
    }

    detectWebGLInfo() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    const version = gl.getParameter(gl.VERSION);
                    const shadingLanguage = gl.getParameter(gl.SHADING_LANGUAGE_VERSION);

                    document.getElementById('webgl-vendor').textContent = vendor || '未知';
                    document.getElementById('webgl-renderer').textContent = renderer || '未知';
                    document.getElementById('webgl-version').textContent = version || '未知';
                    document.getElementById('webgl-shading').textContent = shadingLanguage || '未知';
                } else {
                    document.getElementById('webgl-vendor').textContent = '无法获取';
                    document.getElementById('webgl-renderer').textContent = '无法获取';
                    document.getElementById('webgl-version').textContent = gl.getParameter(gl.VERSION) || '未知';
                    document.getElementById('webgl-shading').textContent = gl.getParameter(gl.SHADING_LANGUAGE_VERSION) || '未知';
                }
            } else {
                document.getElementById('webgl-vendor').textContent = '不支持';
                document.getElementById('webgl-renderer').textContent = '不支持';
                document.getElementById('webgl-version').textContent = '不支持';
                document.getElementById('webgl-shading').textContent = '不支持';
            }
        } catch (e) {
            document.getElementById('webgl-vendor').textContent = '检测失败';
            document.getElementById('webgl-renderer').textContent = '检测失败';
            document.getElementById('webgl-version').textContent = '检测失败';
            document.getElementById('webgl-shading').textContent = '检测失败';
        }
    }

    initStorageChart() {
        const ctx = document.getElementById('storageChart').getContext('2d');
        
        if (navigator.storage && navigator.storage.estimate) {
            navigator.storage.estimate().then(estimate => {
                const used = Math.round(estimate.usage / 1024 / 1024);
                const quota = Math.round(estimate.quota / 1024 / 1024 / 1024);
                const available = quota * 1024 - used;

                this.storageChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: ['已使用 (MB)', '可用 (MB)'],
                        datasets: [{
                            data: [used, available],
                            backgroundColor: [
                                'rgba(255, 0, 110, 0.8)',
                                'rgba(0, 240, 255, 0.3)'
                            ],
                            borderColor: [
                                'rgba(255, 0, 110, 1)',
                                'rgba(0, 240, 255, 0.6)'
                            ],
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    color: '#ffffff',
                                    font: {
                                        size: 12
                                    }
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return `${context.label}: ${context.raw} MB`;
                                    }
                                }
                            }
                        }
                    }
                });
            });
        } else {
            ctx.font = '14px Arial';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText('此浏览器不支持存储API', ctx.canvas.width / 2, ctx.canvas.height / 2);
        }
    }

    initPerformanceChart() {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        
        const cpuScore = Math.min((navigator.hardwareConcurrency || 4) * 10, 100);
        const memoryScore = Math.min((navigator.deviceMemory || 4) * 12.5, 100);
        const screenScore = Math.min((window.screen.width * window.screen.height) / 20000, 100);
        const webglScore = this.checkWebGL() ? 100 : 0;
        const featuresScore = this.calculateFeaturesScore();

        this.performanceChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['CPU性能', '内存性能', '屏幕质量', '图形性能', '功能支持'],
                datasets: [{
                    label: '系统评分',
                    data: [cpuScore, memoryScore, screenScore, webglScore, featuresScore],
                    backgroundColor: 'rgba(0, 240, 255, 0.2)',
                    borderColor: 'rgba(0, 240, 255, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(0, 240, 255, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(0, 240, 255, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        angleLines: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        pointLabels: {
                            color: '#ffffff',
                            font: {
                                size: 12
                            }
                        },
                        ticks: {
                            color: '#ffffff',
                            backdropColor: 'transparent'
                        }
                    }
                }
            }
        });
    }

    calculateFeaturesScore() {
        const features = [
            this.checkWebGL(),
            this.checkWebGL2(),
            this.checkWebRTC(),
            this.checkLocalStorage(),
            this.checkIndexedDB(),
            this.checkServiceWorker()
        ];
        const supportedCount = features.filter(f => f).length;
        return (supportedCount / features.length) * 100;
    }

    detectScreenDetails() {
        const pixelRatio = window.devicePixelRatio || 1;
        const colorDepth = window.screen.colorDepth;
        const orientation = screen.orientation ? screen.orientation.type : '未知';
        const availableWidth = screen.availWidth;
        const availableHeight = screen.availHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;

        document.getElementById('pixel-ratio').textContent = `${pixelRatio}x`;
        document.getElementById('color-depth').textContent = `${colorDepth} bit`;
        document.getElementById('screen-orientation').textContent = orientation;
        document.getElementById('available-width').textContent = `${availableWidth}px`;
        document.getElementById('available-height').textContent = `${availableHeight}px`;
        document.getElementById('window-width').textContent = `${windowWidth}px`;
        document.getElementById('window-height').textContent = `${windowHeight}px`;
        document.getElementById('scroll-position').textContent = `X: ${scrollX}, Y: ${scrollY}`;
    }

    detectAPIs() {
        const apis = {
            clipboard: 'clipboard' in navigator,
            notification: 'Notification' in window,
            geolocation: 'geolocation' in navigator,
            vibration: 'vibrate' in navigator,
            bluetooth: 'bluetooth' in navigator,
            usb: 'usb' in navigator,
            nfc: 'NDEFReader' in window,
            share: 'share' in navigator,
            payment: 'PaymentRequest' in window,
            sensor: 'Sensor' in window || 'Accelerometer' in window,
            webaudio: 'AudioContext' in window || 'webkitAudioContext' in window,
            webspeech: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
        };

        Object.keys(apis).forEach(api => {
            const element = document.getElementById(`api-${api}`);
            const statusElement = element.querySelector('.api-status');
            
            if (apis[api]) {
                statusElement.textContent = '支持';
                statusElement.classList.add('supported');
            } else {
                statusElement.textContent = '不支持';
            }
        });
    }

    detectUserAgent() {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        const arch = this.detectArchitecture();
        const mobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
        const bot = /bot|crawler|spider|scraper/i.test(userAgent);

        document.getElementById('useragent-full').textContent = userAgent;
        document.getElementById('useragent-platform').textContent = platform;
        document.getElementById('useragent-arch').textContent = arch;
        document.getElementById('useragent-mobile').textContent = mobile ? '是' : '否';
        document.getElementById('useragent-bot').textContent = bot ? '是' : '否';
    }

    detectArchitecture() {
        const userAgent = navigator.userAgent;
        if (/x64|x86_64|Win64|WOW64/i.test(userAgent)) return '64-bit';
        if (/x86|i386|i686/i.test(userAgent)) return '32-bit';
        if (/arm|aarch64/i.test(userAgent)) return 'ARM';
        return '未知';
    }

    detectSensors() {
        const sensors = {
            accelerometer: 'Accelerometer' in window,
            gyroscope: 'Gyroscope' in window,
            magnetometer: 'Magnetometer' in window,
            ambient: 'AmbientLightSensor' in window
        };

        Object.keys(sensors).forEach(sensor => {
            const element = document.getElementById(`sensor-${sensor}`);
            if (sensors[sensor]) {
                element.textContent = '支持';
            } else {
                element.textContent = '不支持';
            }
        });
    }

    detectStorageDetails() {
        const localStorageSize = this.getStorageSize(localStorage);
        const sessionStorageSize = this.getStorageSize(sessionStorage);
        const indexedDBSize = this.checkIndexedDBSize();
        const cacheSize = this.checkCacheSize();

        document.getElementById('storage-local').textContent = localStorageSize;
        document.getElementById('storage-session').textContent = sessionStorageSize;
        document.getElementById('storage-indexed').textContent = indexedDBSize;
        document.getElementById('storage-cache').textContent = cacheSize;
    }

    getStorageSize(storage) {
        let total = 0;
        try {
            for (let key in storage) {
                if (storage.hasOwnProperty(key)) {
                    total += (storage[key].length + key.length) * 2;
                }
            }
            return this.formatBytes(total);
        } catch (e) {
            return '无法计算';
        }
    }

    checkIndexedDBSize() {
        if ('indexedDB' in window) {
            return '支持';
        }
        return '不支持';
    }

    checkCacheSize() {
        if ('caches' in window) {
            return '支持';
        }
        return '不支持';
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    detectNetworkDetails() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        const online = navigator.onLine ? '在线' : '离线';
        document.getElementById('network-online').textContent = online;

        if (connection) {
            const type = connection.type || connection.effectiveType || '未知';
            const saver = connection.saveData ? '开启' : '关闭';
            const rtt = connection.rtt ? `${connection.rtt} ms` : '未知';
            const downlink = connection.downlink ? `${connection.downlink} Mbps` : '未知';
            const uplink = connection.uplink ? `${connection.uplink} Mbps` : '未知';

            document.getElementById('network-type').textContent = type;
            document.getElementById('network-saver').textContent = saver;
            document.getElementById('network-rtt').textContent = rtt;
            document.getElementById('network-downlink').textContent = downlink;
            document.getElementById('network-uplink').textContent = uplink;
        } else {
            document.getElementById('network-type').textContent = '不支持';
            document.getElementById('network-saver').textContent = '-';
            document.getElementById('network-rtt').textContent = '-';
            document.getElementById('network-downlink').textContent = '-';
            document.getElementById('network-uplink').textContent = '-';
        }
    }

    runPerformanceTests() {
        setTimeout(() => {
            const jsScore = this.testJavaScriptPerformance();
            const domScore = this.testDOMPerformance();
            const canvasScore = this.testCanvasPerformance();
            const totalScore = Math.round((jsScore + domScore + canvasScore) / 3);

            document.getElementById('perf-js').textContent = `${jsScore} 分`;
            document.getElementById('perf-dom').textContent = `${domScore} 分`;
            document.getElementById('perf-canvas').textContent = `${canvasScore} 分`;
            document.getElementById('perf-total').textContent = `${totalScore} 分`;
        }, 100);
    }

    testJavaScriptPerformance() {
        const start = performance.now();
        let result = 0;
        
        for (let i = 0; i < 1000000; i++) {
            result += Math.sqrt(i);
        }
        
        const end = performance.now();
        const duration = end - start;
        
        return Math.max(0, Math.min(100, Math.round(100 - duration / 2)));
    }

    testDOMPerformance() {
        const start = performance.now();
        const container = document.createElement('div');
        
        for (let i = 0; i < 1000; i++) {
            const element = document.createElement('div');
            element.textContent = `Test ${i}`;
            container.appendChild(element);
        }
        
        const end = performance.now();
        const duration = end - start;
        
        return Math.max(0, Math.min(100, Math.round(100 - duration / 5)));
    }

    testCanvasPerformance() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 500;
        canvas.height = 500;
        
        const start = performance.now();
        
        for (let i = 0; i < 1000; i++) {
            ctx.fillStyle = `rgb(${i % 255}, ${(i * 2) % 255}, ${(i * 3) % 255})`;
            ctx.fillRect(i % 500, Math.floor(i / 500) * 5, 5, 5);
        }
        
        const end = performance.now();
        const duration = end - start;
        
        return Math.max(0, Math.min(100, Math.round(100 - duration / 3)));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SystemAnalyzer();
});
