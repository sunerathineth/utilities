import { LiveWrite } from 'https://cdn.jsdelivr.net/gh/sunerathineth/utilities/Utilities.js'
import { askAI } from 'https://cdn.jsdelivr.net/gh/sunerathineth/utilities/ProgramMetaAssist/MetaAssist_TunedAI.js'

// Global variables

let prompt
let sectionName
let objective
let data
let output
let idCount = 0
let isZero = true
let taskData = {}

// Functions

async function initiateTask(prompt, data) {
    const responseText = await askAI(prompt, data)
    return responseText
}

export function addSection(sectionName, container) {
    isZero = false;
    container.insertAdjacentHTML("beforeend", `<div class="newSection"> ${sectionName} </div>`);
}

export function addTask(objective, userData, container) {
    let taskID = Object.keys(taskData).length + 1
    taskData[taskID] = userData

    let currentID = idCount;
    const taskHTML = `
        <div class="taskContainer">
            <pre class="taskTitle"> Task ${currentID} </pre>
            <button class="askBtn" onclick="toggleDropdown(${currentID})">Ask a Question</button>
            <div class="dropdownPanel" id="dropdown-${currentID}">
                <input type="text" class="questionInput" id="question-${currentID}" placeholder="Ask a question...">
                <br><button class="submitBtn" onclick="askQuestion(${currentID})">Submit</button>
                <div class="responseBox" id="response-${currentID}"></div>
            </div>
            <pre class="newTask newTask-${currentID}"> Loading: 0.000s </pre>
        </div>
    `;
    
    container.insertAdjacentHTML("beforeend", taskHTML);
    idCount++;

    let taskElement = container.querySelector(`.newTask-${currentID}`);
    let startTime = performance.now();
    
    let timerInterval = setInterval(() => {
        let elapsedTime = performance.now() - startTime;
        let formattedTime = (elapsedTime / 1000).toFixed(3);
        if (taskElement) {
            taskElement.innerText = `Loading: ${formattedTime}s`;
        }
    }, 10);

    initiateTask(objective, userData).then(output => {
        clearInterval(timerInterval);
        let finalTime = ((performance.now() - startTime) / 1000).toFixed(3);
        if (taskElement) {
            taskElement.innerText = `Completed in ${finalTime}s`;
        }
        LiveWrite({
            text: output,
            selector: `.newTask-${currentID}`,
            speed: 0.05,
            delay: 0
        });
    });
}

function toggleDropdown(taskID) {
    let dropdown = document.getElementById(`dropdown-${taskID}`);
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";

    let questionInput = document.getElementById(`question-${taskID}`);
    questionInput.focus()
}

window.toggleDropdown = toggleDropdown;

async function askQuestion(taskID) {
    let questionInput = document.getElementById(`question-${taskID}`);
    let responseBox = document.getElementById(`response-${taskID}`);
    let question = questionInput.value.trim();

    if (!question) return;

    responseBox.innerText = "Thinking...";

    let taskInfo = taskData[taskID] || "";

    const output = await askAI(question, taskInfo);

    LiveWrite({
        text: output,
        selector: `#response-${taskID}`,
        speed: 0.05,
        delay: 0
    });
}

window.askQuestion = askQuestion;

export function CheckTasks(container) {
  if (isZero) {
    container.innerHTML += `<div style="width: 100%; height: 100%; justify-content: center; align-items: center; display: flex; margin-top: 115px;"> No tasks have been initiated. </div>`;
  }
}
