//DOM lelements
const form = document.querySelector('form');
const list = document.querySelector('section ul');
const tasks = (JSON.parse(localStorage.getItem('tasks'))) || [];
const tasksNumber = document.querySelector('.number-tasks');
//Functions
const populateList = (items = [], list) => {
  list.innerHTML = items.map((item, index) => {
    return `
    <li data-index="${index}">
      ${item.text}
      <button class="check ${item.check?'checked':''}" data-index="${index}"><span></span></button>
      <button class="delete" data-index="${index}"><span></span></button>
    </li>
  `;
  }).join('');

  console.log(items);
}

const addTask = e => {
  e.preventDefault();

  const input = e.target.querySelector('input');

  if (!input.value.trim()) {
    input.value = '';
    return;
  }

  const task = {
    text: input.value.trim(),
    check: false,
    indexOf: tasks.length
  };

  tasks.push(task);

  localStorage.setItem('tasks', JSON.stringify(tasks));
  populateList(tasks, list);

  input.value = '';
  tasksNumber.textContent = tasks.length;

}

const removeTask = e => {
  if (!(e.target.classList.contains('delete'))) return;

  const index = e.target.dataset.index;

  tasks.splice(index, 1);
  tasksNumber.textContent = tasks.length;

  localStorage.setItem('tasks', JSON.stringify(tasks));
  populateList(tasks, list);
}

const checkTask = e => {
  if (!(e.target.classList.contains('check'))) return;
  const index = e.target.dataset.index;

  tasks[index].check = !tasks[index].check;
  localStorage.setItem('tasks', JSON.stringify(tasks));

  populateList(tasks, list);
}

const searchTasks = e => {
  const reg = e.target.value.toUpperCase();
  const searchedList = tasks.filter((task, index) => task.text.toUpperCase().includes(reg)).map(item => `<li>${item.text}</li>`);

  reg ? list.innerHTML = searchedList.join('') : populateList(tasks, list);

  tasksNumber.textContent = searchedList.length;

}

//Events listener
form.addEventListener('submit', addTask);
list.addEventListener('click', removeTask);
list.addEventListener('click', checkTask);
document.querySelector('#search-task').addEventListener('input', searchTasks)

//tasks number on page load
tasksNumber.textContent = tasks.length;

//tasks on load
populateList(tasks, list);