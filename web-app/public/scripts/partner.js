var apiUrl = location.protocol + '//' + location.host + "/api/";
//var apiUrl = "http://3.16.137.69:8000/api/";
//check user input and call server

$('.sign-in-partner').click(function() {
  updatePartner();
});

$('#add_offer').click(function() {

     var formPartnerId = $('.partner-id input').val();
     var formCardId = $('.card-id input').val();
     var offerproduct = $('#offerproduct').val();
     var offerprice = $('#offerprice').val();
     var offerpoints = $('#offerpoints').val();
    console.log(formPartnerId,offerproduct,offerprice,offerpoints);

    //create json data
  var inputData = '{' + '"cardId" : "' + formCardId + '", ' + '"partnerId" : "' + formPartnerId + '", ' + '"productName" : "' + offerproduct + '", ' + '"price" : "' + offerprice + '", ' + '"points" : "' + offerpoints + '"}';
  console.log(inputData);


  //make ajax call
  $.ajax({
    type: 'POST',
    url: apiUrl + 'addProduct',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //display loading

      $("#offerproduct").val('');
      $("#offerprice").val('');
      $("#offerpoints").val('');
      $('#productModal').modal('hide');
      //document.getElementById('loader').style.display = "block";
    },
    success: function(data) {
      console.log(data);
      
      updatePartner();
      //remove loader
      //document.getElementById('loader').style.display = "none";

    },
    error: function(jqXHR, textStatus, errorThrown) {

    }
  });

});

function updatePartner() {
  //get user input data
  var formPartnerId = $('.partner-id input').val();
  var formCardId = $('.card-id input').val();

  //create json data
  var inputData = '{' + '"partnerid" : "' + formPartnerId + '", ' + '"cardid" : "' + formCardId + '"}';
  console.log(inputData);

  //make ajax call
  $.ajax({
    type: 'POST',
    url: apiUrl + 'partnerData',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //display loading
      console.log("before send PartnerData sign in")
      document.getElementById('loader').style.display = "block";
    },
    success: function(data) {

      console.log(data)

      //remove loader
      document.getElementById('loader').style.display = "none";

      //check data for error
      if (data.error) {
        alert(data.error);
        return;
      } else {

        //update heading
        $('.heading').html(function() {
          var str = '<h2><b> ' + data.name + ' </b></h2>';
          str = str + '<h2><b> ' + data.id + ' </b></h2>';

          return str;
        });

        //update dashboard
        $('.dashboards').html(function() {
          var str = '';
          str = str + '<h5>Total points allocated to customers: ' + data.pointsGiven + ' </h5>';
          str = str + '<h5>Total points redeemed by customers: ' + data.pointsCollected + ' </h5>';
          return str;
        });

        //update earn points transaction
        $('.points-allocated-transactions').html(function() {
          var str = '';
          var transactionData = data.earnPointsResults;

          for (var i = 0; i < transactionData.length; i++) {
            str = str + '<p>timeStamp: ' + transactionData[i].timestamp + '<br />partner: ' + transactionData[i].partner + '<br />member: ' + transactionData[i].member + '<br />points: ' + transactionData[i].points + '<br />transactionID: ' + transactionData[i].transactionId + '</p><br>';
          }
          return str;
        });

        //update use points transaction
        $('.points-redeemed-transactions').html(function() {
          var str = '';
          var transactionData = data.usePointsResults;

          for (var i = 0; i < transactionData.length; i++) {
            str = str + '<p>timeStamp: ' + transactionData[i].timestamp + '<br />partner: ' + transactionData[i].partner + '<br />member: ' + transactionData[i].member + '<br />points: ' + transactionData[i].points + '<br />transactionID: ' + transactionData[i].transactionId + '</p><br>';
          }
          return str;
        });

        //update earn points transaction
        $('#productlist').html(function() {
          var pl = '';
          var transactionData = data.addProductResults;
          // var transactionData=[
          //   {
          //     "product": "Tshirt",
          //     "price": "2000",
          //     "points": 150,
          //   },
          //   {
          //     "product": "Jeans",
          //     "price": "5000",
          //     "points": 400,
          //   }
          // ];

          for (var i = 0; i < transactionData.length; i++) {
            pl = pl + '<div class="coupon"><div class="containers"><h2><b class="producttext">' + transactionData[i].product + '</b></h2> </div><div class="container"><p class="proddetails">Price: <span class="promo">' + transactionData[i].price + '$</span></p><p class="proddetails">Points: <span class="promo">' + transactionData[i].points + '</span></p></div></div>'
          }
          return pl;
        });

        //remove login section
        document.getElementById('loginSection').style.display = "none";
        //display transaction section
        document.getElementById('transactionSection').style.display = "block";
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      //reload on error
      alert("Error: Try again")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);

      location.reload();
    },
    complete: function() {

    }
  });
}
