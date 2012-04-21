$(document).ready(function() {
/*
  if (typeof sampleData != 'undefined') {
    $('#uploadForm').hide();
    window.BackyardBrains.analyze.setWaveData(sampleData);
    window.BackyardBrains.analyze.redraw.trigger('redraw');
  } else {
*/
  function triggerApp(file){
    var wr = new BackyardBrains.WaveReader(file);
    wr.doneReadingCallback = function(){
      BackyardBrains.analyze.setWaveData(this);
      BackyardBrains.analyze.redraw.trigger('redraw');
    }
    wr.parse();
  }

  $('#uploadForm').dialog({
    height: 300,
    width: 350,
    modal: true,
    buttons: {
      "Read": function () {
        //$('#fileForm').submit();
        var files = $('#spikes_file').get(0).files;
        var file = files[0];
        triggerApp(file);
        $(this).dialog('close');
      },
      Cancel: function() {
        $( this ).dialog( "close" );
      }
    },
    close: function() {
    }
  });
});
