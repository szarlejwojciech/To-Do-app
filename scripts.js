//DOM lelements
const form = document.querySelector('form');
const list = document.querySelector('section ul');
const tasks = (JSON.parse(localStorage.getItem('tasks'))) || [];
const tasksNumber = document.querySelector('.number-tasks');

let reg;


//Functions
const populateList = (items = [], list, regEx = '') => {
  const tasksHtml = items.map((item, index) => {
    return {
      html: `<li data-index="${index}">
              ${item.text}
              <button class="check ${item.check?'checked':''}" data-index="${index}"><span></span></button>
              <button class="delete" data-index="${index}"><span></span></button>
              </li>
            `,
      text: item.text
    };
  })

  list.innerHTML = tasksHtml.filter(item => item.text.toUpperCase().includes(regEx)).map(item => item.html).join('');

  console.log(tasksHtml);
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
    check: false
  };

  tasks.push(task);

  localStorage.setItem('tasks', JSON.stringify(tasks));
  populateList(tasks, list);

  input.value = '';
  tasksNumber.textContent = tasks.length;

}

const activDeleteAnimation = (currentEl, index) => {
  console.log([currentEl]);

  currentEl.style.animation = "disapear .6s .1s both cubic-bezier(.71, -0.17, .77, .78) running";

  //round corners transition
  const firstEl = list.children[1];

  if (index == 0 && firstEl)
    firstEl.style.borderRadius = '10px 10px 0 0';
  else if (currentEl === list.lastElementChild) {

    const beforeLastEl = list.children[index - 1];

    beforeLastEl.style.borderRadius = '0 0 10px 10px';
    beforeLastEl.style.borderBottom = '3px #e1e1e1 solid';
  };

  //slide up animation after delete tasks
  const slideUpTasks = document.querySelectorAll(`li:nth-of-type(${index * 1 + 1})~li`);

  slideUpTasks.forEach((el, x) => {
    el.style.animationPlayState = 'paused';
    el.style.animation = "moveUp .3s both cubic-bezier(.39, .85, .68, .8) running";
    el.style.animationDelay = `${.4 + x / 30}s`;
  });
  //populate list after animation
  if (slideUpTasks.length)
    slideUpTasks[slideUpTasks.length - 1].addEventListener('animationend', () => populateList(tasks, list, reg));
  else
    currentEl.addEventListener('animationend', () => populateList(tasks, list, reg));
}

const removeTask = e => {
  if (!(e.target.classList.contains('delete'))) return;

  const index = e.target.dataset.index;

  tasks.splice(index, 1);
  tasksNumber.textContent = tasks.length;

  localStorage.setItem('tasks', JSON.stringify(tasks));

  //deleting animation
  activDeleteAnimation(e.target.parentNode, index);

  // window.setTimeout(() => populateList(tasks, list, reg), 2000);
}

const checkTask = e => {
  if (!(e.target.classList.contains('check'))) return;
  const index = e.target.dataset.index;

  tasks[index].check = !tasks[index].check;
  localStorage.setItem('tasks', JSON.stringify(tasks));

  populateList(tasks, list, reg);
}

const searchTasks = e => {
  reg = e.target.value.toUpperCase();
  tasksNumber.textContent = tasks.filter((task, index) => task.text.toUpperCase().includes(reg)).length;

  populateList(tasks, list, reg);
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