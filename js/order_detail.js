import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, Timestamp} from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js';

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

function getOrderDetailRecord(primaryKey){
    if((localStorage.getItem("fyp-email")!=null&&localStorage.getItem("fyp-user-id")!=null)){
        const db = getFirestore();
        const colRef = collection(db, "orderInformation");
        let recordList = [];
        getDocs(colRef).then((snapshot) => {
            snapshot.docs.forEach((doc) => {
                if(primaryKey==doc.id){
                    recordList.push({ 
                        ...doc.data(), id: doc.id
                    });
                }
            });
            setOrderDetailRecord(recordList);
            closeLoadingAnimate();
        }).catch(err =>{
        });
    }else{
        window.location.href = "login.html"
    }

}
async function applyOrder(orderID, applicant, reason){
    const db = getFirestore();
    const date = Timestamp.fromDate(new Date());
    const docRef = await addDoc(collection(db, "orderApplication"), {
        applicationOrderID: orderID,
        applicantID: applicant,
        reasonOfApplication: reason,
        applicationTime: date
    });
    closeAccpetAnimate();
    showOrderAcceptSubmit(docRef.id , date);

}
$(document).on("click","#close-all-goback-btn", function(){
    showAccpetElement();
    closeOrderAcceptSubmit();
    closeMessageBox();
    closeOrderDetail();
    closeOrderDetailBackground();
});
$(document).on("click","#submit-accept-order-btn", function(){
    showAccpetAnimate();
    closeAccpetElement();
    applyOrder($("#fyp-order-id").val(), localStorage.getItem("fyp-user-id"), $("#txtarea-accept-reason").val().replaceAll("\n","<br>"));
})
$(document).on("click",".order-item",function(){
    getOrderDetailRecord($(this).attr("id"));
    openOrderDetailBackground();
    openOrderDetail();
    showLoadingAnimate();
});
$(document).on("click",".message-box-background",function(){
    closeMessageBox();
});
//彈出式 申請接受訂單頁面(由詳細訂單內調用)
$(document).on("click","#receive-btn",function(){
    openMessageBoxBackground();
    openAcceptOrderBox();
});
//彈出式 留言區提交信息頁面
$(document).on("click","#ctm-add-btn",function(){
    openMessageBoxBackground();
    openCommentBox();
});
//彈出式 申請接受訂單頁面(直接調用)
$(document).on("click",".accept-order-btn",function(){
    openAcceptOrderBox();
    openMessageBoxBackground();
});
//關閉按鈕 (第二層)
$(document).on("click","#order-detail-close-btn",function(){
    closeOrderDetailBackground();
    closeOrderDetail();
});
//點擊背景會關對應的元素(第二層)
$(document).on("click",".order-detail-background",function(){
    closeOrderDetailBackground();
    closeOrderDetail();
});

//加載詳情訂單動畫
function showLoadingAnimate(){
    $("#loader-record").removeClass("none");
    $(".loading-element").addClass("none");
}

// end
//留言區提交信息頁面
function openCommentBox(){
    $("#comment-box").removeClass("none");
}
function closeLoadingAnimate(){
    $("#loader-record").addClass("none");
    $(".loading-element").removeClass("none");
}
//end
//申請接受訂單時所填寫資料的頁面
function openAcceptOrderBox(){
    $("#accept-order-box").removeClass("none");
}
//end
//第三層畫面的黑背景 (申請頁面, 留言頁面)
function openMessageBoxBackground(){
    $(".message-box-background").removeClass("none");
}

//end
//第二層畫面的黑背景 (詳情訂單)
function openOrderDetailBackground(){
    $(".order-detail-background").removeClass("none");
}
function closeOrderDetailBackground(){
    $(".order-detail-background").addClass("none");
}
//end
//詳情訂單頁面
function openOrderDetail(){
    $(".fm-order-detail").removeClass("none");
}
function closeOrderDetail(){
    $(".fm-order-detail").addClass("none");
}
//end
//關閉第二層ALL畫面+背景
function closeMessageBox(){
    $(".message-box-background").addClass("none");
    $(".fm-message-box").addClass("none");
}
//end
//提交申請接受訂單時動畫
function showAccpetAnimate(){
    $("#animate-accept-order").removeClass("none");
}
function closeAccpetAnimate(){
    $("#animate-accept-order").addClass("none");
}
//end
//提交申請填寫頁面的元素
function showAccpetElement(){
    $(".load-submit-accept-order").removeClass("none");
}
function closeAccpetElement(){
    $(".load-submit-accept-order").addClass("none");
}
function showOrderAcceptSubmit(id, time){
    $(".submit-accept-order-success").removeClass("none");
    $("#accept-order-id").text(id);
    $("#accept-order-time").text(time.toDate());
}
function closeOrderAcceptSubmit(){
    $(".submit-accept-order-success").addClass("none");
}
//end
/*設定訂單資料*/
function setOrderDetailRecord(record){
    $("#fyp-order-id").val(record[0]['id']);
    $("#show-order-product-image").attr("src",record[0]['productImage'])
    $("#create-order-user-id").val(record[0]['creatorAccountID']);
    $("#show-order-product-name").text(record[0]['productName']);
    $("#show-order-product-type").text(record[0]['productType']);
    $("#show-order-product-quantity").text(record[0]['productQuantity']);
    $("#show-order-product-price").text(record[0]['productPrice']+" "+record[0]['productCurrency']);
    $("#show-order-product-remuneration").empty();
    $("#show-order-product-remuneration").append(record[0]['remuneration']+" "+record[0]['currency']);
    $("#show-order-product-user-name").text(record[0]['orderDisplayUserName']);
    $("#show-order-product-detail").text(record[0]['productDetails']);
    $("#show-order-product-purchase-address").text(record[0]['purchaseAddress']);
    $("#show-order-product-receive-address").text(record[0]['shippingAddress']);
}