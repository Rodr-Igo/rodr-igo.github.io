/*--------------------
State
--------------------*/
let progress = 0;
let startX = 0;
let active = 0;
let isDown = false;

/*--------------------
Constants
--------------------*/
const speedWheel = 0.02;
const speedDrag  = -0.1;

/*--------------------
Utils
--------------------*/
const getZindex = (array, index) =>
  array.map((_, i) => (index === i) ? array.length : array.length - Math.abs(index - i));

/*--------------------
Elements
--------------------*/
const $items   = document.querySelectorAll('.carousel-item');
const $cursors = document.querySelectorAll('.cursor');

/*--------------------
Render
--------------------*/
const displayItems = (item, index, activeIdx) => {
  const zIndex = getZindex([...$items], activeIdx)[index];
  item.style.setProperty('--zIndex', zIndex);
  item.style.setProperty('--active', (index - activeIdx) / $items.length);
};

const animate = () => {
  progress = Math.max(0, Math.min(progress, 100));
  active   = Math.floor(progress / 100 * ($items.length - 1));
  $items.forEach((item, index) => displayItems(item, index, active));
};
animate();

/*--------------------
Click (snap)
--------------------*/
$items.forEach((item, i) => {
  item.addEventListener('click', () => {
    progress = (i / $items.length) * 100 + 10;
    animate();
  }, { passive: true });
});

/*--------------------
Events
--------------------*/
const handleWheel = (e) => {
  const wheelProgress = (e.deltaY || 0) * speedWheel;
  progress = progress + wheelProgress;
  animate();
};

const handleMouseMove = (e) => {
  const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  const y = e.clientY || (e.touches && e.touches[0].clientY) || 0;

  if (e.type === 'mousemove') {
    $cursors.forEach(($c) => {
      $c.style.transform = `translate(${x}px, ${y}px)`;
    });
  }
  if (!isDown) return;
  const mouseProgress = (x - startX) * speedDrag;
  progress += mouseProgress;
  startX = x;
  animate();
};

const handleMouseDown = (e) => {
  isDown = true;
  startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
};

const handleMouseUp = () => { isDown = false; };

/*--------------------
Listeners
--------------------*/
document.addEventListener('wheel',      handleWheel,   { passive: true });
document.addEventListener('mousedown',  handleMouseDown);
document.addEventListener('mousemove',  handleMouseMove);
document.addEventListener('mouseup',    handleMouseUp);
document.addEventListener('touchstart', handleMouseDown, { passive: true });
document.addEventListener('touchmove',  handleMouseMove, { passive: true });
document.addEventListener('touchend',   handleMouseUp,   { passive: true });
