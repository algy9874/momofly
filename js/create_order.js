import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { getFirestore, collection, addDoc, Timestamp  } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

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


$(document).on('DOMContentLoaded', async function() {
    if(localStorage.getItem("fyp-user-id") && localStorage.getItem("make-order")){
        const urlParams = new URLSearchParams(window.location.search);
        const docRef = await addDoc(collection(db, "orderInformation"), {
        // 1.訂單資料 數據
        productLink: urlParams.get("oc-link"),
        productName: urlParams.get("oc-name"),
        productType: urlParams.get("oc-type"),
        productQuantity: urlParams.get("oc-quantity"),
        productPrice: urlParams.get("oc-price"),
        orderDisplayUserName: urlParams.get("oc-display-name"),
        // 2.訂單詳情 數據
        shippingAddress: urlParams.get("oc-receive-address"),
        purchaseAddress: urlParams.get("oc-purchase-address"),
        productImage: urlParams.get("oc-image"),
        creatorAccountID:urlParams.get("oc-details"),
        // 3.相關資訊 數據
        remuneration:urlParams.get("oc-remuneration"),
        currency:urlParams.get("oc-currency"),
        // 4.系統生成 數據
        creatorAccountID: localStorage.getItem("fyp-user-id"),
        creationDate: nowTime,
        orderStatus: "等待接取"
        });

        $("#oc-product-id").text(docRef.id);
        let date = nowTime.toDate();
        let year = date.getFullYear();
        let month = ('0' + (date.getMonth() + 1)).slice(-2);
        let day = ('0' + date.getDate()).slice(-2);
        let hours = ('0' + date.getHours()).slice(-2);
        let minutes = ('0' + date.getMinutes()).slice(-2);
        let seconds = ('0' + date.getSeconds()).slice(-2);
        let formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        $("#oc-product-date").text(formattedDate);
        localStorage.removeItem("make-order")
    }else {
        window.location.href = "shop.html";
    }
});

