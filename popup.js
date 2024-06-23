import { EDEN_AI_KEY } from "./config.js";

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
  // console.log("Hello World 1");
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // console.log("Hello World 2");

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
                // console.log("Hello World 3: ", response);
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

  console.log("1");
  var apiUrl = "https://api.edenai.run/v2/text/summarize";

  console.log("2");
  var kr = fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${EDEN_AI_KEY}`,
    },
    body: JSON.stringify({
      providers: "openai,connexun",
      text: text,
      language: "en",
      output_sentences: 3,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("3");
      console.log("data: ", data.openai.result);
      var summary =
        data.openai && data.openai.result
          ? data.openai.result
          : "Could not generate summary.";
      console.log("4");
      document.getElementById("summary").innerText = summary;
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("There was an error generating the summary. Please try again.");
    });
}

// function summarizeText() {
//   var text = document.getElementById("text").value;
//   if (text.trim() === "") {
//     alert("Please paste or enter some text to summarize.");
//     return;
//   }
//   var summary = "Krish ki summary " + text;
//   document.getElementById("summary").innerText = summary;
// }
