// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, getDoc, doc, Timestamp, updateDoc} from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js';
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js";

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


async function updateApplyOrder(name, reason){
    const db = getFirestore();
    const docRef = doc(db, "orderApplication", updateID);
    await updateDoc(docRef, {
        applicantName: name,
        reasonOfApplication: reason,
        lastUpdateTime: Timestamp.fromDate(new Date())
    });
    showUpdateSuccess();
}

async function cancelApplyOrder(){
    const db = getFirestore();
    const docRef = doc(db, "orderApplication", updateID);
    await updateDoc(docRef, {
        applicantID: "",
        cancelPerson: localStorage.getItem("fyp-user-id"),
        cancelTime: Timestamp.fromDate(new Date()),
        cancelOrder: true
    });
    showCancelSuccess();
    cancel = true;
}

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
    const colRef = collection(db,"orderApplication");
    let orderRecord = [];
    let recordList = [];
    getDocs(colRef).then((querySnapshot) => {
        querySnapshot.forEach(async (recordDoc) => {
            if(primaryKeyUID==recordDoc.data().applicantID){
                recordList.push({ 
                    ...recordDoc.data(), id: recordDoc.id
                });
                const order = await getDoc(doc(db, "orderInformation/"+recordDoc.data().applicationOrderID));
                orderRecord.push({
                    ...order.data()
                })
            }
          executeAppcationOrderRecord(recordList, orderRecord);
        });
      }).catch((error) => {
        console.log(error);
      });
}

window.addEventListener('load', function() {
    setTimeout(getUserMakeOrderRecord(localStorage.getItem("fyp-user-id")), 100); 
    $("#self-make-order-list").removeClass("d-none");
    noResult(true);
});
//更新
var updateID = "";

$(document).on("click", ".fm-accept-block",function(){
    openOrderDetail();
    updateID = $(this).attr("id");
    getOrderDetailRecord($("#"+updateID+"-in").val(), true);
    $(".cancel-accept-btn").removeClass("none");
    $(".update-accept-btn").removeClass("none");
    $(".fm-update-order-btn").addClass("none");
});
$(document).on("click", ".order-block",function(){
    openOrderDetail();
    getOrderDetailRecord($(this).attr("id"), false);
    $(".cancel-accept-btn").addClass("none");
    $(".update-accept-btn").addClass("none");
    $(".fm-update-order-btn").removeClass("none");

});
//打開更新介面
$(document).on("click",".update-accept-btn",function(){
    showUpdateApplication();
});
$(document).on("click", "#cancel-application-btn",function(){
    openCancelBlock();
});
//關閉按鈕 (第二層)
$(document).on("click","#order-detail-close-btn",function(){
    closeOrderDetailBlock();
});
//點擊背景會關對應的元素(第二層)
$(document).on("click",".order-detail-background",function(){
    closeOrderDetailBlock();
});
$(document).on("click",".cancel-accept-btn", function(){
    openCancelBlock();
});
$(document).on("click", ".delete-accept-order-btn", function(){
    cancelApplyOrder();
    closeCancelSelect();


});
var cancel = false;
$(document).on("click",".message-box-background",function(){
    closeCancelBlock();
    showCancelSelect();
    closeCancelSuccess();
    closeMessageBox();
    closeUpdateSuccess();
    showUpdateApplicationForm();
    if(cancel){
        closeOrderDetailBlock();
        $("#"+updateID).addClass('none');
        cancel = false;
    }
});

$(document).on("click", ".update-reason-btn", function(){
    updateApplyOrder($("#update-user-name").val(), $("#update-txtarea-accept-reason").val());
    closeUpdateApplication();
});
function showUpdateSuccess(){
    $(".submit-accept-order-success").removeClass("none");
}
function closeUpdateSuccess(){
    $(".submit-accept-order-success").addClass("none");
}
function showUpdateApplication(){
    $("#update-accept-order-box").removeClass('none');
    $(".message-box-background").removeClass("none");
}
function showUpdateApplicationForm(){
    $(".form-element").removeClass("none");
}
function closeUpdateApplication(){
    $(".form-element").addClass("none");
}
function showCancelSelect(){
    $(".cancel-item-first").removeClass("none");
}
function closeCancelSelect(){
    $(".cancel-item-first").addClass("none");
}
function showCancelSuccess(){
    $(".cancel-success").removeClass("none");
}
function closeCancelSuccess(){
    $(".cancel-success").addClass("none");
}
function showCancelAnimate(){
    $(".animate-delete-accept-order").removeClass("none");
}
function closeCancelAnimate(){
    $(".animate-delete-accept-order").addClass("none");
}
function openCancelBlock(){
    $(".delete-accept-order").removeClass("none");
    $(".message-box-background").removeClass("none");
}
function closeCancelBlock(){
    $(".delete-accept-order").addClass("none");
    $(".message-box-background").addClass("none");
}
function closeMessageBox(){
    $("#update-accept-order-box").addClass('none');
}

function closeOrderDetailBlock(){
    $(".fm-order-detail").addClass("none");
    $(".order-detail-background").addClass("none");
}
function getOrderDetailRecord(primaryKey, type){
    if((localStorage.getItem("fyp-email")!=null&&localStorage.getItem("fyp-user-id")!=null)){
        const db = getFirestore();
        const colRef = collection(db, "orderInformation");
        let recordList = [];
        let applicationRecord = []

        getDocs(colRef).then((querySnapshot) => {
            querySnapshot.forEach(async (recordDoc) => {
                if(primaryKey==recordDoc.id){
                    recordList.push({ 
                        ...recordDoc.data(), id: recordDoc.id
                    });
                    if(type){
                        const application = await getDoc(doc(db, "orderApplication/"+updateID));
                        applicationRecord.push({
                            ...application.data()
                        })
                    }

                    setOrderDetailRecord(recordList, applicationRecord, type);
                    closeLoadingAnimate();
                }
            });

          }).catch((error) => {
            console.log(error);
          });
    }else{
        window.location.href = "login.html"
    }
}

function closeOrderDetail(){
    $(".order-detail-background").addClass("none");
    $(".fm-order-detail").addClass("none");
}
function openOrderDetail(){
    $(".order-detail-background").removeClass("none");
    $(".fm-order-detail").removeClass("none");
    $("#loader-record").removeClass("none");
    $(".loading-element").addClass("none");
}

function closeLoadingAnimate(){
    $("#loader-record").addClass("none");
    $(".loading-element").removeClass("none");
}

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
    $("#self-accept-order").empty();
    $("#last-update-order-time").text(getCurrentTime());
    noResult(false);
    if(noResult((!isEmpty(applicationRecord)&&!isEmpty(orderRecord)))){
        for(let i = 0; i < applicationRecord.length; i++){
            $("#self-accept-order").append(
                generateAcceptOrder(
                    applicationRecord[i]['id'],
                    applicationRecord[i]['applicationOrderID'],
                    orderRecord[i]['productName'],
                    setDateFormat(applicationRecord[i]['applicationTime']),
                    orderRecord[i]['productImage']
                ));
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
    productName = setMaxLength(productName, 32);
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

function generateAcceptOrder(applicationID, applicationOrderID, orderProductName, applicationTime, productImgURL){
    var html = '<div class="fm-accept-block" id="'+applicationID+'">'+
    '<img src="'+productImgURL+'"/>'+
    '<input type="hidden" id="'+applicationID+'-in" value="'+applicationOrderID+'">'+
    '<div class="accept-record">'+
        '<div><span>產品名稱 : </span><span>'+setMaxLength(orderProductName, 16)+'</span></div>'+
        '<div><span>接取日期 : </span><span>'+applicationTime+'</span></div>'+
    '</div>'+
    '<button class="application-btn" id="cancel-application-btn">取消申請</button>'+
    '</div>'
    return html
}

function setMaxLength(text, size){
    if(text.length >= size)
        return text.substring(0, size) + " ...";
    return text;
}


/*設定訂單資料*/
function setOrderDetailRecord(record, applicationRecord,type){
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
    $("#show-order-product-link").text(record[0]['productLink']);

    if(type){
        var temp = applicationRecord[0]['reasonOfApplication'];
        temp = temp.replaceAll("<br>","\n");
        $("#update-txtarea-accept-reason").val(temp);
        $("#update-user-name").val(applicationRecord[0]['applicantName']);
    }
}