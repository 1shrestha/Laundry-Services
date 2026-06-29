emailjs.init("zl5n-UKZMDsdIZKl8");

var clothesList=[
    { code:"wash1", title:"Dry Cleaning",rate:200,emoji:"👔"},
    { code:"wash2", title:"Wash and Fold", rate:100,emoji:"👕"},
    { code:"wash3", title:"Ironing", rate:30,emoji:"🔌"},
    { code:"wash4", title:"Stain Removal", rate:500, emoji:"🩸"},
    { code:"wash5", title:"Leather and Seude cleaning",rate:999,emoji:"🧥"},
    { code:"wash6", title:"Wedding dress cleaning", rate:2800,emoji:"🤵👗"}
];
var cart=[];

var clothesBox=document.getElementById("services-container");
var tableBody=document.getElementById("table-rows");
var priceTag=document.getElementById("price-display text-red-600 pr-1");
var checkoutForm=document.getElementById("order-form");
var alertBanner=document.getElementById("form-success");

function showData(){
    var cardsLayout="";

for(var i=0;i<clothesList.length;i++){
        var card=clothesList[i];
        var isAdded=cart.indexOf(card.code) !== -1;

        var txt='Add Item <span class="text-sm ml-1">+</span>';
        var styling="border-gray-500 text-gray-800 bg-gray-50 hover:bg-gray-100"

        if(isAdded){
            txt='Remove Item <span class="ml-1 text-sm">-</span>';
            styling="border-red-200 text-red-500 bg-red-50 hover:bg-red-100";
        }

        cardsLayout+='<div class="flex justify-between items-center p-4 bg-white border border-gray-200 rounded shadow-sm">';
        cardsLayout +='<div class="flex items-center gap-3">';
        cardsLayout +='<div class="w-8 h-8 flex items-center justify-center rounded text-base">' + card.emoji + '</div>';
        cardsLayout +='<div>';
        cardsLayout +='<h4 class="font-semibold text-sm text-gray-800">' + card.title + '</h4>';
        cardsLayout +='<p class="text-sm text-blue-500 font-semibold">₹' + card.rate.toFixed(2) + '</p>';
        cardsLayout +='</div>';
        cardsLayout +='</div>';
        cardsLayout +='<button type="button" onclick="clickItem(\'' + card.code + '\')" class="px-4 py-2 rounded-full text-xs font-semibold border transition tracking-wide flex items-center ' + styling + '">' + txt + '</button>';
        cardsLayout +='</div>';
    }
    clothesBox.innerHTML=cardsLayout;
}

function clickItem(itemcode){
    var target=cart.indexOf(itemcode);
    if(target===-1){
        cart.push(itemcode);
    }
    else{
        cart.splice(target,1);
    }
    showData();
    refreshInvoiceTable();
}

function refreshInvoiceTable(){
    var inRows="";
    var amount=0;
    var rowNum=1;

    for(var x=0;x<clothesList.length;x++){
        var element=clothesList[x];

        if(cart.indexOf(element.code)!==-1){
            amount+=element.rate;

            inRows+='<tr class="border-b border-gray-50">';
            inRows+='<td class="py-3 text-xs text-gray-400 font-medium">' + rowNum + '</td>';
            inRows+='<td class="py-3 text-xs text-gray-700 font-medium">' + element.title + '</td>';
            inRows+='<td class="py-3 text-xs text-gray-900 font-bold text-right">₹' + element.rate.toFixed(2) + '</td>';
            inRows+='</tr>'
            rowNum++;
        }
    }
    if(inRows===""){
        inRows='<tr><td colspan="3" class="py-6 text-center text-xs text-gray-400 italic">No services added yet.</td></tr>';
    }
    tableBody.innerHTML=inRows;
    priceTag.innerText="₹"+amount.toFixed(2);
}

checkoutForm.onsubmit=function(actionEvent){
    actionEvent.preventDefault();
    if(cart.length===0){
    alert('Please Select at least one laundry service for booking');
    return;
    }
    var active=[];
    var bill=0;
    for(var j=0;j<clothesList.length;j++){
        if(cart.indexOf(clothesList[j].code)!==-1){
            active.push(clothesList[j].title);
            bill+=clothesList[j].rate;
        }
    }

    var dispatch={
        user_name: document.getElementById("username").value,
        user_email:document.getElementById("user-email").value,
        user_phone:checkoutForm.querySelector('input[type="number"]').value,
        services_ordered:active.join(", "),
        total_amount:"₹"+bill.toFixed(2)
    };

    emailjs.send("service_27mhuen","template_9jiywze",dispatch).then(function(){
        alertBanner.classList.remove("hidden");
        checkoutForm.reset();
        cart=[];
        showData();
        refreshInvoiceTable();
        setTimeout(function(){
            alertBanner.classList.add("hidden");
        },5000);
    },function(failMessage){
        alert("Error, sending request"+ JSON.stringify(failMessage));
    });
};



showData();
refreshInvoiceTable();