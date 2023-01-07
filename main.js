todos = JSON.parse(localStorage.getItem('todos')) || [];
const nameInput = document.querySelector('#name');
const newTodoForm = document.querySelector('#new-todo-form');
const addBtn = document.querySelector('#add-btn');
	
const username = localStorage.getItem('username') || '';

nameInput.value = username;

nameInput.addEventListener('change', (e) => {
		localStorage.setItem('username', e.target.value);
	})

addBtn.addEventListener('submit', e => {
	e.preventDefault();
		
	const todo = {
		content: e.target.elements.content.value,
		category: e.target.elements.category.value,
		done: false,
		createdAt: new Date().getTime()
		} 
	if (todo.category == "")
	{
		alert("You need to select one category");
		return;
	} else {
		todos.push(todo);
		localStorage.setItem('todos', JSON.stringify(todos));

	// Reset the form
	e.target.reset();

	DisplayTodos()
	}
	
})

const todoInput = document.querySelector('#content');
const speakBtn = document.querySelector('.speak');

speakBtn.addEventListener('click', (e)=>{
	e.preventDefault();
	window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

	todos = JSON.parse(localStorage.getItem('todos')) || [];
	const todoItem = document.querySelector('.todo-item');
	
	  const recognition = new SpeechRecognition();
	  recognition.interimResults = false;
	  recognition.lang = 'pt-Br'
	  //recognition.lang = 'en-Us'
	
	  recognition.addEventListener('result', e => {
		const transcript = Array.from(e.results)
		  .map(result => result[0])
		  .map(result => result.transcript)
		  .join('');
		
	  	if (e.results[0].isFinal) {
			todoInput.value = transcript;
	  	}

	  	if (transcript.startsWith("feito")) {
			const reducedTransc = transcript.slice(5);
			const trimTransc = reducedTransc.trim();
			//console.log(trimTransc, "trimTransc")
			todos.forEach(todo => {
				if(todo.content == trimTransc){
					todo.done = true
					todoItem.classList.add('done')
					localStorage.setItem('todos', JSON.stringify(todos));
					todoInput.value = "";
					
					DisplayTodos();
					
				}
			})
		} else if(transcript.startsWith("criar pessoal")) {
			document.getElementById('category2').checked = true;
			
			const reducedTransc = transcript.slice(13);
			const trimTransc = reducedTransc.trim();
			todoInput.value = trimTransc;
			
			todo = {content: todoInput.value, category: "personal", done: false, createdAt: new Date().getTime()};
			
			newTodoForm.addEventListener('change', ()=>{
				todo = {content: todoInput.value, category: "personal", done: false, createdAt: new Date().getTime()};
			});
			addBtn.addEventListener('click', ()=>{
				todos.push(todo);
				localStorage.setItem('todos', JSON.stringify(todos));
				todoInput.value="";
			});
			DisplayTodos();
			
		}else if(transcript.startsWith("criar trabalho")){
			document.getElementById('category1').checked = true;
			
			const reducedTransc = transcript.slice(14);
			const trimTransc = reducedTransc.trim();
			/* console.log(reducedTransc);
			console.log(trimTransc); */
			todoInput.value = trimTransc;
			todo = {content: todoInput.value, category: "business", done: false, createdAt: new Date().getTime()};
			newTodoForm.addEventListener('change', ()=>{
				todo = {content: todoInput.value, category: "business", done: false, createdAt: new Date().getTime()};
			});
			addBtn.addEventListener('click', ()=>{
				todos.push(todo);
				localStorage.setItem('todos', JSON.stringify(todos));
				todoInput.value="";
			});
			DisplayTodos();
		}
	  });

	  setTimeout((recognition.start()),7000);
});

DisplayTodos()

const orderCategory = document.getElementById('order-category');
orderCategory.addEventListener('click', function() {
		todos.sort((a,b)=> (a.category > b.category) ? 1 : -1);
		DisplayTodos();
});

const sortByDate = document.getElementById('sort-recent');
sortByDate.addEventListener('click', () => {
	todos.sort((b,a) => {
		let da = new Date(a.createdAt);
		db = new Date(b.createdAt);
		return da - db; });
	DisplayTodos();
})

function DisplayTodos () {
	const todoList = document.querySelector('#todo-list');
	todoList.innerHTML = "";

	todos.sort((a,b)=> a.done -b.done);

	todos.forEach(todo => {
		const todoItem = document.createElement('div');
		todoItem.classList.add('todo-item');

		const label = document.createElement('label');
		const input = document.createElement('input');
		const span = document.createElement('span');
		const content = document.createElement('div');
		const actions = document.createElement('div');
		const edit = document.createElement('button');
		const deleteButton = document.createElement('button');

		input.type = 'checkbox';
		input.checked = todo.done;
		//console.log(input.checked)
		span.classList.add('bubble');
		if (todo.category == 'personal') {
			span.classList.add('personal');
		} /* else {
			span.classList.add('business');
		} */
		content.classList.add('todo-content');
		actions.classList.add('actions');
		edit.classList.add('edit');
		deleteButton.classList.add('delete');
		let datesOutput = new Date(todo.createdAt)
		/* let stringToShow = `${todo.content}` + " was created at: " + `${datesOutput.getDate().toString()}` + 
		"/" +`${((datesOutput.getMonth())+1).toString()}`+
		"/" + `${datesOutput.getFullYear().toString()}` +
		" " + `${datesOutput.getHours().toString()}` +
		":" + `${datesOutput.getMinutes().toString()}`; */
		let stringToShow = `${todo.content}`
		content.innerHTML = `<input type="text" value="${stringToShow}" readonly>`;
		edit.innerHTML = 'Edit';
		deleteButton.innerHTML = 'Delete';

		label.appendChild(input);
		label.appendChild(span);
		actions.appendChild(edit);
		actions.appendChild(deleteButton);
		todoItem.appendChild(label);
		todoItem.appendChild(content);
		todoItem.appendChild(actions);

		todoList.appendChild(todoItem);

		if (todo.done) {
			todoItem.classList.add('done');
		}
		
		input.addEventListener('change', (e) => {
			todo.done = e.target.checked;
			localStorage.setItem('todos', JSON.stringify(todos));

			if (todo.done) {
				todoItem.classList.add('done');
			} else {
				todoItem.classList.remove('done');
			}

			DisplayTodos()

		})
		
		edit.addEventListener('click', (e) => {
			const input = content.querySelector('input');
			input.removeAttribute('readonly');
			input.focus();
			input.addEventListener('keypress', (e) => {
				if (e.key === 'Enter') {
					input.setAttribute('readonly', true);
					todo.content = e.target.value;
					localStorage.setItem('todos', JSON.stringify(todos));
					DisplayTodos()
				}
				else {
					input.addEventListener('blur', (e) => {
						input.setAttribute('readonly', true);
						todo.content = e.target.value;
						localStorage.setItem('todos', JSON.stringify(todos));
						DisplayTodos()
					})
				}

			})
		})

		deleteButton.addEventListener('click', (e) => {
			todos = todos.filter(t => t != todo);
			localStorage.setItem('todos', JSON.stringify(todos));
			DisplayTodos()
		})

	})
	let countTotalItems = JSON.parse(localStorage.getItem('todos'))
	//console.log(countTotalItems.length)
	
	let remaining = document.getElementById('remaining');
	
	let countDoneItems = JSON.parse(localStorage.getItem('todos'));
	let resultDoneItems = countDoneItems.filter(item => item.done == true);
	//console.log(resultDoneItems.length)
	remaining.innerHTML = "You have " + `${resultDoneItems.length}` + " done tasks out of a total of " + `${countDoneItems.length}` + "!";

}
