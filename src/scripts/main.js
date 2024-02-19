const hiddenElements = document.querySelectorAll('.notshown');
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
let id;
let currentProgress = 0;
const mapOuter = document.getElementById('map-outer');
const map = document.getElementById('map');



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

        galleryOuter.style.transform = 'translateX(' + targetDot.dataset.id * -33.3333 + '%)';

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
    // currentProgress = document.querySelector('.grow').dataset.id; ?????
    const currentDot = dots[currentProgress]
    const targetDot = e.target

    if ((currentDot !== targetDot) && (e.target !== galleryRemote)) {
        clearInterval(id)
        id = 0
        currentDot.classList.remove('grow')

        bars[currentProgress].value = 0
        targetDot.classList.add('grow')

        galleryOuter.style.transform = 'translateX(' + targetDot.dataset.id * -33.3333 + '%)'
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
        galleryOuter.style.transform = 'translateX(0%)';
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
document.addEventListener("scroll", () => {
    if (window.scrollY >= galleryRemoteOffset) {
        remoteObserver.observe(galleryRemoteOuter);
    }
});

mapOuter.onmouseover = function() {transform()}
mapOuter.onmouseleave = function() {untransform()}

function transform() {
    map.classList.add('transformed');
}

function untransform() {
    map.classList.remove('transformed');
}

