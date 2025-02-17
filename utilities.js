function LiveWrite(text, element_class, speed, delay) {
  return new Promise((resolve, reject) => {
    let element = document.querySelector(`${element_class}`);
    if (element != null) {
      let index = 0;
      let milli_speed = speed * 100;
      let milli_delay = delay * 1000;
      let writtenText = "";

      setTimeout(() => {
        let liveWriting = setInterval(() => {
          writtenText += text[index];
          index++;
          if (text.length === index) {
            clearInterval(liveWriting);
            element.innerHTML = writtenText;
            resolve(); // Resolve the Promise when done
          } else {
            element.innerHTML = writtenText + "●";
          }
        }, milli_speed);
      }, milli_delay);
    } else {
      // reject(new Error("Element not found"))
    }
  });
}

function displayLogoAtCenter(imageUrl, durationInSeconds, delay) {
  setTimeout(() => {
    const imgElement = document.createElement("img");

    imgElement.src = imageUrl;

    imgElement.style.position = "fixed";
    imgElement.style.top = "50%";
    imgElement.style.left = "50%";
    imgElement.style.transform = "translate(-50%, -50%)";
    imgElement.style.zIndex = "1000";
    imgElement.style.maxWidth = "20vw";
    imgElement.style.maxHeight = "20vh";

    imgElement.style.opacity = "0";
    imgElement.style.transition = "opacity 2s ease-in-out";

    document.body.appendChild(imgElement);

    setTimeout(() => {
      imgElement.style.opacity = "1";
    }, 10);

    setTimeout(() => {
      imgElement.style.opacity = "0";
      setTimeout(() => {
        imgElement.remove();
      }, 2000);
    }, durationInSeconds * 1000);
  }, delay * 1000);
}

async function initiateTask(prompt, data) {
  const mainModelResult = await Volatile.sendMessage(`
          @ FYI (Important),
          - Today, date: ${date_a},
          - Now, time: ${time_a},
          - Response format should only be bullet points
          - Response should contain two parts: Event and Result
          - Be accurate when providing dates (eg: Check if the deadline is passed)

          @ Your task,
          - ${prompt}

          @ Data from user,
          - ${data}
          
          @ Restrictions,
          - When writing html code, don't mention the title like HTML, just write the code without programming language title.
      `);

  const response = await mainModelResult.response;
  const responseText = (await response.text()).replace(/[*_~`]/g, "").trim();
  return responseText;
}

function addSection(sectionName) {
  isZero = false;
  foundation.innerHTML += `<div class="newSection"> ${sectionName} </div>`;
}

async function addTask(objective, userData) {
  let currentID = idCount;
  foundation.innerHTML += `<pre class="taskTitle"> Task ${currentID} </pre>`;
  foundation.innerHTML += `<pre class="newTask newTask-${currentID}"> Loading </pre>`;
  idCount++;

  let output = await initiateTask(objective, userData);
  LiveWrite(output, `.newTask-${currentID}`, 0.1, 0);
}

function checkTasks() {
  if (isZero) {
    foundation.innerHTML += `<div style="width: 100%; height: 100%; justify-content: center; align-items: center; display: flex; margin-top: 115px;"> No tasks have been initiated. </div>`;
  }
}

function checkInternetConnection() {
  window.onload = function () {
    if (!navigator.onLine) {
      alert("No internet connection.");
      window.close();
    }
  };
}
