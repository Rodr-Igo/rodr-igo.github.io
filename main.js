document.addEventListener('DOMContentLoaded', () => {
  // ===== TEXTO =====
  const text =
    'Buenos días Mi amor! Espero hayas podido descansar bien y que desde que despiertes sea un bonito día ya que hoy cumpleaños mi persona favorita (osea tu obviamente) Te quiero muchisisimo y estuve planeando mucho que regalarte de cumpleaños y como hacer que te sintieras especial. Quiero siempre darte lo mejor del mundo y si no encuentro algo por ese estilo lo hare por ti desde cero! Desde el momento que empezamos a conversa pude darme cuenta de lo dulce que eres y de que te gustan mucho los pequeños detalles como a mi, te quiero muchisisismo! Para abrir el resto de tu regalo necesitas decifrar este acertijo Mi cielo!🤍';

  const textEl = document.querySelector('.textCont');
  if (!textEl) {
    console.error('No se encontró .textCont. Revisa el HTML.');
    return;
  }

  const chars = text.split('');
  let i = 0;

  function interval(letter) {
    return (letter === ';' || letter === '.' || letter === ',')
      ? Math.floor(Math.random() * 500 + 500)
      : Math.floor(Math.random() * 80 + 5);
  }

  function typeNext() {
    if (i < chars.length) {
      textEl.textContent += chars[i];
      i++;
      setTimeout(typeNext, interval(chars[i]));
    } else {
      // terminó => mostrar input
      textEl.classList.add("no-caret");
      setTimeout(showRiddle, 300);
    }
  }

  // ===== ACERTIJO + POPUP =====
  const RL_ACCEPT = 'pecesito';
  const rlWrap   = document.getElementById('rl-riddle');
  const rlInput  = document.getElementById('rl-input');
  const rlSend   = document.getElementById('rl-send');
  const rlMsg    = document.getElementById('rl-msg');

  const rlOverlay = document.getElementById('rl-overlay');
  const rlResult  = document.getElementById('rl-result');
  const rlClose   = document.getElementById('rl-close');

  // estado inicial seguro
  if (rlWrap)    rlWrap.hidden    = true;
  if (rlOverlay) rlOverlay.hidden = true;

  function showRiddle() {
    rlWrap.hidden = false;
    rlInput.focus();
  }

  function handleRiddle() {
    const v = (rlInput.value || '').trim().toLowerCase();
    if (!v) { rlMsg.textContent = 'Escribe la respuesta.'; return; }
    const ok = (v === RL_ACCEPT);
    openPopup(ok);
  }

  function openPopup(ok) {
    rlMsg.textContent = '';
    rlResult.textContent = ok ? 'ACCESS GRANTED' : 'ACCESS DENIED';
    rlResult.classList.toggle('rl-success', ok);
    rlResult.classList.toggle('rl-error', !ok);
    rlOverlay.hidden = false;
    rlClose.focus();
    // if (ok) setTimeout(()=>window.location.href='siguiente.html', 800);
  }

  function closePopup() {
    rlOverlay.hidden = true;
    if (!rlResult.classList.contains('rl-success')) rlInput.focus();
  }

  rlSend.addEventListener('click', handleRiddle);
  rlInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleRiddle(); });
  rlClose.addEventListener('click', closePopup);

  // start!
  textEl.textContent = '';
  typeNext();
});
