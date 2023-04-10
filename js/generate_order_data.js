// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where} from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js';

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
function getUserAppcationOrderRecord(primaryKeyUID){
    const db = getFirestore();
    const q = query(collection(db,"orderApplication"), where("applicantID","==",primaryKeyUID));
    let orderRecord = [];
    let recordList = [];
    getDocs(q).then((snapshot) => {
        snapshot.docs.forEach((doc) => {
                recordList.push({ 
                    ...doc.data(), id: doc.id
                });
        });
    }).catch(err =>{});
    const q2 = query(collection(db,"orderInformation"), where("creatorAccountID") = recordList[0]['creatorAccountID']);
    getDocs(q2).then((snapshot) => {
        snapshot.docs.forEach((doc) => {
            if(doc.id == recordList[0]['id']){
                orderRecord.push({ 
                    ...doc.data(), id: doc.id
                });
            }
        });
    });
    executeAppcationOrderRecord(recordList, orderRecord);
}

window.addEventListener('load', function() {
    setTimeout(getUserMakeOrderRecord(localStorage.getItem("fyp-user-id")), 100); 
    $("#self-make-order-list").removeClass("d-none");
    noResult(true);
});

$(document).ready(function(){
    $('#makeOrder').change(function() {
        if($(this).is(':checked')) {
            $("#self-make-order-list").removeClass("d-none");
            getUserMakeOrderRecord(localStorage.getItem("fyp-user-id"))
            noResult(true);

        }else {
            $("#self-make-order-list").addClass("d-none");
            if(!$('#acceptOrder').is(':checked')){
                noResult(false);
            }
        }
    });
    $('#acceptOrder').change(function() {
        if($(this).is(':checked')) {
            $("#self-accept-order-list").removeClass("d-none");
            getUserAppcationOrderRecord(localStorage.getItem("fyp-user-id"))
            noResult(true);

        }else {
            $("#self-accept-order-list").addClass("d-none");
            if(!$('#makeOrder').is(':checked')){
                noResult(false);
            }
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
    $("#self-make-order").empty();
    $("#last-update-order-time").text(getCurrentTime());
    noResult(false);
    if(noResult(!isEmpty(makeOrderRecord))){
        for(let record of makeOrderRecord){
            $("#self-make-order").append(generateOrder(record['id'],record['productName'],record['productImage'],setDateFormat(record['creationDate']),record['orderStatus']))
        }
    }
}
function executeAppcationOrderRecord(applicationRecord, orderRecord){
    $("#self-accept-order-list").empty();
    $("#last-update-order-time").text(getCurrentTime());
    noResult(false);
    if(noResult((!isEmpty(applicationRecord)&&!isEmpty(orderRecord)))){
        for(let record of applicationRecord){
            $("#self-accpet-order").append(generateAcceptOrder(record['id'],record['productName'],record['productImage'],setDateFormat(record['creationDate']),record['orderStatus']))
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

    }else{
        $("#no-order-page").css("display","flex");
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
                +"<span>產品名稱:</span>"
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

function generateAcceptOrder(applicationID, applicationOrderID, applicationTime, productImgURL){
    var html = '<div class="fm-accept-block" id="'+applicationID+'">'+
    '<img class="ic-order-image" src="'+productImgURL+'"/>'+
    '<input type="hidden" id="application-order-id"/ value="'+applicationOrderID+'">'+
    '<div class="accpet-record">'+
        '<div><span>接取日期 : </span><span>'+applicationTime+'</span></div>'+
    '</div>'+
    '<button class="application-btn" id="cancel-application-btn">取消申請</button>'+
    '</div>'
    return html
}

function setMaxLength(text){
    if(text.length >= 32)
        return text.substring(0, 32) + " ...";
    return text;
}