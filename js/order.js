$(document).on('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const inputValue = urlParams.get('product-link');
    localStorage.setItem("make-order", true);
    if(inputValue != null)
        document.getElementById("oc-product-link").value = inputValue;
    setProgressBar(0);
    $(".product-select-box-option").addClass("none");
    $(".load-form").addClass("none");

    if(localStorage.getItem("order-submit")=="true"){
        window.location.href = "shop.html";
    }
});
$(document).on("input", "#oc-product-quantity", function() {
    if (this.value.length > 3 || this.value > 0) {
      this.value = this.value.slice(0,3);
    }else {
        this.value = "";
    }
});
$(document).on("click","#order-detail-btn", function(){
    let recordList = getDetailPageRecord();
    if(recordIsNull(recordList)){
        aboutPage();
    }
});
//返回Detail
$(document).on("click","#order-detail-back", function(){
    detailPage();
});
$(document).on("click","#order-information-btn", function(){
    let recordList = getInformationPageRecord();
    if(recordIsNull(recordList)){
        detailPage();
    }
});
$(document).on("click","#order-information-back", function(){
    informationPage();
});
$(document).on("click",".progress-bar-finish", function(){
    var progress = getProgressBarID();
    if(("#"+$(this).attr('id'))==progress[1]){
        detailPage();
    }else if(("#"+$(this).attr('id'))==progress[2]){
        aboutPage();
    }else{
        informationPage()
    }
});
$(document).on("click","#generate-order-record-btn", function(){
    let recordList = getAboutPageRecord();
    if(recordIsNull(recordList)){
        setOrderRecord();
        generateRecordPage();
    }
});

//prodoct type dropList open/close
$(document).on("focusout","#oc-product-type",function(){
    $(document).on("click",".select-product-type", function(){
        $("#oc-product-type").val($(this).text())
    });
    setTimeout(() => {
        $("#oc-product-type-select").addClass("none")
    }, 150);
});
$(document).on("focus","#oc-product-type", function(){
    $("#oc-product-type-select").removeClass("none");
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


//前往訂單資料頁面
function informationPage(){
    changePage("#order-information");
    setProgressBar(0);
}
//前往訂單詳情頁面
function detailPage(){
    changePage("#order-detail");
    setProgressBar(1);
}
//前往公開資訊頁面
function aboutPage(){
    changePage("#order-about");
    setProgressBar(2);
}
function generateRecordPage(){
    changePage("#order-record");
    setProgressBar(3);
}
//取得訂單資料頁面的資料
function getInformationPageRecord(){
    return [
        "oc-product-link",
        "oc-product-name",
        "oc-product-type",
        "oc-product-quantity",
        "oc-product-price",
        "oc-product-price-currency"
    ];
}
//取得訂單詳情頁面的資料
function getDetailPageRecord(){
    return [
        "oc-purchase-product-address",
        "oc-receive-product-address",
        "oc-product-image"
    ];
}
//取得公開資訊頁面的資料
function getAboutPageRecord(){
    return [
        "oc-product-remuneration",
        "oc-product-currency"
    ];
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
function changePage(nextPageId){
    $(".form-inner-cont").css("display","none");
    $(nextPageId).fadeIn();
}

//目前只有三個level 0, 1, 2, 3
function setProgressBar(level){
    var progress = getProgressBarID();
    var message = ["1.填寫基本訂單資料","2.填寫訂單詳情","3.設定公開資訊","4.填寫完成提交訂單"];
    $("#current-progress").text(message[level]);
    $(".progress-bar-finish").css("visibility","hidden");
    $(progress[level]).css("visibility","visible").addClass("current-progress");
    for(var i = 0; i < level; i++){
        $(progress[i]).css("visibility","visible").removeClass("current-progress");
    }
}

function getProgressBarID(){
    return ["#progress-first", "#progress-second", "#progress-third", "#progress-fourth"];
}
function setOrderRecord(){
    $("#pd-link").text($('#oc-product-link').val());
    $("#pd-name").text($('#oc-product-name').val());
    $("#pd-type").text($('#oc-product-type').val());
    $("#pd-quantity").text($('#oc-product-quantity').val());
    $("#pd-price").text($('#oc-product-price').val()+" "+$("#oc-product-price-currency").val());
    $("#pd-user-name").text($('#oc-product-user-name').val());
    $("#pd-receive-address").text($('#oc-receive-product-address').val());
    $("#pd-purchase-address").text($('#oc-purchase-product-address').val());
    $("#pd-details").text($('#oc-product-details').val());
    $("#pd-remuneration").text($('#oc-product-remuneration').val()+" "+$('#oc-product-currency').val());
    $("#pd-total-price").text($('#oc-product-quantity').val()*$('#oc-product-price').val()+" "+$("#oc-product-price-currency").val());
}