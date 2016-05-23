/*
* BROWSER LEVEL REVIEWFORM VALIDATION
*/

  // if no input field valuess and alert.alert-danger element exists show it else prepend a div with a message to this div. then return false to prevent from submitting
$('#addReview').submit(function (e) {
  // console.log('log hello from submit');
  $('alert.alert-danger').hide();
  if ( !$('input#name').val() || !$('select#rating').val() || !$('textarea#review').val() ) {
    if ($('alert.alert-danger').length){
      $('alert.alert-danger').show();
    } else {
    $(this).prepend("<div role='alert' class='alert alert-danger'>Name, rating and review text fields are required.</div>");
    }
    return false;
  }
});
