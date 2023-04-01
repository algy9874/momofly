
//提交search form
$(document).on("submit", "#search-form", function(event) {
    const searchInput = $("#search-input").val().trim();
    if (searchInput.length === 0) {
        event.preventDefault();
    } else {
        updateHistory(searchInput);
    }
});

// $(document).on("input", "#search-input", function() {
//     const inputVal = $(this).val();
//     if(inputVal.length > 0 ){
//         searchFocusCSS(false);
//         searchInputCSS(true);
//         $(".search-recommend-item").css("display","flex");
//         setDisplayTextLength(inputVal);
//     }else {
//         searchFocusCSS(true);
//         searchInputCSS(false);
//     }
//   });
//在focus input時會顯示記錄
$(document).on("focus", "#search-input", function() {
    const inputVal = $(this).val();
    if(inputVal.length ==0 ){
        displayHistory();
    }});

//清除所有記錄
$(document).on("click", "#clear-all-btn", function(){removeAllHistory();searchFocusCSS(false)})

//清除點擊的記錄
$(document).on("click", ".fm-circle", function() {
    var id = $(this).attr("id");
    if(id.substring(0, 9)=="rm-record"){
        removeHistory(parseInt(id.substring(9,id.length)))
    }
});

//點擊記錄會輸入至input box並提交
$(document).on("click", ".fm-record", function() {
    var id = $(this).attr("id");
    $("#search-input").val($("#"+id).text())
    $("#search-form").submit();
});

$(document).on("click", ".search-switch", function() {
    $('.search-model').fadeIn(400);
});
$(document).on("click", ".search-close-switch", function() {
    $('.search-model').fadeOut(400, function () {
        $('#search-input').val('');
    });
});


//顯示記錄
function displayHistory(){
    var history = getHistory();
    if(history.length > 0){
        $(".search-box-item-select").css("display","none");
        searchFocusCSS(true);
        var count = 1;
        for(var i = history.length; i > 0; i--){
            if(count <= 10){
                var rdtext = "#record" + count;
                var rdbox = "#recordbox" + count; 
                $(rdbox).css("display","flex");
                $(rdtext).text(history[count-1]);
                count++;
            }
        }
    }
}
//更新記錄
function updateHistory(newRecord) {
    var history =  sethead(newRecord);
    if (history.length > 10) {
        history.pop();
    }
    recordStorage(history);
}

//讀取記錄
function getHistory() {
    const history = JSON.parse(localStorage.getItem("fyp-history"));
    return Array.isArray(history) ? history : [];
}

//刪除記錄
function removeHistory(num) {
    var history = getHistory();
    history.splice(history.indexOf(getHistoryListValue(num)), 1)
    recordStorage(history);
    removeSearchFocusItemBox(num);
}

//刪除全部記錄
function removeAllHistory(){
    localStorage.removeItem("fyp-history");
}

//儲存記錄
function recordStorage(history){
    localStorage.setItem("fyp-history", JSON.stringify(history));
}

//記錄版面閞關 UI
function searchFocusCSS(status){
    if(status)
       $(".search-focus-box").css("display","block");
    else
        $(".search-focus-box").css("display","none");
}
//推薦/類似結果版面開關 UI
function searchInputCSS(status){
    if(status)
        $(".search-recommend-box").css("display","block");
    else
        $(".search-recommend-box").css("display","none");
}
//刪除記錄的動晝
function removeSearchFocusItemBox(num){
    var id = "#recordbox"+num;
    $(id).fadeOut().delay(10).text();
    if(getHistory().length <=0){
        searchFocusCSS(false);
    }
}
function setDisplayTextLength(inputVal){
    if($(".search-recommend-item").width() <= 240){
        if(inputVal.length >= 8){
            $(".search-val-style").text(inputVal.substring(0,8) + " ...");
        }else{
            $(".search-val-style").text(inputVal);
        }
    }else if($(".search-recommend-item").width() <= 340){
        if(inputVal.length >= 20){
            $(".search-val-style").text(inputVal.substring(0,20) + " ...");
        }else{
            $(".search-val-style").text(inputVal);
        }
    }else {
        if(inputVal.length >= 32){
            $(".search-val-style").text(inputVal.substring(0,32) + " ...");
        }else{
            $(".search-val-style").text(inputVal);
        }        
    }
}
//由指定UI介面的行數 取得Element的value 
function getHistoryListValue(num){
    var rdtext = "#record" + num;
    return $(rdtext).text();
}

//檢查是否有相同記錄
function checkIsExist(record){
    return getHistory().indexOf(record) >= 0;
}

//設定record至Array的Head
function sethead(record){
    var history = getHistory();
    if(checkIsExist(record)){
        history.splice(history.indexOf(record),1);
    }
    history.unshift(record);
    return history;
}
//檢查輸入的資料是屬於什麼分類: date, date-range ,order-id, user-id, product-name
function getInputType(record){
    return "product-name"
}
//驗證是否屬於日期格式
function isValidDateFormat(date){

}
//提供日期排列的可能
function setDateFormatPossibility(date){

}