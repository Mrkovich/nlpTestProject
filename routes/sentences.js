var express = require('express');
var router = express.Router();
var stringSimilarity = require('string-similarity');

/*
 * GET sentences.
 */
router.get('/dbsentences', function(req, res) {
    var db = req.db;
    var collection = db.get('dbsentences');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/*
 * POST to addsentence.
 */
router.post('/addsentence', function(req, res) {
    var db = req.db;
    var collection = db.get('dbsentences');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deletesentence.
 */
router.delete('/deletesentence/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('dbsentences');
    var sentenceToDelete = req.params.id;
    collection.remove({ '_id' : sentenceToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/*
 * Check string similarity
 */
router.get('/checkSimilarity/:newSentence', function(req, res) {
    var db = req.db;
    var collection = db.get('dbsentences');
    collection.find({},{}, function(e, docs){
        if (e !== null) {
            // exception from mongo
            console.err(e);
            return res.send(500);
        }
        var sentencesdbDATA = [];
        for (index = 0; index < docs.length; ++index) {
            sentencesdbDATA.push(docs[index].sentenceinfo)
        }
        console.log(sentencesdbDATA);
        var sentenceToCheckSimilarity = req.params.newSentence;
        console.log(sentenceToCheckSimilarity);
        var stringSimilarityResult = stringSimilarity.findBestMatch(sentenceToCheckSimilarity,sentencesdbDATA);
        console.log(stringSimilarityResult);
        return res.json(stringSimilarityResult);  
    });
});

module.exports = router;
