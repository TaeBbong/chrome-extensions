chrome.runtime.sendMessage(
  {
    message: "userStatus",
  },
  (response) => {
    if (response.message === "success") {
      console.log("로그인 성공");
    } else if (response.message === "login") {
      console.log("로그인하세요");
      window.location.href = "google.com";
    }
  }
);
