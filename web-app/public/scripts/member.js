var apiUrl = location.protocol + '//' + location.host + "/api/";
//var apiUrl = "http://3.16.137.69:8000/api/";
//check user input and call server
$('.sign-in-member').click(function() {
  updateMember();
});

function updateMember() {

  //get user input data
  var formAccountNum = $('.account-number input').val();
  var formCardId = $('.card-id input').val();

  //create json data
  var inputData = '{' + '"accountnumber" : "' + formAccountNum + '", ' + '"cardid" : "' + formCardId + '"}';
  console.log(inputData)

  //make ajax call
  $.ajax({
    type: 'POST',
    url: apiUrl + 'memberData',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //display loading
      document.getElementById('loader').style.display = "block";
    },
    success: function(data) {

      console.log(data);
      //remove loader
      document.getElementById('loader').style.display = "none";

      //check data for error
      if (data.error) {
        alert(data.error);
        return;
      } else {

        //update heading
        $('.heading').html(function() {
          var str = '<h2><b>' + data.firstName + ' ' + data.lastName + '</b></h2>';
          str = str + '<h2><b>' + data.accountNumber + '</b></h2>';
          str = str + '<h2><b>' + data.points + '</b></h2>';

          return str;
        });

        //update partners dropdown for earn points transaction
        $('.earn-partner select').html(function() {
          var str = '<option value="" disabled="" selected="">select</option>';
          var partnersData = data.partnersData;
          for (var i = 0; i < partnersData.length; i++) {
            str = str + '<option partner-id=' + partnersData[i].id + '> ' + partnersData[i].name + '</option>';
          }
          return str;
        });

        //update partners dropdown for use points transaction
        $('.use-partner select').html(function() {
          var str = '<option value="" disabled="" selected="">select</option>';
          var partnersData = data.partnersData;
          for (var i = 0; i < partnersData.length; i++) {
            str = str + '<option partner-id=' + partnersData[i].id + '> ' + partnersData[i].name + '</option>';
          }
          return str;
        });

        //update earn points transaction
        $('.points-allocated-transactions').html(function() {
          var str = '';
          var transactionData = data.earnPointsResult;

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

        $('#loyalty').html(function() {

          var htmls='';
          return htmls;
        });

        //remove login section and display member page
        document.getElementById('loginSection').style.display = "none";
        document.getElementById('transactionSection').style.display = "block";
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      //reload on error
      alert("Error: Try again")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    },
    complete: function() {

    }
  });
}


$('.earn-points-30').click(function() {
  earnPoints(30);
});

$('.earn-points-80').click(function() {
  earnPoints(80);
});

$('.earn-points-200').click(function() {
  earnPoints(200);
});


//check user input and call server
$('.earn-points-transaction').click(function() {

  var formPoints = $('.earnPoints input').val();
  earnPoints(formPoints);
});


function earnPoints(formPoints) {

  //get user input data
  var formAccountNum = $('.account-number input').val();
  var formCardId = $('.card-id input').val();
  var formPartnerId = $('.earn-partner select').find(":selected").attr('partner-id');
  if (!formPartnerId) {
    alert("Select partner first");
    return;
  }

  //create json data
  var inputData = '{' + '"accountnumber" : "' + formAccountNum + '", ' + '"cardid" : "' + formCardId + '", ' + '"points" : "' + formPoints + '", ' + '"partnerid" : "' + formPartnerId + '"}';
  console.log(inputData)

  //make ajax call
  $.ajax({
    type: 'POST',
    url: apiUrl + 'earnPoints',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //display loading
      document.getElementById('loader').style.display = "block";
      document.getElementById('infoSection').style.display = "none";
    },
    success: function(data) {

      document.getElementById('loader').style.display = "none";
      document.getElementById('infoSection').style.display = "block";

      //check data for error
      if (data.error) {
        alert(data.error);
        return;
      } else {
        //update member page and notify successful transaction
        updateMember();
        alert('Transaction successful');
      }


    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert("Error: Try again")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    }
  });

}


$('.use-partner select').on('change', function() {
   var partnerid = $(this).find(':selected').attr('partner-id');
   var formCardId = $('.card-id input').val();
   //create json data
  var inputData = '{' + '"partnerId" : "' + partnerid + '", ' + '"cardId" : "' + formCardId + '"}';
  console.log(inputData)

  //$('#loyalty').html(function() {

    //var pl = '';
    //var transactionData = data.productResults;
    // var products=[
    //   {
    //     "product": "Tshirt",
    //     "price": "2000",
    //     "points": 20,
    //   },
    //   {
    //     "product": "Jeans",
    //     "price": "3000",
    //     "points": 30,
    //   },
    //   {
    //     "product": "watch",
    //     "price": "5000",
    //     "points": 50,
    //   }
    // ];

  //   for (var i = 0; i < products.length; i++) {
  //           pl = pl + '<button class="btn btn-primary sqbutton use-points-1" data-points="'+products[i].points+'" onclick="usepoints('+products[i].points+')">Get '+ products[i].product +' for '+products[i].points+' points</button> <br />'
  //         }
  //         return pl;
  // });

  $.ajax({
    type: 'POST',
    url: apiUrl + 'addProductTransactions ',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //display loading
      document.getElementById('loader').style.display = "block";
    },
    success: function(data) {
      document.getElementById('loader').style.display = "none";
      console.log(data)

       $('#loyalty').html(function() {
             var pl = '';
              var transactionData = data.success;
                for (var i = 0; i < transactionData.length; i++) {
            pl = pl + '<button class="btn btn-primary sqbutton use-points-1" data-points="'+transactionData[i].points+'" onclick="usepoints('+transactionData[i].points+')">Get '+ transactionData[i].product +' for '+transactionData[i].points+' points</button> <br />'
          }
          return pl;
        });
    }
  });


});

function usepoints(data) {
  console.log(data)
  usePoints(data);
}

// $('.use-points-1').live('click',function(){
//   console.log("jhjhjhjjhjj");
//   var points = $(this).data('points');  
//   alert(points);
//   //usePoints(points);
// });

$('.use-points-50').click(function() {
  usePoints(50);
});

$('.use-points-150').click(function() {
  usePoints(100);
});

$('.use-points-200').click(function() {
  usePoints(150);
});


//check user input and call server
$('.use-points-transaction').click(function() {
  var formPoints = $('.usePoints input').val();
  usePoints(formPoints);
});


function usePoints(formPoints) {

  //get user input data
  var formAccountNum = $('.account-number input').val();
  var formCardId = $('.card-id input').val();
  var formPartnerId = $('.use-partner select').find(":selected").attr('partner-id');
  
  if (!formPartnerId) {
    alert("Select partner first");
    return;
  }

  //create json data
  var inputData = '{' + '"accountnumber" : "' + formAccountNum + '", ' + '"cardid" : "' + formCardId + '", ' + '"points" : "' + formPoints + '", ' + '"partnerid" : "' + formPartnerId + '"}';
  console.log(inputData)

  //make ajax call
  $.ajax({
    type: 'POST',
    url: apiUrl + 'usePoints',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //display loading
      document.getElementById('loader').style.display = "block";
      document.getElementById('infoSection').style.display = "none";
    },
    success: function(data) {

      document.getElementById('loader').style.display = "none";
      document.getElementById('infoSection').style.display = "block";

      //check data for error
      if (data.error) {
        alert(data.error);
        return;
      } else {
        //update member page and notify successful transaction
        updateMember();
        alert('Transaction successful');
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert("Error: Try again")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    },
    complete: function() {}
  });

}
