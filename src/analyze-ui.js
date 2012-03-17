$(document).ready(function() {
  if (typeof sampleData != 'undefined') {
    $('#uploadForm').hide();
    window.BackyardBrains.analyze.setWaveData(sampleData);
  } else {
    $('#uploadForm').dialog({
      height: 300,
      width: 350,
      modal: true,
      buttons: {
        "Upload": function () {
          $('#fileForm').submit();
        },
        Cancel: function() {
	  $( this ).dialog( "close" );
	}
      },
      close: function() {
	allFields.val( "" ).removeClass( "ui-state-error" );
      }
    });
  }
});
