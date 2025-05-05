const hiddenElements = document.querySelectorAll('.notshown');
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('shown');
        }
    });
});
hiddenElements.forEach((el) => observer.observe(el));
// анимация появления при загрузке сайта и первом пролистывании

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
updateGallerySize();
// галерея и управление ей


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

window.addEventListener('resize', () => {
    updateGallerySize();
    mapOffset = mapAnimation.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
    animationOffset = animation.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
});





function playVideo(videoElem) {
    try {
        videoElem.play();
    } catch (error) {
        console.error("Error playing video:", error);
    }
}


const animation = document.querySelector('.animation')
const mapAnimation = document.querySelector('.map-animation')
let animationOffset = animation.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
let isAnimationPlayed = false;
let isMapAnimationPlayed = false;
let mapOffset = mapAnimation.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
document.addEventListener("scroll", () => {
    if (window.scrollY >= galleryRemoteOffset) {
        remoteObserver.observe(galleryRemoteOuter);
    }

    if (window.scrollY >= animationOffset && !isAnimationPlayed) {
        isAnimationPlayed = true;
        playVideo(animation);
    }

    if (window.scrollY >= mapOffset && !isMapAnimationPlayed) {
        isMapAnimationPlayed = true;
        setTimeout(async () => {
            await playVideo(mapAnimation); // Воспроизводим видео mapAnimation
            // Не сбрасываем isMapAnimationPlayed, чтобы видео не повторялось
        }, 500);
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


