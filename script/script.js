document.addEventListener('DOMContentLoaded', () => {

  const modal = document.querySelectorAll('.modal');
  const addModal = document.querySelector('.modal-add');
  const deleteModal = document.querySelector('.modal-delete');
  const editModal = document.querySelector('.modal-edit');
  const sortBtns = document.querySelectorAll('.th__btn');
  const idBtn = document.querySelector('#id-btn');
  const fioBtn = document.querySelector('#fio-btn');
  const creationBtn = document.querySelector('#creation-time-btn');
  const changesBtn = document.querySelector('#changes-time-btn');
  const tbody = document.querySelector('.tbody');
  const headerInput = document.querySelector('.header__input');
  let currentClientId;
  let clientsArray;


  // Work with server

  async function getClientsFromServer() {
    tbody.classList.add('_sending');
    const response = await fetch('https://aqueous-cliffs-54875.herokuapp.com/api/clients');
    if (response.ok) tbody.classList.remove('_sending');
    const result = await response.json();
    return result;
  }

  async function getClientFromServerById(id) {
    const response = await fetch(`https://aqueous-cliffs-54875.herokuapp.com/api/clients/${id}`);
    const result = await response.json();
    return result;
  }

  async function postClientToServer(client) {
    const response = await fetch('https://aqueous-cliffs-54875.herokuapp.com/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(client)
    });
    return response;
  }

  function createClient() {
    const contactsArray = [];

    addModal.querySelectorAll('.contact-wrapper').forEach(el => {
      const contact = {
        type: el.querySelector('.modal__select').value,
        value: el.querySelector('.modal__contact-input').value,
      }
      contactsArray.push(contact);
    })

    const client = {
      name: addModal.querySelector('.name-input-js').value.trim(),
      surname: addModal.querySelector('.surname-input-js').value.trim(),
      lastName: addModal.querySelector('.lastname-input-js').value.trim(),
      contacts: contactsArray,
    };

    return client;
  }

  addModal.querySelector('.save-button').addEventListener('click', async () => {
    const checkValidate = formValidate(addModal.querySelector('.modal__form'), addModal.querySelector('.save-button'));
    if (checkValidate.fullNameError === 0 && checkValidate.contactsError === 0) {
      const client = createClient();
      addModal.querySelector('.modal__content').classList.add('_sending');
      const response = await postClientToServer(client);
      if (response.ok) {
        addModal.querySelector('.modal__content').classList.remove('_sending');
      }
      addModal.classList.remove('modal_active');
      clearClientTable();
      await fillClientsTableFromServer();
      addModal.querySelector('.modal__form').reset();
      addModal.querySelectorAll('.contact-wrapper').forEach(el => el.remove());
      // window.location.assign(window.location.origin);
    }
  })

  function clearClientTable() {
    document.querySelectorAll('.content__tr').forEach(el => el.remove());
  }

  async function fillClientsTableFromServer() {
    clientsArray = await getClientsFromServer();
    fillClientsTableFromArray(clientsArray);
  }

  async function fillClientsTableFromArray(array) {
    console.log(array);
    for (let client of array) {
      const tr = document.createElement('tr');
      tr.classList.add('content__tr');
      const tdId = document.createElement('td');
      tdId.classList.add('content__td', 'td-id');
      tdId.textContent = client.id;
      tr.append(tdId);

      const tdFullName = document.createElement('td');
      tdFullName.classList.add('content__td');
      tdFullName.textContent = `${client.surname} ${client.name} ${client.lastName}`;
      tr.append(tdFullName);

      const tdCreateTime = document.createElement('td');
      tdCreateTime.classList.add('content__td');
      const creationDate = new Date(client.createdAt).getDate();
      const creationMonth = new Date(client.createdAt).getMonth() + 1;
      const creationYear = new Date(client.createdAt).getFullYear();
      tdCreateTime.textContent = `${creationDate}.${creationMonth}.${creationYear}`;
      const createTime = document.createElement('span');
      createTime.classList.add('grey-text');
      const creationHours = new Date(client.createdAt).getHours();
      let creationMinutes = new Date(client.createdAt).getMinutes();
      if (creationMinutes < 10) {
        creationMinutes = `0${creationMinutes}`;
      }
      createTime.textContent = `${creationHours}:${creationMinutes}`;
      tdCreateTime.append(createTime);
      tr.append(tdCreateTime);

      const tdUpdateTime = document.createElement('td');
      tdUpdateTime.classList.add('content__td');
      const updateDate = new Date(client.updatedAt).getDate();
      const updateMonth = new Date(client.updatedAt).getMonth() + 1;
      const updateYear = new Date(client.updatedAt).getFullYear();
      tdUpdateTime.textContent = `${updateDate}.${updateMonth}.${updateYear}`;
      const updateTime = document.createElement('span');
      updateTime.classList.add('grey-text');
      const updateHours = new Date(client.updatedAt).getHours();
      let updateMinutes = new Date(client.updatedAt).getMinutes();
      if (updateMinutes < 10) {
        updateMinutes = `0${updateMinutes}`;
      }
      updateTime.textContent = `${updateHours}:${updateMinutes}`;
      tdUpdateTime.append(updateTime);
      tr.append(tdUpdateTime);

      const tdContacts = document.createElement('td');
      tdContacts.classList.add('content__td');
      for (let contact of client.contacts) {
        const contactDiv = document.createElement('div');
        contactDiv.classList.add('contact-svg');
        if (contact.type === 'Vk') {
          contactDiv.classList.add('vk-svg');
        } else if (contact.type === 'Facebook') {
          contactDiv.classList.add('facebook-svg');
        } else if (contact.type === 'Email') {
          contactDiv.classList.add('mail-svg');
        } else if (contact.type === 'Телефон' || contact.type === 'Доп. телефон') {
          contactDiv.classList.add('phone-svg');
        } else {
          contactDiv.classList.add('abstract-svg');
        }
        tippy(contactDiv, {
          content: contact.value,
        })
        tdContacts.append(contactDiv);
      }
      tr.append(tdContacts);

      const tdEdit = document.createElement('td');
      tdEdit.classList.add('content__td', 'td-action');
      const buttonEdit = document.createElement('button');
      const svgEdit = document.createElement('svg');
      svgEdit.classList.add('action_svg');
      svgEdit.innerHTML = '<svg class="action_svg" width="16" height="16" viewbox="0 0 16 16" fill="none" xmlns = "http://www.w3.org/2000/svg" >  <g opacity="0.7"> <path d="M2 11.5V14H4.5L11.8733 6.62662L9.37333 4.12662L2 11.5ZM13.8067 4.69329C14.0667 4.43329 14.0667 4.01329 13.8067 3.75329L12.2467 2.19329C11.9867 1.93329 11.5667 1.93329 11.3067 2.19329L10.0867 3.41329L12.5867 5.91329L13.8067 4.69329Z" fill="#9873FF" /> </g> </svg > ';
      buttonEdit.classList.add('action_button', 'edit');
      buttonEdit.textContent = 'Изменить';
      buttonEdit.addEventListener('click', (event) => {
        clearContactsInput();
        const currentTr = event.currentTarget.parentNode.parentNode;
        currentClientId = currentTr.querySelector('.td-id').textContent;
        editModal.classList.add('modal_active');
        editModal.querySelector('.modal__span').textContent = `ID: ${currentClientId}`;

        const arrEditInputs = editModal.querySelectorAll('.modal__input');
        const fullName = currentTr.querySelectorAll('.content__td')[1].textContent.split(' ');
        arrEditInputs[0].value = fullName[0];
        arrEditInputs[1].value = fullName[1];
        arrEditInputs[2].value = fullName[2];

        const arrContacts = array.find(client => client.id === currentClientId).contacts;
        for (let item of arrContacts) {
          editModal.querySelector('.modal__add-contact').before(createContactInput(item.type, item.value));
        }

        // const url = new URL(window.location.origin);
        // window.location.assign(url + '#' + currentClientId);
      });
      buttonEdit.prepend(svgEdit);
      tdEdit.append(buttonEdit);

      const buttonDelete = document.createElement('button');
      const svgDelete = document.createElement('svg');
      svgDelete.classList.add('action_svg');
      svgDelete.innerHTML = '<svg class="action_svg" width="16" height="16" viewbox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <g opacity="0.7"> <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#F06A4D" /> </g></svg>';
      buttonDelete.classList.add('action_button', 'delete');
      buttonDelete.textContent = 'Удалить';
      buttonDelete.addEventListener('click', (event) => {
        currentClientId = event.target.parentNode.parentNode.querySelector('.td-id').textContent;
        deleteModal.classList.add('modal_active');
      })
      buttonDelete.prepend(svgDelete);
      tdEdit.append(buttonDelete);
      tr.append(tdEdit);

      document.querySelector('.tbody').append(tr);
    }
  }

  fillClientsTableFromServer();

  deleteModal.querySelector('.save-button').addEventListener('click', async () => {
    await fetch(`https://aqueous-cliffs-54875.herokuapp.com/api/clients/${currentClientId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    });
    clearClientTable();
    await fillClientsTableFromServer();
    modal.forEach(el => el.classList.remove('modal_active'));
    // window.location.assign(window.location.origin);
  })

  editModal.querySelector('.save-button').addEventListener('click', async () => {
    const arrModalInputs = editModal.querySelectorAll('.modal__input');
    const contactsArray = [];

    const checkValidate = formValidate(editModal.querySelector('.modal__form'), editModal.querySelector('.save-button'));
    if (checkValidate.fullNameError === 0 && checkValidate.contactsError === 0) {
      editModal.querySelector('.modal__content').classList.add('_sending');
      editModal.querySelectorAll('.contact-wrapper').forEach(el => {
        const contact = {
          type: el.querySelector('.modal__select').value,
          value: el.querySelector('.modal__contact-input').value,
        }
        contactsArray.push(contact);
      })

      const response = await fetch(`https://aqueous-cliffs-54875.herokuapp.com/api/clients/${currentClientId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          name: arrModalInputs[1].value,
          surname: arrModalInputs[0].value,
          lastName: arrModalInputs[2].value,
          contacts: contactsArray
        })
      });
      if (response.ok) editModal.querySelector('.modal__content').classList.remove('_sending');
      clearClientTable();
      await fillClientsTableFromServer();
      editModal.classList.remove('modal_active');
      // window.location.assign(window.location.origin);
    }
  })

  document.querySelector('.button-client').addEventListener('click', () => {
    document.querySelector('.modal-add').classList.add('modal_active');
  });

  document.querySelectorAll('.delete').forEach(el => el.addEventListener('click', () => {
    deleteModal.classList.add('modal_active');
  }));

  document.querySelectorAll('.modal__close-button').forEach(el => el.addEventListener('click', () => {
    modal.forEach(el => el.classList.remove('modal_active'));
  }));

  document.querySelectorAll('.cancel-button-js').forEach(el => el.addEventListener('click', () => {
    modal.forEach(el => el.classList.remove('modal_active'));
  }));

  document.querySelectorAll('.modal').forEach(el => el.addEventListener('mousedown', (item) => {
    if (item.target.classList.contains('modal_active')) {
      item.target.classList.remove('modal_active');
      // window.location.assign(window.location.origin);
    }
  }));

  document.querySelectorAll('.modal__add-contact').forEach(el => el.addEventListener('click', (event) => {
    if (event.currentTarget.parentNode.querySelectorAll('.contact-wrapper').length < 10) {
      event.currentTarget.before(createContactInput());
    }
  }));

  function createContactInput(contactType = '', contactValue = '') {
    const divContact = document.createElement('div');
    divContact.classList.add('contact-wrapper');

    const contactSelect = document.createElement('select');
    contactSelect.classList.add('modal__select');
    const optName = ['Телефон', 'Доп. телефон', 'Email', 'Vk', 'Facebook'];
    for (let item of optName) {
      const opt = document.createElement('option');
      opt.addEventListener
      opt.textContent = item;
      opt.value = item;
      contactSelect.append(opt);
    }

    contactSelect.addEventListener('change', () => {
      contactTypeChecker(contactSelect);
    })
    divContact.append(contactSelect);

    const contactInput = document.createElement('input');
    contactInput.placeholder = 'Введите данные контакта';
    if (contactValue !== '') {
      contactInput.value = contactValue;
    }
    contactInput.classList.add('modal__contact-input', 'modal__contact-input_full');
    contactInput.addEventListener('input', () => {
      if (contactInput.classList.contains('_error')) {
        contactInput.classList.remove('_error');
      }
    });
    divContact.append(contactInput);


    const deleteButton = document.createElement('button');
    deleteButton.addEventListener('click', (event) => {
      event.currentTarget.parentNode.remove();
    })
    deleteButton.classList.add('modal__delete-button');
    const svgDelete = document.createElement('svg');
    svgDelete.innerHTML = '<svg width="16" height="16" viewbox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#B0B0B0" /> </svg>'
    deleteButton.append(svgDelete);
    divContact.append(deleteButton);

    if (contactType !== '') {
      contactSelect.value = contactType;
      contactTypeChecker(contactSelect);
    } else {
      contactSelect.value = 'Телефон';
      contactSelect.parentNode.querySelector('.modal__contact-input').type = 'tel';
    }

    return divContact;
  }

  function clearContactsInput() {
    editModal.querySelectorAll('.contact-wrapper').forEach(el => el.remove());
  }

  //сортировки

  idBtn.addEventListener('click', () => {
    if (idBtn.classList.contains('active')) {
      clientsArray.reverse();
      clearClientTable();
      fillClientsTableFromArray(clientsArray);
      idBtn.classList.remove('active');
    } else {
      clientsArray.sort((a, b) => {
        return a.id - b.id;
      })
      clearClientTable();
      fillClientsTableFromArray(clientsArray);
      sortBtns.forEach(el => el.classList.remove('active'));
      idBtn.classList.add('active');
    }
  });

  fioBtn.addEventListener('click', () => {
    if (fioBtn.classList.contains('active')) {
      clientsArray.reverse();
      clearClientTable();
      fillClientsTableFromArray(clientsArray);
      fioBtn.classList.remove('active');
    } else {
      clientsArray.sort((a, b) => {
        if (a.surname !== b.surname) {
          return a.surname > b.surname ? 1 : -1;
        } else if (a.name !== b.name) {
          return a.name > b.name ? 1 : -1;
        } else if (a.lastName !== b.lastName) {
          return a.lastName > b.lastName ? 1 : -1;
        }
      })
      clearClientTable();
      fillClientsTableFromArray(clientsArray);
      sortBtns.forEach(el => el.classList.remove('active'));
      fioBtn.classList.add('active');
    }
  });

  creationBtn.addEventListener('click', () => {
    if (creationBtn.classList.contains('active')) {
      clientsArray.reverse();
      clearClientTable();
      fillClientsTableFromArray(clientsArray);
      creationBtn.classList.remove('active');
    } else {
      clientsArray.sort((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1);
      clearClientTable();
      fillClientsTableFromArray(clientsArray);
      sortBtns.forEach(el => el.classList.remove('active'));
      creationBtn.classList.add('active');
    }
  });

  changesBtn.addEventListener('click', () => {
    if (changesBtn.classList.contains('active')) {
      clientsArray.reverse();
      clearClientTable();
      fillClientsTableFromArray(clientsArray);
      changesBtn.classList.remove('active');
    } else {
      clientsArray.sort((a, b) => new Date(a.updatedAt) > new Date(b.updatedAt) ? 1 : -1);
      clearClientTable();
      fillClientsTableFromArray(clientsArray);
      sortBtns.forEach(el => el.classList.remove('active'));
      changesBtn.classList.add('active');
    }
  });

  //Поиск

  headerInput.addEventListener('input', debounce(async () => {
    // await fillClientsTableFromServer();
    // clearClientTable();
    document.querySelectorAll('.header__search-results-item').forEach(el => el.remove());
    const searchResults = document.querySelector('.header__search-results');
    const clientArray = clientsArray.filter((el) => {
      const fio = `${el.surname} ${el.name} ${el.lastName}`;
      if (fio.toLowerCase().includes(headerInput.value.toLowerCase().trim())) {
        return el;
      }
    });
    let iteration = 0;
    clientArray.forEach(el => {
      if (iteration < 8) {
        const resultItem = document.createElement('li');
        resultItem.classList.add('header__search-results-item');
        const resultBtn = document.createElement('button');
        resultBtn.classList.add('header__search-results-btn');
        resultBtn.textContent = `${el.surname} ${el.name} ${el.lastName}`;
        resultBtn.addEventListener('click', () => {
          document.querySelectorAll('.td-id').forEach(element => {
            if (element.textContent === el.id) {
              element.scrollIntoView({ block: "center", behavior: "smooth" });
              const elArr = element.closest('.content__tr').querySelectorAll('.content__td');
              elArr.forEach(el => el.style.backgroundColor = '#dddddd');
              setTimeout(() => {
                element.closest('.content__tr').querySelectorAll('.content__td').forEach(el => el.style.backgroundColor = '#fff');
              }, 1200)
              searchResults.classList.remove('header__search-results_active');
            }
          })
        });
        resultItem.append(resultBtn);
        searchResults.append(resultItem);
      }
      iteration += 1;
    })
    if (clientArray.length > 0 && headerInput.value.trim() != '') {
      searchResults.classList.add('header__search-results_active');
    } else {
      searchResults.classList.remove('header__search-results_active');
    }
    // fillClientsTableFromArray(clientsArray);
  }, 300));

  headerInput.addEventListener('click', () => {
    if (headerInput.value.trim() != '') {
      const searchResultList = document.querySelector('.header__search-results');
      searchResultList.classList.add('header__search-results_active');
    }
  })

  function debounce(func, ms) {
    let timeout;
    return function () {
      const fnCall = () => { func.apply(this, arguments) }
      clearTimeout(timeout);
      timeout = setTimeout(fnCall, ms)
    }
  };

  //Валидация

  function formValidate(form, btn) {
    btn.parentNode.querySelectorAll('.error-message').forEach(el => el.remove());
    let error = 0;
    let contactError = 0;
    const formReq = form.querySelectorAll('._req');

    for (let index = 0; index < formReq.length; index++) {
      const input = formReq[index];
      formRemoveError(input);

      if (input.value.trim() === '') {
        if (input.classList.contains('_name')) {
          formAddError(input);
          btn.before(createErrorMessage('Заполните поле "Имя"'));
          error++;
        } else if (input.classList.contains('_surname')) {
          formAddError(input);
          btn.before(createErrorMessage('Заполните поле "Фамилия"'));
          error++;
        }
      }
    }

    const contacts = form.parentNode.parentNode.querySelectorAll('.modal__contact-input');
    const numbers = '0123456789';
    for (let contact of contacts) {
      if (contact.value.trim() === '') {
        formAddError(contact);
        contactError++;
      }

      switch (contact.type) {
        case 'tel':
          for (let num of contact.value) {
            if (!numbers.includes(num)) {
              formAddError(contact);
              contactError++;
              break;
            }
          }
          break;

        case 'email':
          if (!contact.value.includes('@') || !contact.value.includes('.')) {
            formAddError(contact);
            contactError++;
            break;
          }
          break;

        case 'text':
          const select = contact.parentNode.querySelector('.modal__select').value;
          if (select === 'Vk') {
            if (!contact.value.includes('vk.com/')) {
              formAddError(contact);
              contactError++;
              break;
            }
          }
          else { // === Facebook
            if (!contact.value.includes('facebook.com/')) {
              formAddError(contact);
              contactError++;
              break;
            }
          }
          break;
      }
    }
    if (contactError > 0) {
      btn.before(createErrorMessage('Заполните все контакты корректно'));
    }

    const validationResult = {
      fullNameError: error,
      contactsError: contactError
    }


    return validationResult;
  }

  function formAddError(input) {
    input.classList.add('_error');
  }

  function formRemoveError(input) {
    input.classList.remove('_error');
  }

  function createErrorMessage(text) {
    const span = document.createElement('span');
    span.classList.add('error-message');
    span.textContent = text;
    return span;
  }

  document.querySelectorAll('.modal__input').forEach(el => el.addEventListener('input', () => {
    if (el.classList.contains('_error')) {
      el.classList.remove('_error');
    }
  }));

  function contactTypeChecker(select) {
    const numbers = '0123456789';
    const curInput = select.parentNode.querySelector('.modal__contact-input');
    switch (select.value) {
      case 'Телефон':
      case 'Доп. Телефон':
        curInput.type = 'tel';
        break;
      case 'Email':
        curInput.type = 'email';
        break;
      case 'Vk':
        curInput.type = 'text';
        curInput.value = 'vk.com/';
        break;
      case 'Facebook':
        curInput.type = 'text';
        curInput.value = 'facebook.com/';
        break;
    }
  }

  window.addEventListener("load", async () => {
    const hash = window.location.hash;
    if (hash != '') {
      editModal.querySelector('.modal__content').classList.add('_sending');
      const client = await getClientFromServerById(hash.slice(1));
      if (client.message != 'Client Not Found') editModal.querySelector('.modal__content').classList.remove('_sending');

      currentClientId = client.id;
      editModal.classList.add('modal_active');
      editModal.querySelector('.modal__span').textContent = `ID: ${client.id}`;

      const arrEditInputs = editModal.querySelectorAll('.modal__input');
      arrEditInputs[0].value = client.surname;
      arrEditInputs[1].value = client.name;
      arrEditInputs[2].value = client.lastName;

      const arrContacts = client.contacts;
      for (let item of arrContacts) {
        editModal.querySelector('.modal__add-contact').before(createContactInput(item.type, item.value));
      }

    }
  });

  window.addEventListener('click', (el) => {
    const searchResultList = document.querySelector('.header__search-results_active');
    if (el.target.closest('.header__search-results_active') === null && searchResultList != null && el.target != headerInput) {
      searchResultList.classList.remove('header__search-results_active');
    }
  })

  let curResultBtn = null;
  window.addEventListener('keydown', (el) => {
    if (document.querySelector('.header__search-results').classList.contains('header__search-results_active')) {
      const resultBtnArr = document.querySelectorAll('.header__search-results-btn');
      if (el.key === 'ArrowDown') {
        if (curResultBtn === null || curResultBtn + 1 >= resultBtnArr.length) {
          curResultBtn = 0;
        } else {
          curResultBtn++;
        }
        resultBtnArr[curResultBtn].focus();
      } else if (el.key === 'ArrowUp') {
        if (curResultBtn === null || curResultBtn - 1 < 0) {
          curResultBtn = resultBtnArr.length - 1;
        } else {
          curResultBtn--;
        }
        resultBtnArr[curResultBtn].focus();
      }
    }
  })




})
