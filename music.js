let audioContext = null;
let masterGain = null;
let compressor = null;

let musicPlaying = false;
let musicTimer = null;

let currentMusicMood = 0;


// ==============================
// إعدادات المزاج
// ==============================

const moodSettings = [

    // 🌿 هادئ
    {
        notes: [
            261.63,
            329.63,
            392.00,
            523.25
        ],

        speed: 1800
    },


    // 🌧️ حزين
    {
        notes: [
            220.00,
            261.63,
            293.66,
            349.23
        ],

        speed: 2300
    },


    // ☀️ سعيد
    {
        notes: [
            329.63,
            392.00,
            440.00,
            523.25,
            659.25
        ],

        speed: 850
    },


    // 🌙 متوتر
    {
        notes: [
            261.63,
            293.66,
            329.63
        ],

        speed: 2600
    }

];


// ==============================
// التأكد من حالة الموسيقى
// ==============================

function isMusicPlaying() {

    return musicPlaying;

}


// ==============================
// تشغيل الموسيقى
// ==============================

function startMusic(mood = 0) {

    if (musicPlaying) {
        return;
    }


    currentMusicMood = mood;


    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;


    if (!AudioContext) {

        console.error(
            "المتصفح لا يدعم Web Audio API"
        );

        return;
    }


    audioContext =
        new AudioContext();


    compressor =
        audioContext.createDynamicsCompressor();


    compressor.threshold.value = -18;

    compressor.knee.value = 8;

    compressor.ratio.value = 6;

    compressor.attack.value = 0.003;

    compressor.release.value = 0.25;


    masterGain =
        audioContext.createGain();


    masterGain.gain.value = 0.5;


    masterGain.connect(
        compressor
    );


    compressor.connect(
        audioContext.destination
    );


    musicPlaying = true;


    if (audioContext.state === "suspended") {

        audioContext.resume();

    }


    playKalimba();

}


// ==============================
// توليد نغمة كاليمبا
// ==============================

function playKalimba() {

    if (
        !musicPlaying ||
        !audioContext ||
        !masterGain
    ) {
        return;
    }


    const settings =
        moodSettings[currentMusicMood];


    const note =
        settings.notes[
            Math.floor(
                Math.random() *
                settings.notes.length
            )
        ];


    const oscillator =
        audioContext.createOscillator();


    const gain =
        audioContext.createGain();


    oscillator.type = "sine";


    oscillator.frequency.value =
        note;


    const now =
        audioContext.currentTime;


    gain.gain.setValueAtTime(
        0.001,
        now
    );


    gain.gain.exponentialRampToValueAtTime(
        0.35,
        now + 0.015
    );


    gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 2.8
    );


    oscillator.connect(gain);

    gain.connect(masterGain);


    oscillator.start(now);


    oscillator.stop(
        now + 2.8
    );


    musicTimer =
        setTimeout(
            playKalimba,
            settings.speed
        );

}


// ==============================
// تغيير المزاج
// ==============================

function changeMood(mood) {

    currentMusicMood = mood;


    if (!musicPlaying) {
        return;
    }


    clearTimeout(musicTimer);


    playKalimba();

}


// ==============================
// إيقاف الموسيقى
// ==============================

function stopMusic() {

    musicPlaying = false;


    clearTimeout(musicTimer);

    musicTimer = null;


    if (audioContext) {

        audioContext.close();

        audioContext = null;
    }


    masterGain = null;

    compressor = null;

}