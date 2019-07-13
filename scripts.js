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

}

const activeAddAnimation = () => {
  //play add task animation
  list.lastElementChild.style.animation = 'addAnimation .7s .2s both cubic-bezier(.3, 1.31, .56, 1.91) running';

  //and round corners before added task
  const beforeLastEl = list.children[list.children.length - 2];
  if (beforeLastEl)
    beforeLastEl.style.animation = 'roundingBottomCorners .5s .2s both ease-out reverse running';

  //deleting animations
  window.setTimeout(() => [...list.children].forEach(task => task.style.animation = ''), 1000)
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

  //add task animation
  activeAddAnimation();
}

const activDeleteAnimation = (currentEl, index) => {
  const allTasks = [...list.children];
  //deleting animations
  window.setTimeout(() => allTasks.forEach(task => task.style.animation = ''), 1000)
  //add delete task animation
  currentEl.style.animation = "disapear .6s .1s  cubic-bezier(.71, -0.17, .77, .78) running";
  //add border radius animation
  if (index == 0 && allTasks[1]) {
    allTasks[1].style.borderTopLeftRadius = '10px';
    allTasks[1].style.borderTopRightRadius = '10px';
  } else if (index == 1 && !allTasks[2])
    allTasks[0].style.animation = 'roundingBottomCorners .5s .2s  ease-out running';
  else if (index == allTasks.length - 1 && allTasks[index - 1])
    allTasks[index - 1].style.animation = 'roundingBottomCorners .5s .2s  ease-out running';

  //add slide up animation after delete task
  const slideUpTasks = allTasks.filter((task, x) => x > index);

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