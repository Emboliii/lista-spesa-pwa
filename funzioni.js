    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const outputCheckbox = document.getElementById('output-checkbox');
    const outputCustom = document.getElementById("output-custom");

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateList);
    });
    aggiornaStatoBottone();

  function updateList() {
  outputCheckbox.innerHTML = '';
  checkboxes.forEach(cb => {
    if (cb.checked) {
      const li = document.createElement('li');
      li.textContent = '';
      const nameSpan = document.createElement('span');
      nameSpan.textContent = cb.parentElement.textContent.trim();
      li.appendChild(nameSpan);
      li._checkbocRef = cb;
      span(li);
      outputCheckbox.appendChild(li);
    }
  });
  aggiornaStatoBottone();
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
        if(li._checkbocRef){
        li._checkbocRef.checked = false;
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
            if(li._checkbocRef){
                li._checkbocRef.checked = false;
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