const hiddenElements = document.querySelectorAll('.notshown');
const glassyButtons = document.querySelectorAll('.glassy-button');
const galleryOuter = document.querySelector('.gallery-outer');
const galleryRemote = document.querySelector('.gallery-remote');
const galleryRemoteOuter = document.querySelector('.gallery-remote-outer');
const dots = Array.from(galleryRemote.children);
const bars = [dots[0].firstElementChild, dots[1].firstElementChild, dots[2].firstElementChild];
const timeout = 30;
const galleryRemoteOffset = galleryOuter.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const replayIcon = document.querySelector('.replay-icon');
const map = document.querySelector('.map-animation  ')
const animation = document.querySelector('.animation')
const mapAnimation = document.querySelector('.map-animation')
let mapOffset = map.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
let animationOffset = animation.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
let translationOffset;
let currentProgress = 0;
let id;
updateGallerySize();

window.addEventListener('resize', () => {
    updateGallerySize();
    mapOffset = map.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
    animationOffset = animation.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
});

function updateGallerySize () {
    const containerWidth = document.querySelector('.container').offsetWidth - 32
    if (document.documentElement.clientWidth > 1440) {
        document.querySelectorAll('.gallery').forEach((el) => {
            el.style.width = containerWidth + 'px';
            el.style.marginLeft = 45 + 'px';
            el.style.marginRight = 45 + 'px';
        });
        galleryOuter.firstElementChild.style.marginLeft = (document.documentElement.clientWidth - containerWidth)/2 + 'px';
        galleryOuter.lastElementChild.style.marginRight = (document.documentElement.clientWidth - containerWidth)/2 + 'px';
        translationOffset = containerWidth + 90;
    } else if (document.documentElement.clientWidth >= 768) {
        document.querySelectorAll('.gallery').forEach((el) => {
            el.style.width = containerWidth + 'px';
            el.style.marginLeft = (document.documentElement.clientWidth - containerWidth)/2 + 'px';
            el.style.marginRight = (document.documentElement.clientWidth - containerWidth)/2 + 'px';
        });
        translationOffset = document.documentElement.clientWidth;
    } else {
        document.querySelectorAll('.gallery').forEach((el) => {
            el.style.width = document.documentElement.clientWidth + 'px';
            el.style.marginLeft = '0px';
            el.style.marginRight = '0px';
        })
        translationOffset = document.documentElement.clientWidth;
    }
    let currentDot = dots[currentProgress];
    galleryOuter.style.transform = 'translateX(' + (currentDot.dataset.id * translationOffset * -1) + 'px)'
}

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

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('shown');
        }
    });
});

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



hiddenElements.forEach((el) => observer.observe(el));

async function playVideo(videoElem) {
    try {
        await videoElem.play();
    } catch (error) {
        console.error("Error playing video:", error);
    }
}

let isAnimationPlaying = false;
let isMapAnimationPlaying = false;
document.addEventListener("scroll", () => {
    if (window.scrollY >= galleryRemoteOffset) {
        remoteObserver.observe(galleryRemoteOuter);
    }

    if (window.scrollY >= animationOffset && !isAnimationPlaying) {
        isAnimationPlaying = true;
        playVideo(animation).then(() => {
            setTimeout(async () => {
                await playVideo(animation);
                isAnimationPlaying = false;
            }, 1000);
        });
    }

    if (window.scrollY >= mapOffset && !isMapAnimationPlaying) {
        isMapAnimationPlaying = true;
        setTimeout(async () => {
            await playVideo(mapAnimation); // Воспроизводим видео mapAnimation
            // Не сбрасываем isMapAnimationPlaying, чтобы видео не повторялось
        }, 1000);
    }
});


function toggleMute(button) {
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

function videoEnded(video) {
    const overlay = document.getElementById('videoOverlay');
    const restartButton = document.getElementById('restartButton');

    // Dim the video
    overlay.classList.remove('bg-opacity-0');
    overlay.classList.add('bg-opacity-40');

    // Show restart button
    restartButton.classList.remove('hidden');
}

function restartVideo(button) {
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


