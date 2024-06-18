// Add event listener for receiving messages from the extension
console.log("Content script loaded");
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Check if the message is requesting text selection
  if (request.method === "getSelection") {
    console.log("getSelection chal gaya!");

    // Retrieve the selected text
    var selectedText = window.getSelection().toString().trim();
    console.log("Selected text:", selectedText);

    // Send the selected text back to the extension
    sendResponse({ data: selectedText });
  }
});
