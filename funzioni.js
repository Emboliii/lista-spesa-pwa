const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const outputCheckbox = document.getElementById('output-checkbox');
    const outputCustom = document.getElementById("output-custom");

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateList);
    });
    aggiornaStatoBottone();
    caricaListaDaLocalStorage();

  function updateList() {
  outputCheckbox.innerHTML = '';
  checkboxes.forEach(cb => {
    if (cb.checked) {
      const li = document.createElement('li');
      li.textContent = '';
      const nameSpan = document.createElement('span');
      nameSpan.textContent = cb.parentElement.textContent.trim();
      li.appendChild(nameSpan);
      li._checkboxRef = cb;
      span(li);
      outputCheckbox.appendChild(li);
    }
  });
  aggiornaStatoBottone();
  salvaListaSuLocalStorage();
}
  function addCustomItem() {
  const input = document.getElementById('custom-input');
  const value = input.value.trim();
  if (value !== '') {
    const li = document.createElement('li');
    li.textContent = '';
    const nameSpan = document.createElement('span');
    nameSpan.textContent = value;
    li.appendChild(nameSpan);
    span(li);
    outputCustom.appendChild(li);
    input.value = '';
    }
    aggiornaStatoBottone();
    salvaListaSuLocalStorage();
  }

  function showModalConferma(messaggio = "Sei sicuro di voler continuare?"){
    return new Promise((resolve) => {
      const modal = document.getElementById("modalConferma");
      const btnSi = document.getElementById("btnSi");
      const btnNo = document.getElementById("btnNo");
      const messageElement = document.getElementById("modalMessage");

      messageElement.textContent = messaggio;
      modal.classList.remove("hidden");

      btnSi.onclick = () => {
        modal.classList.add("hidden");
        resolve(true);
      };

      btnNo.onclick = () => {
        modal.classList.add("hidden");
        resolve(false);
      };
    });
  }

  async function cancellaLista(){
    const conferma = await showModalConferma("Sei sicuro di voler cancellare tutta la lista?");
    if(conferma){
      checkboxes.forEach(cb => cb.checked = false);
      outputCheckbox.innerHTML = "";
      outputCustom.innerHTML = "";
      localStorage.removeItem('lista-spesa');

      console.log("Lista cancellata");
    } else{
      console.log("Cancellazione annullata");
    }
    aggiornaStatoBottone();
  }

  function aggiornaStatoBottone(){
    const bottoneCancella = document.getElementById("bottoneCancella");
    const totalItems = outputCheckbox.children.length + outputCustom.children.length;
    document.getElementById("conteggio-carrello").textContent = totalItems;
    bottoneCancella.disabled = totalItems=== 0;
  }

  function span(li){
    const name = li.querySelector('span');
    name.className = 'nome'

    const countspan = document.createElement('span');
    countspan.textContent = 1;

    const controls = document.createElement('span');
    controls.className = 'controlli';

    controls.appendChild(Decremento(countspan));
    controls.appendChild(countspan);
    controls.appendChild(Incremento(countspan));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.onclick =  async() => {
      const conferma = await showModalConferma("Sei sicuro di voler eliminare questo elemento?");
      if(conferma){
        if(li._checkboxRef){
        li._checkboxRef.checked = false;
      }
      li.remove();
      aggiornaStatoBottone();
    }
    }
    controls.appendChild(deleteBtn);
    li.appendChild(controls);
  }

  function Incremento(countspan){
    const plusBtn = document.createElement('button');
    plusBtn.textContent = '➕';
    plusBtn.onclick = () => {
      countspan.textContent = Number(countspan.textContent) + 1;
      salvaListaSuLocalStorage();
    }
    return plusBtn;
  }
  function Decremento(countspan){
    const minusBtn = document.createElement('button');
    minusBtn.textContent = '➖';
    minusBtn.onclick = async () => {
      let current = Number(countspan.textContent);
      if (current > 1){
        countspan.textContent = current - 1;
      } else{
        const conferma = await showModalConferma();
        if(conferma){
            const li = countspan.closest('li');
            if(li._checkboxRef){
                li._checkboxRef.checked = false;
        }
        li.remove();
        salvaListaSuLocalStorage();
        aggiornaStatoBottone();
        }
      }
    }
    return minusBtn;
  }
    if('ServiceWorker' in navigator){
      window.addEventListener('load', () =>{
        navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('Service Worker registrato: ', reg))
        .catch(err => console.error('Errore Service Worker: ', err))
      });
    }

    const carrelloToggle = document.getElementById("carrello-toggle");
    const selectedList = document.getElementById("selected-list");
    const overlayLista = document.getElementById('overlay-lista');

    carrelloToggle.addEventListener("click", () => {
      const isVisible = !selectedList.classList.contains("hidden");

      if (isVisible){
        selectedList.classList.add("hidden");
        overlayLista.classList.remove("active");
        document.body.style.overflow = "";
      } else {
        selectedList.classList.remove("hidden");
        overlayLista.classList.add("active");
        document.body.style.overflow = "";
      }
    });

    overlayLista.addEventListener("click", () => {
        selectedList.classList.add("hidden");
        overlayLista.classList.remove("active");
        document.body.style.overflow = "";
    });

    function salvaListaSuLocalStorage(){
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

    function caricaListaDaLocalStorage(){
      const salvata = JSON.parse(localStorage.getItem('lista-spesa') || '[]');
      salvata.forEach(item => {
        const li = document.createElement('li');
        li.textContent = '';
        const nameSpan = document.createElement('span');
        nameSpan.className = 'nome';
        nameSpan.textContent = item.nome;
        li.appendChild(nameSpan);

        const countspan = document.createElement('span');
        countspan.textContent = item.quantita;

        const controls = document.createElement('span');
        controls.className = 'controlli';
        controls.appendChild(Decremento(countspan));
        controls.appendChild(countspan);
        controls.appendChild(Incremento(countspan));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '❌';
        deleteBtn.onclick = async () => {
          const conferma = await showModalConferma("Sei sicuro di voler eliminare questo elemento?");
          if (conferma) {
          li.remove();
          salvaListaSuLocalStorage();
          aggiornaStatoBottone();
        }
      };
        controls.appendChild(deleteBtn);
        li.appendChild(controls);

        if (item.personalizzato) {
        outputCustom.appendChild(li);
      } else {
        checkboxes.forEach(cb => {
          if (cb.parentElement.textContent.trim() === item.nome) {
            cb.checked = true;
            li._checkboxRef = cb;
          }
        })
        outputCheckbox.appendChild(li);
      }
      });

      aggiornaStatoBottone();
    }

    document.getElementById("chiudi").addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("side-menu").classList.remove("open");
      document.getElementById("overlay-menu").classList.remove("active");
      document.body.style.overflow = "";
    });

    function salvaLista(){
      const prodottiCheckbox = Array.from(document.querySelectorAll("#output-checkbox li")).map(li => ({
        nome: li.querySelector('.nome').textContent,
        quantita: Number(li.querySelector('.controlli span').textContent),
        personalizzato: false
      }));

      const prodottiCustom = Array.from(document.querySelectorAll("#output-custom li")).map(li => ({
        nome: li.querySelector('.nome').textContent,
        quantita: Number(li.querySelector('.controlli span').textContent),
        personalizzato: true
      }));

      const listaCompleta = [...prodottiCheckbox, ...prodottiCustom];

      if(listaCompleta.length === 0){
        alert("La lista è vuota");
        return;
      }

      fetch('salva_lista.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(listaCompleta)
      })
      .then(response => response.text())
      .then(data => {
        alert(data || "Lista salvata con successo!");
        aggiornaMenuLaterale();
      })
      .catch(error => {
        console.error('Errore salvataggio: ', error);
        alert("Errore durante il salvataggio.")
      })

      const data = new Date().toLocaleDateString("it-IT");
      const chiave = `spesa-${data}-${Date.now()}`;

      localStorage.setItem(chiave, JSON.stringify(listaCompleta));

      aggiornaMenuLaterale();
    }

    document.getElementById("salvaLista").addEventListener("click", salvaLista);

    function aggiornaMenuLaterale(){
      const elenco = document.getElementById("storicoListe");
      elenco.innerHTML = "";

      for(let i = 0; i < localStorage.length; i++){
        const chiave = localStorage.key(i);

        if (chiave.startsWith("spesa-")){
          const voce = document.createElement("li");
          
          const nomeLista = chiave.replace("spesa-", "").split("-")[0];
          const spanNome = document.createElement("span");
          spanNome.textContent = nomeLista;
          spanNome.style.cursor = "pointer";
          spanNome.style.flex = "1";
          spanNome.addEventListener("click", () => {
            const lista = JSON.parse(localStorage.getItem(chiave));
            caricaListaSalvata(lista);
          });storicoListe

          const btnElimina = document.createElement("button");
          btnElimina.textContent = "🗑️";
          btnElimina.style.marginLeft = "10px";
          btnElimina.style.cursor = "pointer";
          btnElimina.style.background = "none";
          btnElimina.style.border = "none";
          btnElimina.style.color = "white";
          btnElimina.style.fontSize = "1.2em";

          btnElimina.addEventListener("click", async() => {
            const conferma = await showModalConferma("Vuoi eliminare la lista salvata?");
            if(conferma){
              localStorage.removeItem(chiave);
              aggiornaMenuLaterale();
            }
          });

          voce.style.display = "flex";
          voce.style.alignItems = "center";
          voce.style.justifyContent = "space-between";


          voce.appendChild(spanNome);
          voce.appendChild(btnElimina);
          elenco.appendChild(voce);
        }
      }
    }

    function caricaListeSalvate() {
      const tutteLeChiavi = Object.keys(localStorage);
      const chiaviSpesa = tutteLeChiavi.filter(k => k.startsWith('spesa-'));

      const storico = document.getElementById('storicoListe');
      storico.innerHTML = '';

      chiaviSpesa.forEach(chiave => {
        const voce = document.createElement('li');
        const dataLista = chiave.replace('spesa-', '').split('-')[0];
        voce.textContent = chiave;

        voce.addEventListener('click', () => {
          const dati = JSON.parse(localStorage.getItem(chiave));
          caricaListeSalvate(dati);
          closeMenu();
        });

        storico.appendChild(voce);
  });
}

    function caricaListaSalvata(lista) {
      outputCheckbox.innerHTML = '';
      outputCustom.innerHTML = '';
      checkboxes.forEach(cb => cb.checked = false);

      lista.forEach(item => {
        const li = document.createElement('li');
        li.textContent = ''; // svuota il testo base

        const nameSpan = document.createElement('span');
        nameSpan.className = 'nome';
        nameSpan.textContent = item.nome;
        li.appendChild(nameSpan);

        const countspan = document.createElement('span');
        countspan.textContent = item.quantita;

        const controls = document.createElement('span');
        controls.className = 'controlli';
        controls.appendChild(Decremento(countspan));
        controls.appendChild(countspan);
        controls.appendChild(Incremento(countspan));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '❌';
        deleteBtn.onclick = async () => {
          const conferma = await showModalConferma("Sei sicuro di voler eliminare questo elemento?");
          if (conferma) {
          li.remove();
          aggiornaStatoBottone();
        }
      };
      controls.appendChild(deleteBtn);
      li.appendChild(controls);

      if (item.personalizzato) {
        outputCustom.appendChild(li);
      } else {
        checkboxes.forEach(cb => {
          if (cb.parentElement.textContent.trim() === item.nome) {
            cb.checked = true;
            li._checkboxRef = cb;
          }
        });
        outputCheckbox.appendChild(li);
      }
    });

    aggiornaStatoBottone();
  }

  const hamburgerBtn = document.getElementById('hamburger');
  const sideMenu = document.getElementById('side-menu');
  const overlayMenu = document.getElementById('overlay-menu');

  const chiudiMenu = document.getElementById('chiudi');
  chiudiMenu.addEventListener('click', (e) => {
    e.preventDefault();
    closeMenu();
  });
  
  hamburgerBtn.addEventListener('click', () => {
    openMenu();
  });

  function openMenu() {
    sideMenu.classList.add('open');
    overlayMenu.classList.add('active');
    document.body.style.overflow = 'hidden'; // blocca lo scroll del body
  }

  function closeMenu() {
    sideMenu.classList.remove('open');
    overlayMenu.classList.remove('active');
    document.body.style.overflow = ''; // ripristina lo scroll
  }

  overlayMenu.addEventListener('click', closeMenu);

  document.addEventListener('keydown', e => {
    if(e.key === 'Escape'){
      if(sideMenu.classList.contains('open')){
        closeMenu();
      }
      if(!selectedList.classList.contains('hidden')){
        selectedList.classList.add('hidden');
        overlayLista.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    aggiornaMenuLaterale();
  });