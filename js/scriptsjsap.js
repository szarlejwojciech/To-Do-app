//DOM lelements
const form = document.querySelector('form');
const list = document.querySelector('section ul');
const tasks = (JSON.parse(localStorage.getItem('tasks'))) || [];
const tasksNumber = document.querySelector('.number-tasks');

let reg;
let running = false;

//Functions
const populateList = (items = [], list, regEx = '') => {
  const tasksHtml = items.map((item, index) => {
    return {
      html: `<li data-index="${index}">
              ${item.text}
              <button class="check ${item.check ? 'checked' : ''}" data-index="${index}"><span></span></button>
              <button class="delete" data-index="${index}"><span></span></button>
              </li>
            `,
      text: item.text
    };
  })

  list.innerHTML = tasksHtml.filter(item => item.text.toUpperCase().includes(regEx)).map(item => item.html).join('');
}

const updateTasksNumber = (el, num) => {
  const changeNumAnim = new TimelineMax();

  changeNumAnim
    .set(el.parentNode, { css: { transformStyle: "preserve-3d" } })
    .set(el, { transformOrigin: "50% 50% -10px", transformPerspective: 600, rotationX: 0, backfaceVisibility: "hidden" })
    .to(el, .4, { rotationX: 180, opacity: 0 })
    .add(() => el.textContent = num)
    .to(el, .4, { rotationX: 360, opacity: 1 })

}

const activeAddAnimation = () => {
  const addAnim = new TimelineMax();
  const lastEl = list.lastElementChild;
  const beforeLastEl = list.children[list.children.length - 2] || false;

  if (beforeLastEl) {
    addAnim
      .set(beforeLastEl, { borderBottomWidth: "3px", borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px" }, 0)
      .to(beforeLastEl, .3, { borderBottomWidth: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }, "+=.1");
  }
  addAnim
    .set(lastEl, { transformPerspective: "600", y: "-=100%", z: -100, opacity: 0 }, 0)
    .to(lastEl, .6, { y: "+=100%", z: 0, opacity: 1, ease: Back.easeOut.config(3) }, "-=.2")
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
  updateTasksNumber(tasksNumber, tasks.length);

  //add task animation
  activeAddAnimation();
}

const activDeleteAnimation = (currentEl, index) => {
  if (running) return;
  running = !running;

  const allTasks = [...list.children];
  const slideUpTasks = allTasks.filter((task, x) => x > index);
  const lastIndex = allTasks.length - 1;
  const delAnim = new TimelineMax();

  delAnim
    .to(currentEl, .5, { opacity: 0, scale: 0, ease: Back.easeIn.config(2) }, "deleteTask")
    .to(slideUpTasks, .4, { y: "-=100%", ease: Back.easeIn.config(2) }, "deleteTask+=.2");

  if (index == 0 && allTasks[1])
    delAnim.to(allTasks[1], .2, {
      borderTopLeftRadius: "10px",
      borderTopRightRadius: "10px",
      borderTopWidth: "3px",
      borderTopColor: "#e3e3e3",
      borderTopStyle: "solid"
    }, "deleteTask")
  else if (currentEl === allTasks[lastIndex] && allTasks[lastIndex - 1])
    delAnim.to(allTasks[lastIndex - 1], .2, {
      borderBottomLeftRadius: "10px",
      borderBottomRightRadius: "10px",
      borderBottomWidth: "3px",
      borderBottomColor: "#e3e3e3",
      borderBottomStyle: "solid"
    }, "deleteTask")
  delAnim.eventCallback("onComplete", () => {
    populateList(tasks, list, reg);
    running = false;
  });
}

const removeTask = e => {
  if (!(e.target.classList.contains('delete')) || running) return;

  const index = e.target.dataset.index;
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  updateTasksNumber(tasksNumber, tasks.length);
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
  const numTasks = tasks.filter((task, index) => task.text.toUpperCase().includes(reg)).length;
  updateTasksNumber(tasksNumber, numTasks);

  //searche animation
  const searchAnim = new TimelineMax();
  searchAnim
    .to(list, .3, { opacity: 0, scale: 0, ease: Power2.easeIn })
    .addCallback(() => populateList(tasks, list, reg))
    .to(list, .3, { opacity: 1, scale: 1, ease: Back.easeOut.config(1) })
}

document.addEventListener('DOMContentLoaded', () => {
  //Events listener
  form.addEventListener('submit', addTask);
  list.addEventListener('click', removeTask);
  list.addEventListener('click', checkTask);
  document.querySelector('#search-task').addEventListener('input', searchTasks)

  //tasks number on page load
  tasksNumber.textContent = tasks.length;

  //tasks on load
  populateList(tasks, list);

  //animation on entry
  const onLoadAnim = new TimelineMax();

  onLoadAnim
    .set(".wrapper, header", { y: 1000, opacity: 0 })
    .set("ul > li", { opacity: 0 })
    .staggerTo(".wrapper, header", .4, { y: 0, opacity: 1 }, .2)
    .staggerFromTo("ul>li", .5, { cycle: { x: [-600, 600], rotationZ: [20, -20] }, y: 40 }, { opacity: 1, x: 0, rotationZ: 0, y: 0, cycle: {} }, .2, "+=.2")
    .addLabel("buttons", "-=.5")
    .staggerFromTo(".check", .2, { scale: 0 }, { scale: 1, ease: Back.easeOut.config(1, 0.4) }, .1, "buttons")
    .staggerFromTo(".delete", .2, { scale: 0 }, { scale: 1, ease: Back.easeOut.config(1, 0.4) }, .1, "buttons")
    .timeScale(1.5);
})