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
let translationOffset;
updateGallerySize();
let id;
let currentProgress = 0;
let svg = document.getElementById('svg');
let path = svg.firstElementChild;
let path2 = svg.lastElementChild;
let pathLength = path.getTotalLength();
let pathOffset = path.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
const mapDots = Array.from(svg.parentElement.children)
path.style.strokeDasharray = pathLength + ' ' + pathLength;
path.style.strokeDashoffset = pathLength;

window.addEventListener('resize', () => { updateGallerySize(); });

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

hiddenElements.forEach((el) => observer.observe(el));

document.addEventListener("scroll", async () => {
    if (window.scrollY >= galleryRemoteOffset) {
        remoteObserver.observe(galleryRemoteOuter);
    }
    if (window.scrollY >= pathOffset) {
        await sleep(1000)
        path.style.strokeDashoffset = '0';
        await sleep(1200)
        path.style.opacity = '0';
        path2.style.opacity = '1';
        await sleep(1000)
        mapDots.forEach( (el) => {
            el.style.opacity = '1';
            el.style.transform = 'translate(-50%, -50%) scale(1)';
        })
    }
});



