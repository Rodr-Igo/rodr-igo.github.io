// ========= DATOS =========
// Añadí el bloque "track" a cada carta. Rellena url y cover con tus datos reales de Spotify.
const letters = [
  {
    id:1,
    title:'For Being With Me',
    type:'Dia 1',
    text:`Even in a crowded room, my eyes always search for you — like it’s the only thing they know.

Thank you for sitting beside me through quiet and loud. You make my world gentle and bright.`,
    track: {
      title: 'El Dueño De Tu Amor — DannyLux',
      url: 'https://open.spotify.com/track/3CJaDcjZKse7X7eVUukQJB?si=071da5c3a63b4ba0',
      cover: 'https://i.scdn.co/image/ab67616d0000b27349f4f85b9c86c1b443415239'
    }
  },
  {
    id:2,
    title:'Sorry & Thankful',
    type:'Dia 2',
    text:`I am sorry for the times I faltered and for the words I didn't say.

Thank you for forgiving me with a smile that feels like home. You taught my heart patience.`,
    track: {
      title: 'Song B — Artist',
      url: 'https://open.spotify.com/track/yyyyyyyyyyyyyyyyyyyyyy',
      cover: 'https://i.scdn.co/image/ab67616d0000b273yyyyyyyyyyyyyyyyyyyyyy'
    }
  },
  {
    id:3,
    title:'You are Sunshine',
    type:'Dia 3',
    text:`I’ve met a thousand people, but only your presence feels like sunlight on my skin.

Your laugh, your silence, your little gestures — everything about you feels like a soft sunrise.`,
    track: {
      title: 'Song C — Artist',
      url: 'https://open.spotify.com/track/zzzzzzzzzzzzzzzzzzzzzz',
      cover: 'https://i.scdn.co/image/ab67616d0000b273zzzzzzzzzzzzzzzzzzzzzz'
    }
  },
  {
    id:4,
    title:'If You Remember',
    type:'Dia 4',
    text:`Even if the whole world forgets my name, I’d still be complete as long as you remember me.

You are my favorite hello and the calm at the end of my day.`,
    track: {
      title: 'Song D — Artist',
      url: 'https://open.spotify.com/track/wwwwwwwwwwwwwwwwwwwwww',
      cover: 'https://i.scdn.co/image/ab67616d0000b273wwwwwwwwwwwwwwwwwwwwww'
    }
  }
];

const special = {
  id:5,
  title:'Big Letter — For Jennie',
  type:'Dia 5',
  text:`My dearest Jennie,

This one is the one I kept for when I understood how to say every little thing my heart means. You have been my quiet miracle — the gentle that untangles my loudest fears. When life felt too heavy, your presence offered a soft place to breathe. When I lost words, your eyes taught me new ones.

Thank you for being patient, for laughing at my terrible jokes, for the way you hold space for my dreams, and for simply being you — brave, kind, and endlessly luminous. If life lets me be anything, let me be someone who cherishes you as you deserve.

Yours, always.`,
  // Si quieres que la "Secret" también tenga canción:
  track: {
    title: 'Secret Track — Artist',
    url: 'https://open.spotify.com/track/secrettrackid',
    cover: 'https://i.scdn.co/image/ab67616d0000b273secretcoverid'
  }
};

// ========= ESTADO / STORAGE =========
const STORAGE_KEY = 'liz_opened_letters';
let opened = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

// ========= REFERENCIAS AL DOM (algunas quedan por compatibilidad) =========
const grid     = document.getElementById('grid');
const reader   = document.getElementById('reader');   // ya no lo usamos, pero lo conservamos
const rTitle   = document.getElementById('r-title');  // idem
const rSub     = document.getElementById('r-sub');    // idem
const rContent = document.getElementById('r-content');// idem
const rBack    = document.getElementById('r-back');   // idem
const rCopy    = document.getElementById('r-copy');   // idem

// ========= RENDER =========
function buildGrid(){
  grid.innerHTML = '';
  letters.forEach((L,i)=> grid.appendChild(letterCard(L, i+1)));
  const unlocked = openedUniqueCount() >= 4;
  grid.appendChild(specialEnvelope(unlocked));
}

// Cada carta ahora es un <a> con portada y título que abre Spotify en nueva pestaña.
// ¡Seguimos marcando "opened" para que Secret se desbloquee tras 4 clics!
function letterCard(L, idx){
  const wrap = document.createElement('div');
  wrap.style.textAlign = 'center';

  const env = document.createElement('div');
  env.className = 'env bob';
  env.setAttribute('role','button');
  env.setAttribute('aria-label', L.title);  // <— (A) usa atributo real
  env.dataset.id = String(L.id);            // <— (B) id para la delegación

  const flap = document.createElement('div'); flap.className = 'flap';
  const body = document.createElement('div'); body.className = 'body';
  const seal = document.createElement('div'); seal.className = 'seal'; seal.textContent = '❤';
  env.append(flap, body, seal);

  const label = document.createElement('div'); label.className = 'label'; label.textContent = `Carta ${idx}`;
  const typ   = document.createElement('div'); typ.className = 'type';   typ.textContent   = L.type;

  // ❌ Ya NO pongas env.addEventListener('click', ...) aquí
  env.ontouchstart = ()=> env.classList.add('touched');
  env.ontouchend   = ()=> env.classList.remove('touched');

  const trackBlock = makeTrackLink(L);      // tu bloque de Spotify

  wrap.append(env, label, typ, trackBlock);
  return wrap;
}

// Cualquier click que ocurra sobre un .env abre su carta
grid.addEventListener('click', (e) => {
  // Si fue en un enlace (Spotify), no abrir carta
  if (e.target.closest('a')) return;

  const env = e.target.closest('.env');
  if (!env) return;

  const id = Number(env.dataset.id);
  const L = letters.find(x => x.id === id);
  if (L) openLetter(L);
});

// "Secret": bloqueada hasta abrir 4. Si está desbloqueada, también redirige a Spotify
function specialEnvelope(unlocked){
  const wrap = document.createElement('div');
  wrap.style.textAlign = 'center';

  const env = document.createElement('div');
  env.className = 'env bob' + (unlocked ? '' : ' locked');

  const flap = document.createElement('div'); flap.className = 'flap';
  const body = document.createElement('div'); body.className = 'body';
  const seal = document.createElement('div'); seal.className = 'seal'; seal.textContent = '★';
  env.append(flap, body, seal);

  const label = document.createElement('div'); label.className = 'label'; label.textContent = 'Secret';
  const typ   = document.createElement('div'); typ.className   = 'type';   typ.textContent   = unlocked ? 'Unlocked' : 'Locked';

  if(!unlocked){
    const lock = document.createElement('div');
    lock.className = 'lock';
    lock.textContent = '🔒';
    env.appendChild(lock);

    env.onclick = ()=> {
      env.animate(
        [{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],
        {duration:360}
      );
    };

    // No mostramos link de Spotify si está bloqueado
    wrap.append(env, label, typ);
    return wrap;
  }

  // Desbloqueada: abre el lector normal + sparkle
  env.onclick = ()=> openSpecial();
  setTimeout(()=> sparkle(env), 200);

  // (Opcional) si añadiste special.track, también mostramos su link
  const trackBlock = special.track ? makeTrackLink(special) : document.createTextNode('');

  wrap.append(env, label, typ, trackBlock);
  return wrap;
}

// Crea el bloque de Spotify: portada + título que abre en nueva pestaña.
// También marca la carta como "abierta" para el conteo del Secret.
function makeTrackLink(item){
  const hasTrack = item.track && item.track.url;
  const cont = document.createElement('div');
  cont.className = 'track';

  if(!hasTrack){
    cont.style.display = 'none';
    return cont;
  }

  const a = document.createElement('a');
  a.href = item.track.url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.className = 'track-link';
  a.ariaLabel = `${item.title} — ${item.track.title}`;
  a.addEventListener('click', () => markOpened(item.id)); // cuenta para desbloquear
  a.addEventListener('click', ev => ev.stopPropagation());
  const img = document.createElement('img');
  img.className = 'track-cover';
  img.alt = item.track.title || 'Song cover';
  img.src = item.track.cover || '';
  // Si no hay portada, escondemos el <img> y dejamos solo el título
  if(!item.track.cover){ img.style.display = 'none'; }

  const name = document.createElement('div');
  name.className = 'track-title';
  name.textContent = item.track.title || 'Open in Spotify';

  a.append(img, name);
  cont.appendChild(a);
  return cont;
}

// ========= EFECTOS =========
function sparkle(container){
  const s = document.createElement('div'); s.className='sparkle'; container.appendChild(s);
  for(let i=0;i<10;i++){
    const dot = document.createElement('i');
    dot.style.left = (10+Math.random()*80)+'%';
    dot.style.top  = (10+Math.random()*80)+'%';
    dot.style.transform = `scale(${0.6+Math.random()*1.4}) rotate(${Math.random()*360}deg)`;
    dot.style.opacity = (0.6+Math.random()*0.4);
    s.appendChild(dot);
    dot.animate(
      [{opacity:1, transform:dot.style.transform+' translateY(0px)'},
       {opacity:0, transform:dot.style.transform+' translateY(-18px)'}],
      {duration:1200+Math.random()*800, delay:Math.random()*400}
    );
  }
  setTimeout(()=> s.remove(),2000);
}

// ========= STORAGE / HELPERS =========
function markOpened(id){
  if(!opened.includes(id)){
    opened.push(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(opened));
  }
}
function openedUniqueCount(){
  const set = new Set(opened.filter(x=> x>=1 && x<=4));
  return set.size;
}

// ========= UTILS (compatibilidad con tu código) =========
const sleep = (ms)=> new Promise(res=> setTimeout(res,ms));
function flash(msg){
  const el = document.createElement('div');
  el.textContent = msg;
  el.style.position='fixed'; el.style.left='50%'; el.style.transform='translateX(-50%)';
  el.style.bottom='18px'; el.style.background='#fff'; el.style.color='var(--accent)';
  el.style.padding='8px 12px'; el.style.borderRadius='10px'; el.style.boxShadow='0 8px 30px rgba(0,0,0,0.12)';
  document.body.appendChild(el);
  setTimeout(()=> el.style.opacity='0',1200);
  setTimeout(()=> el.remove(),1600);
}

// ========= INIT =========
buildGrid();
if(openedUniqueCount()>=4){
  const cards = grid.querySelectorAll('.letter-card');
  if(cards[cards.length-1]) sparkle(cards[cards.length-1]);
}

// Accesos rápidos (opcional): ya no abren lector; ahora solo desbloquean y/o redirigen
window.addEventListener('keydown', e=>{
  if(e.key==='1'){ markOpened(letters[0].id); window.open(letters[0].track.url, '_blank') }
  if(e.key==='5' && openedUniqueCount()>=4){
    markOpened(special.id); window.open(special.track.url, '_blank');
  }
});

/* ===== Fondo de corazones (overlay) ===== */
/* hearts.js – spawner idéntico al del menú */
(function () {
  const svg = document.getElementById('hearts-layer');
  if (!svg) return;

  // bbox del símbolo para fijar correctamente el transformOrigin
  // (estos números son el centro del <symbol> de ~115x103 que usas)
  const ORIGIN_X = 57.556226; // ≈ center x del símbolo
  const ORIGIN_Y = 51.892971; // ≈ center y del símbolo
  const HREF = '#heart';

  // Tamaño actual del viewport svg (lo recalculamos en resize)
  let vw = svg.clientWidth;
  let vh = svg.clientHeight;

  const rnd = (min, max) => Math.random() * (max - min) + min;
  const rndInt = (min, max) => Math.floor(rnd(min, max));

  function updateSize() {
    vw = svg.clientWidth;
    vh = svg.clientHeight;
    // Asegura que el viewBox recorra la pantalla actual
    svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
  }
  updateSize();
  window.addEventListener('resize', updateSize);

  // Crea un <use> en una posición aleatoria
  function spawnOne() {
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', HREF);
    use.setAttribute('class', 'heart-pop');
    svg.appendChild(use);

    // Posición aleatoria con márgenes para que no “corten” en los bordes
    const x = rnd(60, vw - 60);
    const y = rnd(60, vh - 60);

    // Rotación y escala aleatoria
    const rot = rnd(-18, 18);
    const sc = rnd(0.62, 1.05);

    // Opacidad base
    use.style.opacity = 0.9;

    // La magia: GSAP escribe un "matrix(...)" que verás en el inspector,
    // igual que en el menú. Usamos el mismo origen del símbolo:
    TweenMax.set(use, {
      svgOrigin: `${ORIGIN_X} ${ORIGIN_Y}`,
      transformOrigin: '0px 0px',
      x, y, rotation: rot, scale: sc
    });

    // Animación tipo "pop-in → flota → desvanece"
    const sMid = rnd(0.8, 1.15);
    const rise = rnd(12, 22);     // cuánto sube
    const drift = rnd(-12, 12);   // leve deriva lateral
    const t1 = 0.7, t2 = 0.7, t3 = 0.3;

    const tl = new TimelineMax({
      repeat: 1,
      yoyo: true,
      onComplete: () => {
        // segunda fase: subida + fade-out, como el menú
        TweenMax.to(use, t3, {
          y: `-=${rise}`,
          x: `+=${drift}`,
          opacity: 0,
          ease: Power1.easeOut,
          onComplete: () => use.parentNode && use.parentNode.removeChild(use)
        });
      }
    });

    tl.from(use, t1, { scale: 0, ease: Power2.easeOut })
      .to(use, t2, { scale: sMid, ease: Power1.easeInOut });
  }

  // Disparo periódico con intervalo aleatorio (como el menú)
  let t = null;
  function loop() {
    // entre 100ms y 700ms para un flujo rico
    const delay = rndInt(100, 700);
    spawnOne();
    t = setTimeout(loop, delay);
  }
  loop();

  // Unos corazones iniciales para “llenar” al cargar
  for (let i = 0; i < 6; i++) spawnOne();
})();


