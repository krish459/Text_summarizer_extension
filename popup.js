document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("paste").addEventListener("click", function () {
    pasteSelection();
  });

  document
    .getElementById("summarizeButton")
    .addEventListener("click", function () {
      summarizeText();
    });
});

function pasteSelection() {
  console.log("Hello World 1");
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log("Hello World 2");

    // Manually inject the content script
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        files: ["contentScript.js"],
      },
      () => {
        if (chrome.runtime.lastError) {
          alert("It a runtime error.Please Try again later.");
          console.error(chrome.runtime.lastError.message);
        } else {
          // Send the message after the script is injected
          chrome.tabs.sendMessage(
            tabs[0].id,
            { method: "getSelection" },
            function (response) {
              if (response && response.data) {
                console.log("Hello World 3: ", response);
                var text = document.getElementById("text");
                text.innerHTML = response.data;
              } else {
                alert("Text not Selected.");
              }
            }
          );
        }
      }
    );
  });
}

function summarizeText() {
  var text = document.getElementById("text").value;
  if (text.trim() === "") {
    alert("Please paste or enter some text to summarize.");
    return;
  }
  var summary = "Krish ki summary" + text;
  document.getElementById("summary").innerText = summary;
}

// function pasteSelection() {
//   console.log("Hello World 1");
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     console.log("Hello World 2");
//     chrome.tabs.sendMessage(
//       tabs[0].id,
//       { method: "getSelection" },
//       function (response) {
//         if (chrome.runtime.lastError) {
//           console.log("Bhai error hogaya!");
//           console.error(chrome.runtime.lastError.message);
//         } else {
//           console.log("hello world 3: ", response);
//           var text = document.getElementById("text");
//           // text.innerHTML = "Krish Was here!";
//           text.innerHTML = response.data;
//         }
//       }
//     );
//   });
// }
