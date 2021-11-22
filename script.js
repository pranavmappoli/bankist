'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////Smooth scroll Navigation
const navLinks = document.querySelector('.nav__links');

navLinks.addEventListener('click', function (e) {
  const sectionID = e.target.getAttribute('href');
  if (sectionID.includes('#section')) {
    e.preventDefault();
    const crntElem = document.querySelector(sectionID);
    if (!crntElem) return;
    crntElem.scrollIntoView({ behavior: 'smooth' });
  }
});

//////////////however Effect Navigation

const nav = document.querySelector('.nav');

const hoverEffectHandler = function (e) {
  const allNavElem = nav.querySelectorAll('.nav__item');
  const crntpointing = e.target.closest('.nav__item');
  allNavElem.forEach(elem => {
    if (elem != crntpointing) {
      elem.style.opacity = this;
    }
  });
};

navLinks.addEventListener('mouseover', hoverEffectHandler.bind(0.5));
navLinks.addEventListener('mouseout', hoverEffectHandler.bind(1));

////////// Learn More

const LearnMorebtn = document.querySelector('.btn--scroll-to');

const section1 = document.getElementById('section--1');
LearnMorebtn.addEventListener('click', e => {
  section1.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

///////////////////Operations ---Tab effects

const tabsContainer = document.querySelector('.operations__tab-container');
const containerContents = document.querySelectorAll('.operations__content');
const allTabs = tabsContainer.querySelectorAll('.operations__tab ');
tabsContainer.addEventListener('click', e => {
  const crntTab = e.target.closest('.operations__tab');
  if (!crntTab) return;
  allTabs.forEach(tab => {
    tab.classList.remove('operations__tab--active');
  });
  e.target.closest('.operations__tab').classList.add('operations__tab--active');

  //Activate content
  const crntTabID = e.target.closest('.operations__tab').dataset.tab;
  containerContents.forEach(elem => {
    elem.classList.remove('operations__content--active');
  });
  document
    .querySelector(`.operations__content--${crntTabID}`)
    .classList.add('operations__content--active');
});

////////Sticky Nav bar
const header = document.querySelector('.header');
const stickHeight = nav.getBoundingClientRect().height;
const observerFun = entries => {
  const [entry] = entries;
  nav.classList.remove('sticky');
  if (entry.isIntersecting) return;
  nav.classList.add('sticky');
};
const options = {
  root: null,
  threshold: 0.1,
  // rootMargin: `${stickHeight}px`,
};
const navObserver = new IntersectionObserver(observerFun, options);
navObserver.observe(header);

//////////sections on scrolling

const allSections = document.querySelectorAll('.section');

const sectionObserverHelper = entries => {
  const [entry] = entries;
  if (!entry.target.id || !entry.isIntersecting) return;
  document
    .querySelector(`#${entry.target.id}`)
    .classList.remove('section--hidden');
  sectionObserver.unobserve(entry.target);
};

const secoptions = {
  root: null,
  threshold: 0.15,
  rootMargin: '-50px',
};

const sectionObserver = new IntersectionObserver(
  sectionObserverHelper,
  secoptions
);

allSections.forEach(sec => {
  sectionObserver.observe(sec);
  sec.classList.add('section--hidden');
});

///////// Lazy Loading!!!!!!!

const lazyImgs = document.querySelectorAll('img[data-src]');

const lazyOptions = {
  root: null,
  threshold: 0.1,
};
const lazyHelper = entries => {
  const [entry] = entries;
  if (!entry || !entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
    lazyImgObserver.unobserve(entry.target);
  });
};

var lazyImgObserver = new IntersectionObserver(lazyHelper, lazyOptions);
lazyImgs.forEach(lazy => {
  lazyImgObserver.observe(lazy);
});

////////////////////////Slider

const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const dotContainer = document.querySelector('.dots');

const rightButton = document.querySelector('.slider__btn--right');
const leftButton = document.querySelector('.slider__btn--left');
const allDots = document.querySelectorAll('.dots__dot');

let crntIndx = 0;
const slidesLength = slides.length;
const sliding = () => {
  slides.forEach((slide, indx) => {
    slide.style.transform = `translateX(${100 * (indx - crntIndx)}%)`;
  });
};

const activateDot = function (indx) {
  allDots.forEach(dot => {
    dot.classList.remove('dots__dot--active');
  });
  document
    .querySelector(`.dots__dot[data-slide="${indx}"]`)
    .classList.add('dots__dot--active');
};
const createDots = () => {
  slides.forEach((_, indx) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide=${indx}></button>`
    );
  });
};
//initialize and transform all elements
sliding();
createDots();
activateDot(crntIndx);

const prevSlide = () => {
  crntIndx =
    crntIndx - 1 < 0 ? slidesLength - 1 : (crntIndx - 1) % slidesLength;
  sliding();
  activateDot(crntIndx);
};
const nextSlide = () => {
  crntIndx = (crntIndx + 1) % slidesLength;
  sliding();
  activateDot(crntIndx);
};
rightButton.addEventListener('click', nextSlide);
leftButton.addEventListener('click', prevSlide);

//keyboard
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') prevSlide();
  else if (e.key === 'ArrowRight') nextSlide();
});

//dots

allDots.forEach(dot => {
  dot.addEventListener('click', e => {
    crntIndx = dot.dataset.slide;
    sliding();
    activateDot(crntIndx);
  });
});

// slider.style.overflow = 'visible';
slider.style.transform = 'scale(0.8)';
