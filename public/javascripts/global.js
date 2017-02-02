
// sentences data array for filling in info box
var sentencesData = [];


// DOM Ready =============================================================
$(document).ready(function() {
	//var s = stringSimilarity;
    // Populate the user table on initial page load
    populateTable();
    // Sentence link click
    $('#dbSentences table tbody').on('click', 'td a.linkshowsentence', showSentenceInfo);
    // Add Sentence button click
    $('#btnAddSentence').on('click', addSentence);
    // Delete Sentence link click
    $('#dbSentences table tbody').on('click', 'td a.linkdeletesentence', deleteSentence);

    // Similarity Sentence button click
    $('#btncheckSimilarity').on('click', checkSimilarity);
});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/sentences/dbsentences', function( data ) {
    	// Stick our user data array into a userlist variable in the global object
    	sentencesData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowsentence" rel="' + this.sentenceinfo + '">' + this.sentenceinfo + '</a></td>';
            tableContent += '<td><a href="#" class="linkdeletesentence" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#dbSentences table tbody').html(tableContent);
    });
};

// Show Sentence Info
function showSimilarSentenceInfo(event) {

    // Retrieve thisSentenceInfo from link rel attribute
    var thisSentenceInfo = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = sentencesData.map(function(arrayItem) { return arrayItem.sentenceinfo; }).indexOf(thisSentenceInfo);
    // Get our Sentence Object
    var thisSentenceObject = sentencesData[arrayPosition];

    //Populate Info Box
    $('#showsentenceinfo').text(thisSentenceObject.sentenceinfo);
};


// Show Sentence Info
function showSentenceInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve thisSentenceInfo from link rel attribute
    var thisSentenceInfo = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = sentencesData.map(function(arrayItem) { return arrayItem.sentenceinfo; }).indexOf(thisSentenceInfo);
    // Get our Sentence Object
    var thisSentenceObject = sentencesData[arrayPosition];

    //Populate Info Box
    $('#showsentenceinfo').text(thisSentenceObject.sentenceinfo);
};

// Add Sentence
function addSentence(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addSentence input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all sentence info into one object
        var newSentence = {
            'sentenceinfo': $('#addSentence fieldset input#inputSentenceInfo').val(),
        }

        // Use AJAX to post the object to our addsentence service
        $.ajax({
            type: 'POST',
            data: newSentence,
            url: '/sentences/addsentence',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addSentence fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in the field');
        return false;
    }
};

    // Delete Sentence
function deleteSentence(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this sentence?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/sentences/deletesentence/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }
};

// checkSimilarity
function checkSimilarity(event) {
    event.preventDefault();
    // Super basic validation - increase errorCount variable if fields blank
    var tableContent = '';
        var newSentence =  $('#checkSimilarity fieldset input#similarityInputSentenceInfo').val()

        // Use AJAX to post the object to our addsentence service
       
    $.getJSON( '/sentences/checkSimilarity/' + newSentence, function( data ) {
        // Stick our user data array into a userlist variable in the global object
        var similarityData = data;
        $('#showsimilarsentenceinfo').text(similarityData.bestMatch.target);
        $('#showsimilarsentencerating').text(similarityData.bestMatch.rating);
    });


};