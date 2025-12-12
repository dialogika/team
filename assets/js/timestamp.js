$(function () {
  $('#submits').attr('disabled', true);
  $('#myForm').change(function () {
    if ($('#names').val() != '' && $('#works').val() != '' && $('#locations').val() != '' && $('#whatsapps').val() != '') {
      $('#submits').attr('disabled', false);
    } else {
      $('#submits').attr('disabled', true);
    }
  });
});
// get date
var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
var time = today.getHours() + ":" + today.getMinutes();
var dateTime = date + '    ' + time;
document.getElementById("timestamp").innerHTML = dateTime;