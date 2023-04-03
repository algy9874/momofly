$(document).on('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const inputValue = urlParams.get('product-link');
    localStorage.setItem("make-order", true);

    if(inputValue != null)
        document.getElementById("oc-product-link").value = inputValue;
    // document.getElementById("oc-user-id").value += localStorage.getItem("fyp-user-id");
    // document.getElementById("oc-email").value += localStorage.getItem("fyp-email");
});
$(document).on("input", "#oc-product-quantity", function() {
    if (this.value.length > 3 || this.value > 0) {
      this.value = this.value.slice(0,3);
    }else {
        this.value = "";
    }
});
// $(document).on("submit","#form-order-make", function(){
//     localStorage.setItem("make-order", true);
// });
$(document).on("click","#order-information-btn", function(){
    let recordList = [
        document.getElementById("oc-product-link"),
        document.getElementById("oc-product-name"),
        document.getElementById("oc-product-type"),
        document.getElementById("oc-product-quantity"),
        document.getElementById("oc-product-price")
    ]
    if(checkNotNull(recordList)){
        changePage("#order-information", "#order-detali");
    }
});
$(document).on("click","#order-detali-btn", function(){
    //之後再檢查
    changePage("#order-detali", "#order-about");
});
$(document).on("click","#order-information-back", function(){
    changePage("#order-detali", "#order-information");
});
$(document).on("click","#order-detali-back", function(){
    changePage("#order-about", "#order-detali");
});
function checkNotNull(arrayList){
    for(var i = 0; i < arrayList.length; i ++){
        if(arrayList[i].value.length <= 0){
            arrayList[i].focus();
            return false;
        }
    }
    return true;
}
function changePage(currentPageId, nextPageId){
    $(currentPageId).css({'display': 'none'});
    $(nextPageId).delay(100).fadeIn();

}