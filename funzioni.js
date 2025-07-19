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

    carrelloToggle.addEventListener("click", () => {
      selectedList.classList.toggle("hidden");
    })

    if('serviceWorker' in navigator){
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
        .then(reg => console.log('Service Worker registrato: ', reg.scope))
        .then(err => console.log('Service Worker errore: ', err))
      });
    }

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

    document.getElementById("hamburger").addEventListener("click", () => {
      document.getElementById("side-menu").classList.add("open");
    });

    document.getElementById("chiudi").addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("side-menu").classList.remove("open");
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
      alert("Lista salvata con successo!");

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
          voce.textContent = chiave.replace("spesa-", "").split("-")[0];

          voce.addEventListener("click", () => {
            const lista = JSON.parse(localStorage.getItem(chiave));
            caricaListaSalvata(lista);
          });

          elenco.appendChild(voce);
        }
      }
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
