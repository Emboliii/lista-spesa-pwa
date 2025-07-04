    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const output = document.getElementById('output');

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateList);
    });
    aggiornaStatoBottone();

    function updateList() {
  output.innerHTML = '';
  checkboxes.forEach(cb => {
    if (cb.checked) {
      const li = document.createElement('li');
      li.textContent = '';
      const nameSpan = document.createElement('span');
      nameSpan.textContent = cb.parentElement.textContent.trim();
      li.appendChild(nameSpan);
      li._checkbocRef = cb;
      span(li);
      output.appendChild(li);
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
    output.appendChild(li);
    input.value = '';
    }
    aggiornaStatoBottone();
  }

  function cancellaLista(){
    const conferma = confirm("Sei sicuro di voler cancellare tutta la lista?");
    if(conferma){
    checkboxes.forEach(cb => cb.checked = false);
    output.innerHTML = "";
    }
    aggiornaStatoBottone();
  }

  function aggiornaStatoBottone(){
    const bottoneCancella = document.getElementById("bottoneCancella");
    bottoneCancella.disabled = output.children.length === 0;
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
    deleteBtn.onclick = () => {
      const conferma = confirm("Sei sicuro di eliminarlo dalla lista?");
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
    plusBtn.textContent = '+';
    plusBtn.onclick = () => {
      countspan.textContent = Number(countspan.textContent) + 1;
    }
    return plusBtn;
  }
  function Decremento(countspan){
    const minusBtn = document.createElement('button');
    minusBtn.textContent = '-';
    minusBtn.onclick = () => {
      let current = Number(countspan.textContent);
      if (current > 1){
        countspan.textContent = current - 1;
      } else{
        const conferma = confirm("Sei sicuro di eliminarlo dalla lista?");
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