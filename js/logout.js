import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

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


window.addEventListener('load', function() {
    setTimeout(autoSignOut, 100); 
  });

$(document).on("click","#sign-out",function(){toSignOut();})

function toSignOut(){
    signOut(auth).then(() => {
        localStorage.removeItem("fyp-user-id");
        localStorage.removeItem("fyp-email");
    }).catch((error) => {
    
    });

}
function autoSignOut(){
    if((localStorage.getItem("fyp-email")==null||localStorage.getItem("fyp-user-id")==null)&&window.location.pathname=="/index.html"){
        toSignOut();
        setAccountStatus(false)
    }
    else if((localStorage.getItem("fyp-email")==null||localStorage.getItem("fyp-user-id")==null)&&window.location.pathname!="/index.html"){
        toSignOut();
    }else {
        setAccountStatus(true)
    }
}
function setAccountStatus(status){
    if(status){
        $("#account-email").text(localStorage.getItem("fyp-email"));
        $(".account-status").css("display","inline-block");
        $("#sign-in").css("display","none");
    }else{
        $(".account-status").css("display","none");
        $("#sign-in").css("display","inline-block");
    }

}