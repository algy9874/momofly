setRecord();
function setRecord(){
    $("#oc-product-id").text(localStorage.getItem("order-id"));
    $("#oc-product-date").text(localStorage.getItem("order-time"));
}