import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { getFirestore, collection, addDoc, Timestamp, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL  } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js';

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
const db = getFirestore(app);
let nowTime = Timestamp.fromDate(new Date());
var closeAnimate = false;
function getInputImg(){return document.getElementById('oc-product-image').files[0];}
function getFormRecord(){
    var recordList = [];
    recordList[0] = $('#oc-product-link').val();
    recordList[1] = $('#oc-product-name').val();
    recordList[2] = $('#oc-product-type').val();
    recordList[3] = $('#oc-product-quantity').val();
    recordList[4] = $('#oc-product-price').val();
    recordList[5] = $('#oc-product-user-name').val();
    recordList[6] = $('#oc-receive-product-address').val();
    recordList[7] = $('#oc-purchase-product-address').val();
    recordList[8] = $('#oc-product-details').val().replaceAll("\n","<br>");
    recordList[9] = $('#oc-product-remuneration').val();
    recordList[10] = $('#oc-product-currency').val();
    recordList[11] = $('#oc-product-price-currency').val();
    return recordList;
}
async function createOrder(uid){
    const record = getFormRecord();
    const docRef = await addDoc(collection(db, "orderInformation"), {
        // 1.訂單資料 數據
        productLink: record[0],
        productName: record[1],
        productType: record[2],
        productQuantity: record[3],
        productPrice: record[4],
        productCurrency: record[11],
        orderDisplayUserName: record[5],
        // 2.訂單詳情 數據
        shippingAddress: record[6],
        purchaseAddress: record[7],
        productDetails: record[8],
        // 3.相關資訊 數據
        remuneration: record[9],
        currency: record[10],
        // 4.系統生成 數據
        creatorAccountID: uid,
        creationDate: nowTime,
        orderStatus: "等待接取"
    });
    const storage = getStorage();
    const storageRef = ref(storage, uid+'/'+docRef.id+'/'+getInputImg().name);
    const uploadTask = uploadBytesResumable(storageRef, getInputImg());
    uploadTask.on('state_changed', (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      $("#upload-progress").text(progress);
    }, (error) => {
        console.log(error.message);
        setSubmitFail();
    },() => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (imgURL) => {
                const uploadFile = doc(db, "orderInformation", docRef.id);
                updateDoc(uploadFile, {
                    productImage: imgURL
                })
                .then(() => {
                    localStorage.setItem("order-id", docRef.id);
                    localStorage.setItem("order-time", setDateTimeFormat(nowTime));
                    setTimeout(() => {window.location.href = "success_create_order.html";}, 500);

                })
                .catch((error) => {
                });
            });
        }
    );
    localStorage.setItem("order-submit",true);
}
function setDateTimeFormat(nowTime){
    let date = nowTime.toDate();
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let hours = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2);
    let seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}




$(document).on("click","#create-order-submit-btn", function(){
    orderFormSubmit();
});
$(document).on("click","#reupload-order-btn", function(){
    orderFormSubmit();
});
$(document).on("click", "#preloder", function(){
    closeMessageBox();
});
function orderFormSubmit(){
    var userID = localStorage.getItem('fyp-user-id');
    if(userID !=null && userID.length > 19){
        setSubmitAnimate();
        createOrder(userID);
    }else{
        window.location.href = "shop.html";
    }
}

function setSubmitAnimate(){
    $("#preloder").css("display","flex");
    $("#on-upload").css("display","flex");
    $("#upload-fail").css("display","none");
    closeAnimate = false;
}
function setSubmitFail(){
    $("#preloder").css("display","flex");
    $("#on-upload").css("display","none");
    $("#upload-fail").css("display","flex");
    closeAnimate = true;
}
function closeMessageBox(){
    if(close)
        $("#preloder").css("display","none");
}
