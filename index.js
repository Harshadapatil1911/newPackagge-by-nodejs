const fs = require('fs');
const path = require('path');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const tasksFilePath = path.join(__dirname, 'tasks.txt');

function loadTasks() {
  try {
    const data = fs.readFileSync(tasksFilePath, 'utf8');
    return data.split('\n').map(task => task.trim()); // Remove leading/trailing whitespace
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('No tasks file found. Creating a new one...');
      return [];
    } else {
      console.error('Error loading tasks:', err);
      process.exit(1);
    }
  }
}

function saveTasks(tasks) {
  try {
    fs.writeFileSync(tasksFilePath, tasks.join('\n'), 'utf8');
  } catch (err) {
    console.error('Error saving tasks:', err);
    process.exit(1);
  }
}

function displayTasks(tasks) {
  if (tasks.length === 0) {
    console.log('No tasks found.');
  } else {
    console.log('\nYour Tasks:');
    tasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task}`);
    });
  }
}

function addTask(task) {
  const tasks = loadTasks();
  tasks.push(task);
  saveTasks(tasks);
  console.log('Task added successfully!');
}

function markTaskComplete(taskIndex) {
  const tasks = loadTasks();
  if (taskIndex < 1 || taskIndex > tasks.length) {
    console.error('Invalid task index. Please enter a valid index (1 to', tasks.length, ')');
    readline.question('Enter the index of the task to mark complete: ', (newIndex) => {
      markTaskComplete(parseInt(newIndex)); // Recursive call with the new input
    });
    return; // Exit the current call after prompting for a new index
  }

  tasks[taskIndex - 1] = `[COMPLETED] ${tasks[taskIndex - 1]}`; // Mark task as completed
  saveTasks(tasks);
  console.log('Task marked as completed.');
}

function removeTask(taskIndex) {
  const tasks = loadTasks();
  if (taskIndex < 1 || taskIndex > tasks.length) {
    console.error('Invalid task index.');
    return;
  }

  tasks.splice(taskIndex - 1, 1); // Remove task from the array
  saveTasks(tasks);
  console.log('Task removed successfully.');
}

function mainMenu() {
  console.log('\nTask Manager');
  console.log('1. View Tasks');
  console.log('2. Add Task');
  console.log('3. Mark Task Complete');
  console.log('4. Remove Task');
  console.log('5. Exit');

  readline.question('Enter your choice: ', (choice) => {
    switch (choice) {
      case '1':
        displayTasks(loadTasks());
        mainMenu();
        break;
      case '2':
        readline.question('Enter a new task: ', (task) => {
          addTask(task);
          mainMenu();
        });
        break;
      case '3':
        displayTasks(loadTasks());
        readline.question('Enter the index of the task to mark complete: ', (index) => {
          markTaskComplete(parseInt(index));
          mainMenu();
        });
        break;
      case '4':
        displayTasks(loadTasks());
        readline.question('Enter the index of the task to remove: ', (index) => {
          removeTask(parseInt(index));
          mainMenu();
        });
        break;
      case '5':
        readline.close();
        console.log('Exiting Task Manager...');
        break;
      default:
        console.error('Invalid choice.');
        mainMenu();
    }
  });
}

// Start the program
mainMenu();
