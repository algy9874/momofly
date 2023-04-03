import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDUabwSyDWNuElAFz1HhXf7iK5gmdO0RpA",
  authDomain: "fyp-project-system.firebaseapp.com",
  projectId: "fyp-project-system",
  storageBucket: "fyp-project-system.appspot.com",
  messagingSenderId: "965001890741",
  appId: "1:965001890741:web:251834f33f9adffaa267fc",
  measurementId: "G-20PLP5P9NL"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const submitButton = document.getElementById("submit");
const signupButton = document.getElementById("sign-up");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const main = document.getElementById("main");
const createacct = document.getElementById("create-acct")

const signupEmailIn = document.getElementById("email-signup");
const confirmSignupEmailIn = document.getElementById("confirm-email-signup");
const signupPasswordIn = document.getElementById("password-signup");
const confirmSignUpPasswordIn = document.getElementById("confirm-password-signup");
const createacctbtn = document.getElementById("create-acct-btn");

const returnBtn = document.getElementById("return-btn");
const gobackBtn = document.getElementById("goback-btn");

var email, password, signupEmail, signupPassword, confirmSignupEmail, confirmSignUpPassword;


createacctbtn.addEventListener("click", function() {
  var isVerified = true;

  signupEmail = signupEmailIn.value;
  confirmSignupEmail = confirmSignupEmailIn.value;
  if(signupEmail != confirmSignupEmail) {
      createAccountFailMsg("電子郵件不匹配。 再試一次。");
      // window.alert()
      isVerified = false;
  }

  signupPassword = signupPasswordIn.value;
  confirmSignUpPassword = confirmSignUpPasswordIn.value;
  if(signupPassword != confirmSignUpPassword) {
      createAccountFailMsg("密碼不匹配。 再試一次。")
      isVerified = false;
  }
  
  if((signupEmail == null || confirmSignupEmail == null || signupPassword == null || confirmSignUpPassword == null)
  ||(signupEmail.length == 0 || confirmSignupEmail.length == 0  || signupPassword.length == 0  || confirmSignUpPassword.length == 0 )) {
    createAccountFailMsg("請填寫所有必填字段。");
    isVerified = false;
  }

  if(isVerified) {
    createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
      .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
      // createAccountFailMsg("成功！ 帳戶已創建。");
      window.history.go(-1);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      // console.log(errorCode)
      // if(errorCode=="auth/weak-password"){
      //   createAccountFailMsg("密碼最少要有6個字符" );
      // }else if(errorCode=="auth/invalid-email"){
      //   createAccountFailMsg("該電子郵件無效" );
      // }
      createAccountFailMsg("發生了錯誤。 再試一次。");
    });
  }
});

submitButton.addEventListener("click", function() {
  email = emailInput.value;
  password = passwordInput.value;
  loginFailMsg(-1);
  //加載動畫
  var delay = 500;
  setLoading(delay);
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      //登入成功
        setUserRecord(user.uid, emailInput.value);
        displayLoginSuccessBox();
        window.location.href="index.html"; 
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // console.log("發生了錯誤。 再試一次。");
      // window.alert("發生了錯誤。 再試一次。");
      if(email.length==0){
        loginFailMsg(1);
      }else if(password.length==0){
        loginFailMsg(2);
      }else{
        loginFailMsg(0);
      }
    });
});

signupButton.addEventListener("click", function() {
    main.style.display = "none";
    createacct.style.display = "block";
});

returnBtn.addEventListener("click", function() {
    main.style.display = "block";
    createacct.style.display = "none";
});
gobackBtn.addEventListener("click", function() {
  window.location.href="index.html"; 
});
function setLoading(delayTime){
  $("#preloder").css("display","block");
  $(".loader").css("display","block");
  $(".loader").delay(delayTime-200).fadeOut("fast");
  $("#preloder").delay(delayTime).fadeOut("slow");
}
function loginFailMsg(messageType){
  var msgText = "電郵地址或密碼錯誤, 請重新輸入";
  if(messageType == 1){msgText = "請輸入電郵地址";}
  else if(messageType == 2){msgText = "請輸入密碼";}
  else if(messageType == -1){msgText = "";}
  $("#login-fail-msg").text(msgText).css("visibility","visible");
}
function createAccountFailMsg(msgText){
  $("#create-account-fail-msg").text(msgText).css("visibility","visible");
}
function displayLoginSuccessBox(){
  localStorage.setItem("showLoginSuccessBox",true);
}

function setUserRecord(uid, email){
  localStorage.setItem("fyp-user-id", uid);
  localStorage.setItem("fyp-email", email);

}
// function completeLength(text, text2){
//   if(text.length > text2.length)
//     return text.length
//   else
//     return text2.length
// }
