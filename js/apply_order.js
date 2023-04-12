// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, getDoc, doc, Timestamp, updateDoc} from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js';

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
  
function getApplyOrderUser(primaryKeyUID){
    const db = getFirestore();
    const q = query(collection(db,"orderApplication"), where("applicationOrderID","==",primaryKeyUID));
    var list = [];
    var exit = false;
    $(".accept-user-apply-btn").removeClass("none");
    $(".contact-apply-user-btn").addClass("none");
    getDocs(q).then((snapshot) => {
        snapshot.docs.forEach((doc) => {
            if(doc.data()['applicantID'].length > 0){
                if(doc.data()['applyResult']=="Accept"){
                    list = [];
                    list.push({
                        ...doc.data(), id: doc.id
                    });
                    exit = true;
                    $(".accept-user-apply-btn").addClass("none");
                    $(".contact-apply-user-btn").removeClass("none");
                }else if(!exit){
                    list.push({
                        ...doc.data(), id: doc.id
                    });
                }
                executeApplyOrderRecord(list);
            }
        });    
    }).catch(err =>{ console.log(err)});
}
function getApplyUserRecord(primaryKeyUID){
    let list = [];
    const db = getFirestore();
    const docRef = doc(db, "orderApplication", primaryKeyUID);
    $(".apply-update ").removeClass("none");
    getDoc(docRef).then((doc) => {
        list = doc.data();
        setDetailRecord(list);
    }).catch((error) => {});
    $(".apply-update ").addClass("none");
    $(".apply-block-element").removeClass("none");
    showDetailApply();
}
$(".apply-block-element").addClass("none");

async function updateApplyUser(){
    const db = getFirestore();
    const docRef = doc(db, "orderApplication", applyID);
    $(".apply-block-element").addClass("none");
    $(".apply-update").removeClass("none");
    $(".apply-select-content").empty();
    await updateDoc(docRef, {
        applyTime: Timestamp.fromDate(new Date()), 
        applyResult: "Accept"
    });
    $(".apply-block-element").removeClass("none");
    $(".apply-update").addClass("none");
    $(".accept-user-apply-btn").addClass("none");
    $(".contact-apply-user-btn").removeClass("none");
}
async function updateOrderStatus(){
    const db = getFirestore();
    const docRef = doc(db, "orderInformation", orderID);
    await updateDoc(docRef, {
        orderStatus: "已被接取"
    });
}

async function getOrderRecord(primaryKey){
    $(".update-form-element").removeClass("none");
    $(".update-animate").removeClass("none")
    const db = getFirestore();
    const order = await getDoc(doc(db, "orderInformation/"+primaryKey));
    setUpdateRecord(order.data());
    $(".update-animate").addClass("none");
    $(".update-form-element").removeClass("none");
}

async function updateOrder(primaryKey, record){
    const db = getFirestore();
    const docRef = doc(db, "orderInformation", primaryKey);
    $(".update-form-element").addClass("none");
    $(".update-animate").removeClass("none");
    await updateDoc(docRef, {
        productQuantity: record[0],
        productPrice: record[1],
        productCurrency: record[8],
        orderDisplayUserName: record[2],
        shippingAddress: record[3],
        purchaseAddress: record[4],
        productDetails: record[5],
        remuneration: record[6],
        currency: record[7],
        updateTime: Timestamp.fromDate(new Date())
    });
    $(".update-animate").addClass("none");
    $(".update-order-success").removeClass("none");
}


var orderID = "";
var applyID = "";

$(document).on("click", ".update-go-back-btn", function(){
    $(".update-animate").addClass("none");
    $(".update-form-element").removeClass("none");
    $(".update-order-success").addClass("none");
    $(".update-order-block").addClass("none");
    $(".update-background").addClass("none");
});
$(document).on("click", ".update-background", function(){
    $(".update-animate").addClass("none");
    $(".update-form-element").removeClass("none");
    $(".update-order-success").addClass("none");
    $(".update-order-block").addClass("none");
    $(".update-background").addClass("none");
});
$(document).on("click", "#update-order-btn", function(){
    $(".update-animate").removeClass("none");
    $(".update-form-element").addClass("none");
    $(".update-order-block").removeClass("none");
    $(".update-background").removeClass("none");
    getOrderRecord($("#fyp-order-id").val());
});
$(document).on("click", "#update-order-record-btn", function(){
    //提交更新order record
    if(recordIsNull(getRecordID())){
        updateOrder($("#fyp-order-id").val(), getUpdateRecord());
    }
});
//prodoct price-currency dropList open/close
$(document).on("focusout","#oc-product-price-currency",function(){
    $(document).on("click",".select-product-price-currency", function(){
        $("#oc-product-price-currency").val($(this).text())
    });
    setTimeout(() => {
        $("#oc-product-price-currency-select").addClass("none")
    }, 150);
});
$(document).on("focus","#oc-product-price-currency", function(){
    $("#oc-product-price-currency-select").removeClass("none");
});
//prodoct-currency dropList open/close
$(document).on("focusout","#oc-product-currency",function(){
    $(document).on("click",".select-product-currency", function(){
        $("#oc-product-currency").val($(this).text())
    });
    setTimeout(() => {
        $("#oc-product-currency-select").addClass("none")
    }, 150);
});
$(document).on("focus","#oc-product-currency", function(){
    $("#oc-product-currency-select").removeClass("none");
});

$(document).on("click", ".close-apply-select-btn", function(){
    closeApplyBlock();
});
$(document).on("click", ".apply-block-to-back-btn", function(){
    $(".apply-success-block").addClass("none");
    $(".apply-block-element").removeClass("none");
    $(".apply-update").addClass("none");
    $(".accept-user-apply-btn").removeClass("none");
    $(".contact-apply-user-btn").addClass("none");
});
$(document).on("click", "#select-accept-btn", function(){
    orderID = $("#fyp-order-id").val()
    getApplyOrderUser(orderID);
    showApplySelectUserBlock();
});
$(document).on("click", ".basic-apply-user-record-block", function(){
    applyID = $(this).attr('id');
    getApplyUserRecord(applyID);

});
$(document).on("click", ".message-apply-background", function(){
    closeApplyBlock();
});
$(document).on("click", ".apply-background", function(){
    closeSelectApplyBlock();
});
$(document).on("click", ".accept-user-apply-btn", function(){
    updateApplyUser();
    updateOrderStatus();
});
function closeApplyBlock(){
    $(".apply-block").addClass("none");
    $(".message-apply-background").addClass("none");

}
function closeSelectApplyBlock(){
    $(".apply-select-block").addClass("none");
    $(".apply-background").addClass("none");

}
function setDetailRecord(list){
    if(list['applicantName'].length <= 0){
        list['applicantName'] = '申請者沒有填寫'
    }
    $(".txt-apply-name").text("申請人名稱: " + list['applicantName']);
    $(".txtarea-apply-reason").val(list['reasonOfApplication'].replaceAll("<br>","\n"));
}
function showDetailApply(){
    $(".message-apply-background").removeClass("none");
    $(".apply-block").removeClass("none");
}
function showApplySelectUserBlock(){
    $(".apply-select-block").removeClass("none");
    $(".apply-background").removeClass("none");
}
function executeApplyOrderRecord(recordList){
    $(".apply-select-content").empty();
    for(let record of recordList){
        console.log(
            record['id'],
            calRemainingTime(record['applicationTime']),
            record['reasonOfApplication'],
            record['applicantName']
        );
        $(".apply-select-content").append(
            generateApplyItem(
                record['id'],
                calRemainingTime(record['applicationTime']),
                record['reasonOfApplication'],
                record['applicantName']
            )
        );
    }
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
function generateApplyItem(applyID, applyTime, applyReason, applyName){
    var html2 = '';
    var text = "否";
    if(applyName.length <= 0){
        applyName = "申請者沒有填寫"
    }
    if(applyReason.length > 0){
        text = "是";
        var html2 = '<span class="apply-detail">查看申請原因</span>';
    }
    var html = '<div class="basic-apply-user-record-block" id="'+applyID+'">'+
    '    <div class="txt-apply apply-item-gp-1">'+
    '        <span>申請時間:</span>'+
    '        <span class="apply-time">'+applyTime+'</span>'+
    '    </div>'+
    '    <div class="txt-apply apply-item-gp-2">'+
    '        <span>是否有申請原因:</span>'+
    '        <span class="apply-is-reason">'+text+'</span>'+
    '    </div>'+
    '    <div class="txt-apply-2 apply-item-gp-1">'+
    '        <span>申請人名稱:</span>'+
    '        <span class="apply-user-name">'+applyName+'</span>'+
    '    </div>'+
    '    <div class="txt-apply-2 apply-item-gp-2">'+
    '        <span>申請編號:</span>'+
    '        <span class="apply-id">'+applyID+'</span>'+
    '    </div>'+ html2
    '    <textarea hidden id="'+applyID+'-value">'+applyReason+'</textarea>'+
    '</div>';
    return html;
}

function getUpdateRecord(){
    var recordList = [];
    recordList[0] = $('#oc-product-quantity').val();
    recordList[1] = $('#oc-product-price').val();
    recordList[2] = $('#oc-product-user-name').val();
    recordList[3] = $('#oc-receive-product-address').val();
    recordList[4] = $('#oc-purchase-product-address').val();
    recordList[5] = $('#oc-product-details').val().replaceAll("\n","<br>");
    recordList[6] = $('#oc-product-remuneration').val();
    recordList[7] = $('#oc-product-currency').val();
    recordList[8] = $('#oc-product-price-currency').val();
    return recordList;
}
function setUpdateRecord(record){
    $('#oc-product-quantity').val(record["productQuantity"])
    $('#oc-product-price').val(record["productPrice"])
    $('#oc-product-user-name').val(record["orderDisplayUserName"])
    $('#oc-receive-product-address').val(record["purchaseAddress"])
    $('#oc-purchase-product-address').val(record["shippingAddress"])
    $('#oc-product-details').val(record["productDetails"].replaceAll("<br>", "\n"))
    $('#oc-product-remuneration').val(record["remuneration"])
    $('#oc-product-currency').val(record["currency"])
    $('#oc-product-price-currency').val(record["productCurrency"])
}
function recordIsNull(arrayList){
    $(".order-form-error-message").addClass("none");
    for(var s of arrayList){
        if($("#"+s).val().length <= 0){
            $("#"+s).focus();
            $("#"+s+"-err").removeClass("none");
            return false;
        }
    }
    return true;
}
//取得訂單資料的ID
function getRecordID(){
    return [
        "oc-product-quantity",
        "oc-product-price",
        "oc-product-price-currency",
        "oc-purchase-product-address",
        "oc-receive-product-address",
        "oc-product-remuneration",
        "oc-product-currency"
    ];
}
