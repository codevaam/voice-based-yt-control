import { Router } from "express";
import mongoose from "mongoose";
// import { url } from "inspector";
// import { exec } from "child_process";
var limdu = require("limdu");
const { spawn } = require("child_process");
const { BrainNLU } = require("node-nlp");
const util = require('util');
const exec = util.promisify(require('child_process').exec);

//Extract Keywords
var vfile = require("to-vfile");
var retext = require("retext");
var pos = require("retext-pos");
var keywords = require("retext-keywords");
var toString = require("nlcst-to-string");

const router = Router();
export default router;
var url;
let transcript;
let raw_json;

router.get("/", (req, res) => {
    res.render("index.html");
});

router.get("/id", async (req, res)=>{
	const id = req.query.url;
    transcript = await get_transcript_py(id);
    raw_json = get_train_data(transcript);
    console.log(raw_json);
	res.json(transcript);
})

router.get("/caption", async (req, res) => {
    url = req.query.url;
    console.log(typeof(url));
});

async function get_transcript_py(url){
	const {stdout,stderr} = await exec('python ./routes/script.py '+url);
	return stdout;
}

async function get_train_data(transcript){
	const {stdout,stderr} = await exec('python ./routes/train.py '+url);
	return stdout;
}

async function get_label_list_2(transcriptAndKeys, userData: string) {
    var TextClassifier = limdu.classifiers.multilabel.BinaryRelevance.bind(
        0,
        {
            binaryClassifierType: limdu.classifiers.Winnow.bind(0, {
                retrain_count: 10
            })
        }
    );

    // Now define our feature extractor - a function that takes a sample and adds features to a given features set:
    var WordExtractor = function(input, features) {
        input.split(" ").forEach(function(word) {
            features[word] = 1;
        });
    };

    // Initialize a classifier with the base classifier type and the feature extractor:
    var intentClassifier = new limdu.classifiers.EnhancedClassifier({
        classifierType: TextClassifier,
        featureExtractor: WordExtractor
    });

    // Train and test:
    transcriptAndKeys.forEach(lineKey => {
        intentClassifier.train({ input: lineKey.line, output: lineKey.key });
    });
    // intentClassifier.trainBatch([
    // 	{ input: "I want an apple", output: "apl" },
    // 	{ input: "I want a banana", output: "bnn" },
    // 	{ input: "I want chips", output: "cps" }
    // ]);

    // console.dir(intentClassifier.classify("I want an apple and a banana")); // ['apl','bnn']
    // console.dir(intentClassifier.classify("I WANT AN APPLE AND A BANANA"));
    
    return (intentClassifier.classify(userData));
}

function keyword_extraction(transcipt: string[]): string[] {
	retext()
		.use(pos) // Make sure to use `retext-pos` before `retext-keywords`.
		.use(keywords)
		.process(vfile.readSync(transcipt), done);

	let allPhrases = [];

	function done(err, file) {
		if (err) throw err;

		console.log("Keywords:");
		file.data.keywords.forEach(function(keyword) {
			console.log(toString(keyword.matches[0].node));
			allPhrases.push(toString(keyword.matches[0].node));
		});

		console.log();
		console.log("Key-phrases:");
		file.data.keyphrases.forEach(function(phrase) {
			function stringify(value) {
				return toString(value);
			}
			console.log(phrase.matches[0].nodes.map(stringify).join(""));
			allPhrases.push(phrase.matches[0].nodes.map(stringify).join(""));
		});
	}

	return allPhrases;
}

async function get_label_list_1(transcriptAndKeys, userData: string) {
	const classifier = new BrainNLU({ language: "en" });
	// for( x,y in transcriptAndKeys )
	transcriptAndKeys.forEach(lineKey => {
		classifier.add(lineKey.line, lineKey.line);
	});

	// classifier.add("bonne nuit", "greet");
	// classifier.add("Bonsoir", "greet");
	// classifier.add("J'ai perdu mes clés", "keys");
	// classifier.add("Je ne trouve pas mes clés", "keys");
	// classifier.add("Je ne me souviens pas où sont mes clés", "keys");
	await classifier.train();
	const classifications = classifier.getClassifications(userData);
	console.log(classifications);
	// [ { label: 'keys', value: 0.9076581467793369 },
    // { label: 'greet', value: 0.09234185322066314 } ]
    return(classifications);
}
