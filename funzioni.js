function creaElemento(tag, props = {}, ...children){
  const el = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if(k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else if (k === 'onclick') el.onclick = v;
    else el.setAttribute(k, v);
  });
  children.forEach(child => {
    if (typeof child === 'string') el.appendChild(document.createTextNode(child));
    else if (child) el.appendChild(child);
  });
  return el;
}

const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const outputCheckbox = document.getElementById('output-checkbox');
const outputCustom = document.getElementById('output-custom');

function Incremento(countspan) {
  return creaElemento('button', {
    text: '➕',
    onclick: () => {
      countspan.textContent = Number(countspan.textContent) + 1;
      salvaListaSuLocalStorage();
    }
  });
}

function Decremento(countspan) {
  return creaElemento('button', {
    text: '➖',
    onclick: async () => {
      const current = Number(countspan.textContent);
      if (current > 1) {
        countspan.textContent = current - 1;
      } else {
        const conferma = await showModalConferma();
        if (conferma) {
          const li = countspan.closest('li');
          if (li._checkboxRef) li._checkboxRef.checked = false;
          li.remove();
          salvaListaSuLocalStorage();
          aggiornaStatoBottone();
        }
      }
    }
  });
}

function creaVoceLista(nome, quantita = 1, personalizzato = false, checkboxRef = null) {
  const nameSpan = creaElemento('span', { class: 'nome', text: nome });
  const countSpan = creaElemento('span', { text: quantita });

  const deleteBtn = creaElemento('button', {
    text: '❌',
    onclick: async () => {
      const conferma = await showModalConferma("Sei sicuro di voler eliminare questo elemento?");
      if (conferma) {
        if (li._checkboxRef) li._checkboxRef.checked = false;
        li.remove();
        salvaListaSuLocalStorage();
        aggiornaStatoBottone();
      }
    }
  });

  const controls = creaElemento('span', { class: 'controlli' },
    Decremento(countSpan),
    countSpan,
    Incremento(countSpan),
    deleteBtn
  );

  const li = creaElemento('li', {}, nameSpan, controls);
  if (checkboxRef) li._checkboxRef = checkboxRef;
  return li;
}

checkboxes.forEach(cb => cb.addEventListener('change', updateList));
document.getElementById("salvaLista").addEventListener("click", salvaLista);
document.getElementById("chiudi").addEventListener("click", e => {
  e.preventDefault();
  document.getElementById("side-menu").classList.remove("open");
});

document.getElementById('hamburger').addEventListener('click', openMenu);
document.getElementById('overlay-menu').addEventListener('click', closeMenu);
document.getElementById('overlay-lista').addEventListener('click', closeLista);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeMenu();
    closeLista();
  }
});

function updateList() {
  outputCheckbox.innerHTML = '';
  checkboxes.forEach(cb => {
    if (cb.checked) {
      const nome = cb.parentElement.textContent.trim();
      const li = creaVoceLista(nome, 1, false, cb);
      outputCheckbox.appendChild(li);
    }
  });
  aggiornaStatoBottone();
  salvaListaSuLocalStorage();
}

function addCustomItem() {
  const input = document.getElementById('custom-input');
  const value = input.value.trim();
  if (!value) return;
  const li = creaVoceLista(value, 1, true);
  outputCustom.appendChild(li);
  input.value = '';
  aggiornaStatoBottone();
  salvaListaSuLocalStorage();
}

function cancellaLista() {
  showModalConferma("Sei sicuro di voler cancellare tutta la lista?")
    .then(conferma => {
      if (conferma) {
        checkboxes.forEach(cb => cb.checked = false);
        outputCheckbox.innerHTML = "";
        outputCustom.innerHTML = "";
        localStorage.removeItem('lista-spesa');
      }
      aggiornaStatoBottone();
    });
}

function aggiornaStatoBottone() {
  const bottoneCancella = document.getElementById("bottoneCancella");
  const totalItems = outputCheckbox.children.length + outputCustom.children.length;
  document.getElementById("conteggio-carrello").textContent = totalItems;
  bottoneCancella.disabled = totalItems === 0;
}

function showModalConferma(messaggio = "Sei sicuro di voler continuare?") {
  return new Promise(resolve => {
    const modal = document.getElementById("modalConferma");
    const btnSi = document.getElementById("btnSi");
    const btnNo = document.getElementById("btnNo");
    const messageElement = document.getElementById("modalMessage");

    messageElement.textContent = messaggio;
    modal.classList.remove("hidden");

    btnSi.onclick = () => { modal.classList.add("hidden"); resolve(true); };
    btnNo.onclick = () => { modal.classList.add("hidden"); resolve(false); };
  });
}

function salvaListaSuLocalStorage() {
  const lista = [];

  outputCheckbox.querySelectorAll('li').forEach(li => {
    lista.push({
      nome: li.querySelector('.nome').textContent,
      quantita: Number(li.querySelector('.controlli span').textContent),
      personalizzato: false
    });
  });

  outputCustom.querySelectorAll('li').forEach(li => {
    lista.push({
      nome: li.querySelector('.nome').textContent,
      quantita: Number(li.querySelector('.controlli span').textContent),
      personalizzato: true
    });
  });

  localStorage.setItem('lista-spesa', JSON.stringify(lista));
}

function caricaListaDaLocalStorage() {
  const salvata = JSON.parse(localStorage.getItem('lista-spesa') || '[]');
  salvata.forEach(item => {
    let checkboxRef = null;
    if (!item.personalizzato) {
      checkboxes.forEach(cb => {
        if (cb.parentElement.textContent.trim() === item.nome) {
          cb.checked = true;
          checkboxRef = cb;
        }
      });
    }
    const li = creaVoceLista(item.nome, item.quantita, item.personalizzato, checkboxRef);
    (item.personalizzato ? outputCustom : outputCheckbox).appendChild(li);
  });
  aggiornaStatoBottone();
}

function salvaLista() {
  const prodotti = [...outputCheckbox.querySelectorAll('li'), ...outputCustom.querySelectorAll('li')].map(li => ({
    nome: li.querySelector('.nome').textContent,
    quantita: Number(li.querySelector('.controlli span').textContent),
    personalizzato: outputCustom.contains(li)
  }));

  if (prodotti.length === 0) {
    alert("La lista è vuota");
    return;
  }

  fetch('salva_lista.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prodotti)
  })
    .then(r => r.text())
    .then(data => {
      alert(data || "Lista salvata con successo!");
      aggiornaMenuLaterale();
    })
    .catch(err => {
      console.error('Errore salvataggio: ', err);
      alert("Errore durante il salvataggio.")
    });

  const data = new Date().toLocaleDateString("it-IT");
  const chiave = `spesa-${data}-${Date.now()}`;
  localStorage.setItem(chiave, JSON.stringify(prodotti));
  aggiornaMenuLaterale();
}

function aggiornaMenuLaterale() {
  const elenco = document.getElementById("storicoListe");
  elenco.innerHTML = "";
  for (let i = 0; i < localStorage.length; i++) {
    const chiave = localStorage.key(i);
    if (chiave.startsWith("spesa-")) {
      const nomeLista = chiave.replace("spesa-", "").split("-")[0];
      const spanNome = creaElemento("span", {
        text: nomeLista,
        style: "cursor:pointer;flex:1",
        onclick: () => caricaListaSalvata(JSON.parse(localStorage.getItem(chiave)))
      });

      const btnElimina = creaElemento("button", {
        text: "🗑️",
        style: "margin-left:10px;cursor:pointer;background:none;border:none;color:white;font-size:1.2em",
        onclick: async () => {
          const conferma = await showModalConferma("Vuoi eliminare la lista salvata?");
          if (conferma) {
            localStorage.removeItem(chiave);
            aggiornaMenuLaterale();
          }
        }
      });

      const voce = creaElemento("li", { style: "display:flex;align-items:center;justify-content:space-between" }, spanNome, btnElimina);
      elenco.appendChild(voce);
    }
  }
}

function caricaListaSalvata(lista) {
  outputCheckbox.innerHTML = '';
  outputCustom.innerHTML = '';
  checkboxes.forEach(cb => cb.checked = false);

  lista.forEach(item => {
    let checkboxRef = null;
    if (!item.personalizzato) {
      checkboxes.forEach(cb => {
        if (cb.parentElement.textContent.trim() === item.nome) {
          cb.checked = true;
          checkboxRef = cb;
        }
      });
    }
    const li = creaVoceLista(item.nome, item.quantita, item.personalizzato, checkboxRef);
    (item.personalizzato ? outputCustom : outputCheckbox).appendChild(li);
  });

  aggiornaStatoBottone();
}

function openMenu() {
  document.getElementById("side-menu").classList.add('open');
  document.getElementById("overlay-menu").classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  document.getElementById("side-menu").classList.remove('open');
  document.getElementById("overlay-menu").classList.remove('active');
  document.body.style.overflow = '';
}

function closeLista() {
  const lista = document.getElementById("selected-list");
  const overlay = document.getElementById("overlay-lista");
  lista.classList.add('hidden');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

if ('ServiceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker registrato: ', reg))
      .catch(err => console.error('Errore Service Worker: ', err));
  });
}

aggiornaStatoBottone();
caricaListaDaLocalStorage();