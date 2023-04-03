// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import { getFirestore, collection, getDocs} from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
function getUserMakeOrderRecord(primaryKeyUID){
    const db = getFirestore();
    const colRef = collection(db, "orderInformation");
    let recordList = [];
    getDocs(colRef).then((snapshot) => {
        snapshot.docs.forEach((doc) => {
            if(doc.data()['creatorAccountID']==primaryKeyUID){
                recordList.push({ 
                    ...doc.data(), id: doc.id
                });
            }
        });
        executeMakeOrderRecord(recordList);
    }).catch(err =>{
        console.log(err.message);
    });

}

window.addEventListener('load', function() {
    setTimeout(getUserMakeOrderRecord(localStorage.getItem("fyp-user-id")), 100); 
    $("#make-order-title").css("display","block");
    $("#accept-order-title").css("display","none");

});

$(document).ready(function(){
    $('#makeOrder').change(function() {
        if($(this).is(':checked')) {
            $("#make-order-title").css("display","block");
        }else {
            $("#make-order-title").css("display","none");
        }
    });
    $('#acceptOrder').change(function() {
        if($(this).is(':checked')) {
            $("#accept-order-title").css("display","block");
        }else {
            $("#accept-order-title").css("display","none");
        }
    });
    $(".to-create-order-btn").click(function(){
        window.location.href = "shop.html";
    });
});

function getCurrentTime(){
    var now = new Date();
    var year = now.getFullYear();
    var month = ('0' + (now.getMonth() + 1)).slice(-2);
    var day = ('0' + now.getDate()).slice(-2);
    var hours = ('0' + now.getHours()).slice(-2);
    var minutes = ('0' + now.getMinutes()).slice(-2);
    var seconds = ('0' + now.getSeconds()).slice(-2);
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}
function executeMakeOrderRecord(makeOrderRecord){
    $(".user-order-content").empty();
    $("#last-update-order-time").text(getCurrentTime());
    noResult(false);
    if(noResult(!isEmpty(makeOrderRecord))){
        for(let record of makeOrderRecord){
            $(".user-order-content").append(generateOrder(record['id'],record['productName'],record['productImage'],setDateFormat(record['creationDate']),record['orderStatus']))
        }
    }
}
function setDateFormat(date){
    date = date.toDate();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    return `${formattedDate} ${formattedTime}`;
}
function isEmpty(arrayList){
    return arrayList.length <= 0;
}
function noResult(hasRecord){
    if(hasRecord){
        $("#no-order-page").css("display","none");
        $("#order-display").css("display","block");

    }else{
        $("#no-order-page").css("display","flex");
        $("#order-display").css("display","none");
    }
    return hasRecord;
}
function generateOrder(productID, productName, productImg, orderCreateDate, orderStatus){
    var statusClass = "order-processing"
    if(orderStatus=="已完成"){
        statusClass = "order-complete"
    }else if(orderStatus=="已超時"){
        statusClass = "order-timeOut"
    }
    productName = setMaxLength(productName);
    var html = "<div class='order-block' id='"+productID+"'>"
        +"<div class='order-modfiy'>"
            +"<span class='order-modfiy-title'>訂單詳細</span>"
        +"</div>"
        +"<div class='order-img'>"
            +"<img src='"+productImg+"'>"
        +"</div>"
        +"<div class='order-detail "+statusClass+"'>"
            +"<span class='order-item-detail remove-style'>"
                +"<span>產品名稱: </span>"
                +"<span id='item-name'>"+productName+"</span>"
            +"</span>"
            +"<span class='order-item-detail remove-style'>"
                +"<span>創建日期:</span>"
                +"<span id='order-create-date'>"+orderCreateDate+"</span></span>"
            +"<span class='order-item-detail remove-style'>"
                +"<span>訂單狀態: </span>"
                +"<span id='order-create-date'>"+orderStatus+"</span></span>"
        +"</div>"
    +"</div>"
    return html;
}

function setMaxLength(text){
    if(text.length >= 32)
        return text.substring(0, 32) + " ...";
    return text;
}