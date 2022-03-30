// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

(function() {
  // <code>
  "use strict";
  
  // pull in the required packages.
  var sdk = require("microsoft-cognitiveservices-speech-sdk");
  var readline = require("readline");
  
  // replace with your own subscription key,
  // service region (e.g., "westus"), and
  // the name of the file you save the synthesized audio.
  var subscriptionKey = "e57c72eb97414b45aebd3468fb9c1580";
  var serviceRegion = "japanwest"; // e.g., "westus"
  var filename = "YourAudioFile" + new Date().getTime() + ".wav";

  // we are done with the setup

  // now create the audio-config pointing to our stream and
  // the speech config specifying the language.
  var audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename);
  var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
  // speechConfig.speechRecognitionLanguage = 'ja-JP'
  speechConfig.speechSynthesisLanguage = 'zh-CN';//修改语言
  sdk.SpeechSynthesizer.AllVoices
  // create the speech synthesizer.
  var synthesizer = new sdk.SpeechSynthesizer(speechConfig,audioConfig);
  // synthesizer.getVoicesAsync()
  // synthesizer.FromConfig(speechConfig,autoDetectSourceLanguageConfig,audioConfig)
  
  // synthesizer.getVoicesAsync().then(res => console.log('res->',res))
  // synthesizer.autoDetectSourceLanguage = true;
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Type some text that you want to speak...\n> ", function (text) {
    rl.close();
    // start the synthesizer and wait for a result.
    synthesizer.speakTextAsync(text,
        function (result) {
      if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        console.log("synthesis finished.");
      } else {
        console.error("Speech synthesis canceled, " + result.errorDetails +
            "\nDid you update the subscription info?");
      }
      synthesizer.close();
      synthesizer = undefined;
    },
        function (err) {
      console.trace("err - " + err);
      synthesizer.close();
      synthesizer = undefined;
    });
    console.log("Now synthesizing to: " + filename);
  });
  // </code>
  
}());
  