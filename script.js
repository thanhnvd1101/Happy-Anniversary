// ── SECRET CODE ──
const SECRET = '2406';

function checkCode() {
  const val = document.getElementById('code-input').value.trim().toLowerCase();
  if (val === SECRET) {
    const ls = document.getElementById('lock-screen');
    ls.style.transition = 'opacity 0.8s';
    ls.style.opacity = '0';
    setTimeout(() => {
      ls.style.display = 'none';
      showWelcome();
    }, 800);
  } else {
    const input = document.getElementById('code-input');
    input.classList.add('shake');
    input.value = '';
    setTimeout(() => input.classList.remove('shake'), 400);
  }
}

document.getElementById('code-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') checkCode();
});

// ── WELCOME ──
function showWelcome() {
  const ws = document.getElementById('welcome-screen');
  ws.style.display = 'flex';
  document.getElementById('welcome-text').style.animation = 'fadeInUp 1s ease forwards';
  spawnHearts();
  setTimeout(() => {
    ws.style.transition = 'opacity 1s';
    ws.style.opacity = '0';
    setTimeout(() => {
      ws.style.display = 'none';
      document.getElementById('app').style.display = 'flex';
      document.getElementById('music-player').style.display = 'block';
      // Tự phát bài đầu tiên
      const firstSong = document.querySelector('.playlist-item');
      if (firstSong) {
        const name = firstSong.querySelector('span').textContent;
        const artist = firstSong.querySelector('small').textContent;
        selectSong(firstSong, name, artist);
      }
    }, 1000);
  }, 2800);
}

// ── TABS ──
function showTab(name, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  btn.classList.add('active');
}

// ── LETTER ──
let letterOpen = false;
function toggleLetter() {
  const content = document.getElementById('letter-content');
  const btn = document.getElementById('envelope-btn');
  if (!letterOpen) {
    content.style.display = 'block';
    content.style.animation = 'fadeIn 0.6s ease';
    btn.textContent = '💌 Close';
    letterOpen = true;
  } else {
    content.style.display = 'none';
    btn.textContent = '💌 Click to open';
    letterOpen = false;
  }
}

// ── LIGHTBOX ẢNH ──
function openLightbox(src) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox').style.display = 'flex';
}
function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
}

// ── LIGHTBOX VIDEO ──
function openVideoLightbox(src) {
  const lb = document.getElementById('video-lightbox');
  const vid = document.getElementById('lightbox-video');
  vid.src = src;
  lb.style.display = 'flex';
  vid.play().catch(() => {});
}
function closeVideoLightbox() {
  const lb = document.getElementById('video-lightbox');
  const vid = document.getElementById('lightbox-video');
  vid.pause();
  vid.src = '';
  lb.style.display = 'none';
}
document.getElementById('video-lightbox').addEventListener('click', function(e) {
  if (e.target === this) closeVideoLightbox();
});

// ── GALLERY ẢNH ──
const TOTAL_PHOTOS = 35;
const photoGrid = document.getElementById('gallery-picture');
for (let i = 1; i <= TOTAL_PHOTOS; i++) {
  const div = document.createElement('div');
  div.className = 'gallery-item';
  div.innerHTML = `<img src="media/${i}.jpg" alt="${i}" loading="lazy">`;
  div.onclick = (function(idx) {
    return function() { openLightbox(`media/${idx}.jpg`); };
  })(i);
  photoGrid.appendChild(div);
}

// ── GALLERY VIDEO ──
const TOTAL_VIDEOS = 3;
const videoList = document.getElementById('gallery-video');
for (let i = 1; i <= TOTAL_VIDEOS; i++) {
  const src = `media/video${i}.mp4`;
  const div = document.createElement('div');
  div.className = 'video-item';
  div.innerHTML = `
    <video class="video-thumb-video" src="${src}#t=0.5" preload="metadata" muted playsinline></video>
    <div class="video-play-overlay">
      <div class="video-play-btn">▶</div>
      <span class="video-label">Video ${i}</span>
    </div>
  `;
  const vid = div.querySelector('video');
  vid.addEventListener('loadedmetadata', () => { vid.currentTime = 0.5; });
  div.onclick = (function(s) {
    return function() { openVideoLightbox(s); };
  })(src);
  videoList.appendChild(div);
}

// ── CHỌN SỐ CỘT ──
function setGrid(cols) {
  document.getElementById('gallery-picture').className = `gallery-picture grid-${cols}`;
  document.querySelectorAll('.grid-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i + 1 === cols);
  });
}

// ── MUSIC PLAYER (dùng iframe embed thay vì IFrame API) ──
const PLAYLIST = [
  { file: 'media/NightCity.mp3', name: 'Night City', artist: 'Obito (ft. Vstra)' },
  { file: 'media/Baby.mp3', name: 'Baby', artist: 'MCK (ft. Marzuz)' },
  { file: 'media/NgoaiLeCuaNhau.mp3', name: 'Ngoại lệ của nhau', artist: 'Obito' },
  { file: 'media/DoiMatKeTinhSi.mp3', name: 'Đôi mắt kẻ tình si', artist: 'Grey D (ft. Min)' },
  { file: 'media/NoiNayCoAnh.mp3', name: 'Nơi này có anh', artist: 'Sơn Tùng M-TP' },
];

const audio = new Audio();
audio.loop = true;
let currentIdx = -1;
let isPlaying = false;

// Build playlist UI
const playlistEl = document.getElementById('playlist');
// Xoá các playlist-item cũ trong HTML (nếu có)
playlistEl.querySelectorAll('.playlist-item').forEach(el => el.remove());

PLAYLIST.forEach((song, idx) => {
  const div = document.createElement('div');
  div.className = 'playlist-item';
  div.innerHTML = `<span>${song.name}</span><small>${song.artist}</small>`;
  div.onclick = () => selectSong(idx);
  playlistEl.appendChild(div);
});

function selectSong(idx) {
  currentIdx = idx;
  const song = PLAYLIST[idx];

  audio.src = song.file;
  audio.load();
  audio.play().catch(() => {});

  document.getElementById('music-song-name').textContent = song.name;
  document.getElementById('music-song-artist').textContent = song.artist;

  document.querySelectorAll('.playlist-item').forEach((el, i) => {
    el.classList.toggle('active', i === idx);
  });

  isPlaying = true;
  updateToggleBtn();
  togglePlaylist(false);
}

function toggleMusic() {
  if (currentIdx === -1) {
    // Chưa chọn bài → mở playlist
    togglePlaylist(true);
    return;
  }
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  } else {
    audio.play().catch(() => {});
    isPlaying = true;
  }
  updateToggleBtn();
}

function updateToggleBtn() {
  const btn = document.getElementById('music-toggle');
  if (isPlaying) {
    btn.textContent = '⏸';
    btn.classList.add('playing');
  } else {
    btn.textContent = '▶';
    btn.classList.remove('playing');
  }
}

audio.addEventListener('ended', () => {
  // Chuyển bài tiếp theo
  const next = (currentIdx + 1) % PLAYLIST.length;
  selectSong(next);
});
 
let playlistOpen = false;
function togglePlaylist(force) {
  const pl = document.getElementById('playlist');
  if (force !== undefined) playlistOpen = !force;
  if (!playlistOpen) {
    pl.classList.remove('hidden');
    playlistOpen = true;
  } else {
    pl.classList.add('hidden');
    playlistOpen = false;
  }
}

// ── FLOATING HEARTS ──
function spawnHearts() {
  const container = document.getElementById('hearts-bg');
  const emojis = ['❤️','💕','💗','💓','🌸','💝','💖'];
  let count = 0;
  const interval = setInterval(() => {
    const h = document.createElement('span');
    h.className = 'heart-float';
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    h.style.left = Math.random() * 100 + 'vw';
    h.style.fontSize = (0.9 + Math.random() * 1.2) + 'rem';
    const dur = 5 + Math.random() * 6;
    h.style.animationDuration = dur + 's';
    h.style.animationDelay = Math.random() * 2 + 's';
    container.appendChild(h);
    setTimeout(() => h.remove(), (dur + 2) * 1000);
    if (++count > 40) clearInterval(interval);
  }, 180);
}

setInterval(() => {
  if (document.getElementById('app').style.display !== 'none') {
    const container = document.getElementById('hearts-bg');
    const emojis = ['❤️','💕','🌸','💗'];
    const h = document.createElement('span');
    h.className = 'heart-float';
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    h.style.left = Math.random() * 100 + 'vw';
    h.style.fontSize = (0.8 + Math.random() * 0.8) + 'rem';
    const dur = 7 + Math.random() * 6;
    h.style.animationDuration = dur + 's';
    container.appendChild(h);
    setTimeout(() => h.remove(), dur * 1000 + 2000);
  }
}, 1500);