$(document).on("change", "#flight-type-select", () => {  
    const selection = $('#flight-type-select');
    const returnDateContainer = $('#input-group1');
    const returnDateContainer1 = $('#return-date-label');

    
    const reset = () => {     
      selection.val("one-way"); 
    };
    
    if (selection.val() === "one-way") {     
      returnDateContainer.addClass("d-none"); 
      returnDateContainer1.addClass("d-none"); 
    } else {     
      returnDateContainer.removeClass("d-none"); 
      returnDateContainer1.removeClass("d-none"); 
    } 
    reset();
  });
  