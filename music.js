let audioContext = null;
let masterGain = null;
let compressor = null;

let musicPlaying = false;
let musicTimer = null;

let currentMood = 0;


// إعدادات المزاج الأربعة
const moodSettings = [

  // 🌿 هادئ
  {
    notes: [261.63, 329.63, 392.00, 523.25],
    speed: 1800
  },

  // 🌧️ حزين
  {
    notes: [220.00, 261.63, 293.66, 349.23],
    speed: 2300
  },

  // ☀️ سعيد
  {
    notes: [329.63, 392.00, 440.00, 523.25, 659.25],
    speed: 850
  },

  // 🌙 متوتر
  {
    notes: [261.63, 293.66, 329.63],
    speed: 2600
  }

];


// تشغيل الموسيقى
function startMusic(mood = 0) {

  if (musicPlaying) return;

  currentMood = mood;

  audioContext =
    new (window.AudioContext ||
      window.webkitAudioContext)();


  // معالجة الصوت
  compressor =
    audioContext.createDynamicsCompressor();

  compressor.threshold.value = -18;
  compressor.knee.value = 8;
  compressor.ratio.value = 6;
  compressor.attack.value = 0.003;
  compressor.release.value = 0.25;


  // مستوى الصوت الرئيسي
  masterGain =
    audioContext.createGain();

  masterGain.gain.value = 0.5;


  masterGain.connect(compressor);

  compressor.connect(
    audioContext.destination
  );


  // بعض المتصفحات توقف الصوت تلقائيًا
  // حتى يحصل تفاعل من المستخدم
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }


  musicPlaying = true;

  playKalimba();

}


// توليد نغمة كاليمبا
function playKalimba() {

  if (!musicPlaying || !audioContext) {
    return;
  }


  const settings =
    moodSettings[currentMood];


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


  // شكل الموجة
  oscillator.type = "sine";

  oscillator.frequency.value =
    note;


  const now =
    audioContext.currentTime;


  // بداية النغمة
  gain.gain.setValueAtTime(
    0.001,
    now
  );


  gain.gain.exponentialRampToValueAtTime(
    0.35,
    now + 0.015
  );


  // رنين الكاليمبا
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


// تغيير المزاج
function changeMood(mood) {

  currentMood = mood;


  if (musicPlaying) {

    clearTimeout(musicTimer);

    playKalimba();

  }

}


// إيقاف الموسيقى
function stopMusic() {

  musicPlaying = false;


  clearTimeout(musicTimer);

  musicTimer = null;


  if (audioContext) {

    audioContext.close();

    audioContext = null;

  }

}