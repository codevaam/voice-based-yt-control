import { Router } from "express";
import mongoose from "mongoose";

//Extract Keywords
var vfile = require("to-vfile");
var retext = require("retext");
var pos = require("retext-pos");
var keywords = require("retext-keywords");
var toString = require("nlcst-to-string");

const router = Router();
export default router;

router.post("/", async (req, res) => {
	const transcript = req.body.transcipt;
	const url = req.body.url;
	const userData = req.body.userData;

	const { BrainNLU } = require("node-nlp");

	async function wordChoose() {
		const classifier = new BrainNLU({ language: "fr" });
		classifier.add("Bonjour", "greet");
		classifier.add("bonne nuit", "greet");
		classifier.add("Bonsoir", "greet");
		classifier.add("J'ai perdu mes clés", "keys");
		classifier.add("Je ne trouve pas mes clés", "keys");
		classifier.add("Je ne me souviens pas où sont mes clés", "keys");
		await classifier.train();
		const classifications = classifier.getClassifications(
			"où sont mes clés"
		);
		console.log(classifications);
		// [ { label: 'keys', value: 0.9076581467793369 },
		// { label: 'greet', value: 0.09234185322066314 } ]
	}

	async function keyword_extraction(userData: string) {
		retext()
			.use(pos) // Make sure to use `retext-pos` before `retext-keywords`.
			.use(keywords)
			.process(vfile.readSync(userData), done);

		function done(err, file) {
			if (err) throw err;

			console.log("Keywords:");
			file.data.keywords.forEach(function(keyword) {
				console.log(toString(keyword.matches[0].node));
			});

			console.log();
			console.log("Key-phrases:");
			file.data.keyphrases.forEach(function(phrase) {
				console.log(phrase.matches[0].nodes.map(stringify).join(""));
				function stringify(value) {
					return toString(value);
				}
			});
		}
	}

	async function IntentGetting() {
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
		intentClassifier.trainBatch([
			{ input: "I want an apple", output: "apl" },
			{ input: "I want a banana", output: "bnn" },
			{ input: "I want chips", output: "cps" }
		]);

		console.dir(intentClassifier.classify("I want an apple and a banana")); // ['apl','bnn']
		console.dir(intentClassifier.classify("I WANT AN APPLE AND A BANANA"));
	}
});
