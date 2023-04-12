// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, Timestamp, getDoc, doc, getCountFromServer} from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js';

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
function getOrderRecord(uid){
    clearAllElement();
    const db = getFirestore();
    const colRef = collection(db, "orderInformation");
    const q1 = query(collection(db,"orderApplication"), where("applicantID","==",uid));
    let hidden = [];
    getDocs(q1).then((snapshot) => {
        snapshot.docs.forEach((doc) => {
            hidden.push(doc.data()['applicationOrderID']); 
        });
    });
    const q2 = query(colRef, where("creatorAccountID","!=",uid));    
    var i = 0;
    getDocs(q2).then((snapshot) => {
        snapshot.docs.forEach(async (doc) => {
            if(hidden.indexOf(doc.id) < 0){
                if(doc.data()['orderStatus']=="等待接取" && calRemainingTime(doc.data()['creationDate'])!="已完結" && calRemainingTime(doc.data()['creationDate'])!="發生錯誤"){
                    if(i <= 12){
                        const coll = collection(db, "orderApplication");
                        const q = query(coll, where("applicationOrderID", "==", doc.id), where("cancelOrder", "==", false));
                        const snapshot = await getCountFromServer(q);
                        console.log(doc.data());
                        executeMakeOrderRecord(
                            doc.id, 
                            doc.data()['productName'],
                            doc.data()['productImage'],
                            doc.data()['creationDate'],
                            doc.data()['remuneration'],
                            doc.data()['currency'],
                            doc.data()['purchaseAddress'],
                            snapshot.data().count);
                        i++;
                    }
                }
            }
        });
    }).catch(err =>{console.log(err)});
}

window.addEventListener('load', function() {
    getOrderRecord(this.localStorage.getItem("fyp-user-id"));
    $("#last-update-time").text(getCurrentTime());

});

$(document).on("submit",".to-create-order",function(){
    localStorage.setItem("order-submit",false);
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
function clearAllElement(){
    $(".product__filter").empty();
}
function executeMakeOrderRecord(id, productName, productImage, createDate, remuneration, currency, purchaseAddress, applyOfNum){
    $(".product__filter").append(
        generateOrder(
            id,
            setMaxLength(productName, 12),
            productImage,
            calRemainingTime(createDate), 
            remuneration+" "+currency, 
            setMaxLength(purchaseAddress, 8), 
            applyOfNum
        ));
}
function calRemainingTime(time){
    var nowTime = Timestamp.fromDate(new Date());
    var dateTime = (14*3600*24) - (nowTime.seconds-time.seconds);
    if(dateTime >= 86400){
        return  Math.floor(dateTime / 86400) + "日"
    }else if(dateTime >= 3600){
        return  Math.floor(dateTime / 3600) + "小時"
    }else if(dateTime <= 0){
        return "已完結";
    }
    return "發生錯誤";
}
function generateOrder(productID, productName, productImg, productTimeLeft, remuneration, purchaseAddress, numOfApply){
    var html = '' 
    +'<div class="col-lg-3 col-md-6 col-sm-6 col-md-6 col-sm-6 mix new-arrivals order-item" id="'+productID+'">'
        +'<div class="product__item">'
            +'<div class="product__item__pic set-bg">'
                +'<img src="'+productImg+'">'
            +'</div>'
            +'<div class="product__item__text">'
                +'<div class="d-flex">'
                    +'<h6>產品: &nbsp;</h6>'
                    +'<h6>'+productName+'</h6>'
                +'</div>'
                +'<a class="add-cart">詳細</a>'
                +'<div class="d-flex">'
                    +'<h5>剩餘接單時間: &nbsp;</h5>'
                    +'<h5>'+productTimeLeft+'</h5>'
                +'</div>'
                +'<div class="d-flex">'
                    +'<h5>報酬: &nbsp;</h5>'
                    +'<h5>'+remuneration+'</h5>'
                +'</div>'
                +'<div class="d-flex">'
                    +'<h5>購買地點: &nbsp;</h5>'
                    +'<h5>'+purchaseAddress+'</h5>'
                +'</div>'
                +'<div class="d-flex">'
                    +'<h5>提出接單申請人數: &nbsp;</h5>'
                    +'<h5>'+numOfApply+'</h5>'
                +'</div>'
                +'<button class="accept-order-btn" id="'+productID+'-btn">提出接取訂單</button>'
            +'</div>'
        +'</div>'
    +'</div>';
    return html;
}

function setMaxLength(text, max){
    if(text.length >= max)
        return text.substring(0, max) + " ...";
    return text;
}