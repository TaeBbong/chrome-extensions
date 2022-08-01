chrome.runtime.onInstalled.addListener(function () {
  chrome.action.disable();
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostSuffix: "github.com" },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "userStatus") {
    isLogedIn(sendResponse);
    return true;
  }
});

function isLogedIn(sendResponse) {
  chrome.storage.local.get(["userStatus"], (response) => {
    const error = chrome.runtime.lastError;
    if (error) console.log(error);

    if (!response.userStatus) {
      sendResponse({ message: "login" });
    } else {
      sendResponse({ message: "success" });
    }
  });
}

async function getAuth(userInfo, sendResponse) {
  const params = {
    email: userInfo.email,
    password: userInfo.pwd,
  };
  const response = await fetch("yourUrl", {
    method: "POST",
    body: JSON.stringify(params),
    headers: { "Content-Type": "application/json" },
  });
  if (response.status !== 200) {
    sendResponse("fail");
  } else {
    const result = await response.json();
    chrome.storage.local.set(
      {
        userStatus: result.userStatus,
      },
      (res) => {
        if (chrome.runtime.lastError) sendResponse("fail");
        sendResponse("success");
      }
    );
  }
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "userStatus") {
    isLogedIn(sendResponse);
    return true;
  } else if (request.message === "login") {
    getAuth(request.payload, sendResponse);
    return true;
  }
});
