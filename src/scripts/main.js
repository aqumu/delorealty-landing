const hiddenElements = document.querySelectorAll('.animated');
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('shown');
        }
    });

});
hiddenElements.forEach((el) => scrollObserver.observe(el));
// анимации при пролистывании


const glassyButtons = document.querySelectorAll('.glassy-button');
glassyButtons.forEach(button => {
    button.addEventListener('mousemove', (event) => {
        const centerX = button.offsetWidth / 2;
        const centerY = button.offsetHeight / 2;

        const offsetX = event.offsetX - centerX;
        const offsetY = event.offsetY - centerY;

        button.style.setProperty("--_x-motion", `${offsetX}px`);
        button.style.setProperty("--_y-motion", `${offsetY}px`);
    })
})
// красивая кнопка


const timeout = 30;
const galleryOuter = document.querySelector('.gallery-outer');
const galleryRemote = document.querySelector('.gallery-remote');
const galleryRemoteOffset = galleryOuter.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
const galleryRemoteOuter = document.querySelector('.gallery-remote-outer');
const dots = Array.from(galleryRemote.children);
const bars = [dots[0].firstElementChild, dots[1].firstElementChild, dots[2].firstElementChild];
let currentProgress = 0;
let translationOffset;

function updateGallerySize() {
    const containerWidth = document.querySelector('.myContainer').offsetWidth - 32
    const clientWidth = document.documentElement.clientWidth;
    if (clientWidth > 1440) {
        document.querySelectorAll('.gallery').forEach((el) => {
            el.style.width = containerWidth + 'px';
            el.style.marginLeft = 45 + 'px';
            el.style.marginRight = 45 + 'px';
        });
        galleryOuter.firstElementChild.style.marginLeft = (clientWidth - containerWidth) / 2 + 'px';
        galleryOuter.lastElementChild.style.marginRight = (clientWidth - containerWidth) / 2 + 'px';
        translationOffset = containerWidth + 90;
    } else if (clientWidth >= 768) {
        document.querySelectorAll('.gallery').forEach((el) => {
            el.style.width = containerWidth + 'px';
            el.style.marginLeft = (clientWidth - containerWidth) / 2 + 'px';
            el.style.marginRight = (clientWidth - containerWidth) / 2 + 'px';
        });
        translationOffset = clientWidth;
        document.getElementById("mapAnimationText").style.top = "0";
    } else {
        document.querySelectorAll('.gallery').forEach((el) => {
            el.style.width = clientWidth + 'px';
            el.style.marginLeft = '0px';
            el.style.marginRight = '0px';
        })
        translationOffset = clientWidth;
        document.getElementById("mapAnimationText").style.top = "0";
    }
    let currentDot = dots[currentProgress];
    galleryOuter.style.transform = 'translateX(' + (currentDot.dataset.id * translationOffset * -1) + 'px)'
}

window.addEventListener('resize', () => { updateGallerySize(); });

function moveProgress(Bar) {
    if (Bar.value < 100) {
        Bar.value++;
    } else if (currentProgress < 2) {
        clearInterval(id);
        id = 0;
        let currentDot = dots[currentProgress];
        bars[currentProgress].value = 0;

        currentProgress++;
        let targetDot = dots[currentProgress];
        currentDot.classList.remove('grow');

        targetDot.classList.add('grow');

        galleryOuter.style.transform = 'translateX(' + (targetDot.dataset.id * translationOffset * -1) + 'px)';
        id = setInterval(moveProgress, timeout, bars[currentProgress]);
    } else {
        clearInterval(id);
        id = 0;
        playIcon.classList.remove('block');
        pauseIcon.classList.remove('block');
        replayIcon.classList.add('block');
    }
}

const remoteObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting && pauseIcon.classList.contains('block')) {
            entry.target.classList.add('shown');
            id = setInterval(moveProgress, timeout, bars[currentProgress]);
        } else if (entry.isIntersecting) {
            entry.target.classList.add('shown');
        } else {
            clearInterval(id);
            id = 0;
        }
    });
});
let id;

galleryRemote.addEventListener('click', e => {
    const currentDot = dots[currentProgress]
    const targetDot = e.target

    if ((currentDot !== targetDot) && (e.target !== galleryRemote)) {
        clearInterval(id)
        id = 0
        currentDot.classList.remove('grow')

        bars[currentProgress].value = 0
        targetDot.classList.add('grow')

        galleryOuter.style.transform = 'translateX(' + (targetDot.dataset.id * translationOffset * -1) + 'px)'
        currentProgress = targetDot.dataset.id

        if (pauseIcon.classList.contains('block')) {
            id = setInterval(moveProgress, timeout, bars[currentProgress]);
        }
    }
});
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const replayIcon = document.querySelector('.replay-icon');

galleryRemoteOuter.lastElementChild.addEventListener('click', () => {
    if (id !== 0) {
        clearInterval(id);
        id = 0;
        pauseIcon.classList.remove('block');
        replayIcon.classList.remove('block');
        playIcon.classList.add('block');
    } else if (bars[currentProgress].value !== 100) {
        id = setInterval(moveProgress, timeout, bars[currentProgress]);
        playIcon.classList.remove('block');
        replayIcon.classList.remove('block');
        pauseIcon.classList.add('block');
    } else if (bars[2].value === 100) {
        for (let i = 0; i <= 2; i++) {
            bars[i].value = 0;
        }
        galleryOuter.style.transform = 'translateX(0)';
        dots[currentProgress].classList.remove('grow');
        currentProgress = 0;
        dots[currentProgress].classList.add('grow');
        id = setInterval(moveProgress, timeout, bars[currentProgress]);

        playIcon.classList.remove('block');
        replayIcon.classList.remove('block');
        pauseIcon.classList.add('block');
    }
});
document.addEventListener("scroll", () => {
    if (window.scrollY >= galleryRemoteOffset) {
        remoteObserver.observe(galleryRemoteOuter);
    }
});
// галерея и управление ей


const muteButton = document.getElementById('muteButton');
function toggleMute() {
    const button = muteButton;
    const video = document.getElementById('animation');
    const volumeX = button.querySelector('.feather-volume-x');
    const volume2 = button.querySelector('.feather-volume-2');

    if (video.muted) {
        video.muted = false;
        volumeX.classList.add('hidden');
        volume2.classList.remove('hidden');
    } else {
        video.muted = true;
        volumeX.classList.remove('hidden');
        volume2.classList.add('hidden');
    }
}
muteButton.addEventListener('click', toggleMute);

function videoEnded() {
    const overlay = document.getElementById('videoOverlay');
    const restartButton = document.getElementById('restartButton');

    // Dim the video
    overlay.classList.remove('bg-opacity-0');
    overlay.classList.add('bg-opacity-40');

    // Show restart button
    restartButton.classList.remove('hidden');
}

const animation = document.getElementById("animation");
animation.addEventListener('ended', videoEnded);
animation.volume = 0.4;

const restartButton = document.getElementById('restartButton');
function restartVideo() {
    const button = restartButton;
    const video = document.getElementById('animation');
    const overlay = document.getElementById('videoOverlay');

    // Reset video
    video.currentTime = 0;
    video.play();

    // Remove dim effect
    overlay.classList.remove('bg-opacity-40');
    overlay.classList.add('bg-opacity-0');

    // Hide restart button
    button.classList.add('hidden');
}
document.getElementById("restartButton").addEventListener('click', restartVideo);


function trackVideoBuffer(video, onUpdate) {
    let lastBufferedEnd = 0;

    const updateBufferInfo = () => {
        if (!video.duration || isNaN(video.duration)) return;

        const buffered = video.buffered;
        let totalBuffered = 0;
        let latestBufferedEnd = 0;

        for (let i = 0; i < buffered.length; i++) {
            const start = buffered.start(i);
            const end = buffered.end(i);
            totalBuffered += end - start;
            if (end > latestBufferedEnd) {
                latestBufferedEnd = end;
            }
        }

        const percent = (totalBuffered / video.duration) * 100;

        if (latestBufferedEnd > lastBufferedEnd) {
            lastBufferedEnd = latestBufferedEnd;
            if (typeof onUpdate === "function") {
                onUpdate(percent, totalBuffered, video.duration);
            }
        }

        if (latestBufferedEnd >= video.duration) {
            clearInterval(interval);
        }
    };

    const interval = setInterval(updateBufferInfo, 500);
}

const circle = document.getElementById("buffer-circle");
const wrapper = document.getElementById("buffer-wrapper");

const radius = 40;
const circumference = 2 * Math.PI * radius;
const minVisiblePercent = 2; // always show at least 2% of the arc

trackVideoBuffer(animation, (percent) => {
    const clampedPercent = Math.max(percent, minVisiblePercent);
    circle.style.strokeDashoffset = circumference - (clampedPercent / 100) * circumference;

    if (percent >= 99) {
        wrapper.classList.add("!opacity-0");
    } else {
        wrapper.classList.remove("!opacity-0");
    }
});
// все для большой анимации


function loadAndPlayVideo(video) {
    video.load();

    // Once it's ready, autoplay
    video.oncanplay = () => {
        video.play();
        if (document.documentElement.clientWidth < 768 && video.id === 'mapAnimation') {
            document.getElementById('mapAnimationText').style.top = "15lvh";
        }
    };
    video.classList.remove("lazy-video");
}

document.addEventListener("DOMContentLoaded", function () {
    updateGallerySize();
    const lazyVideos = document.querySelectorAll("video.lazy-video");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadAndPlayVideo(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.8 // play only when 80% visible
    });

    lazyVideos.forEach(video => observer.observe(video));
});
// анимация карты