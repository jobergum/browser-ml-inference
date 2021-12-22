/* global BigInt */
/*global BigInt64Array */

import {loadTokenizer} from './bert_tokenizer.ts';
const ort = require('onnxruntime-web');
const options = {executionProviders: ['wasm'], 'graphOptimizationLevel': 'all'};
const session = ort.InferenceSession.create('./xtremedistil-int8.onnx', options);
const tokenizer = loadTokenizer();

const emotions = [
    'Sadness 😥',
    'Joy 😂',
    'Love ❤️',
    'Anger 😠',
    'Fear 😱',
    'Surprise 😲'
]
const empty_prediction = ['Unknown 🙈',0];

function argMax(arr) {
    if (arr.length === 0) {
        return -1;
    }
    var max = arr[0];
    var maxIndex = 0;
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
    return maxIndex;
}

function softMax(logits) {
    const maxLogit = Math.max(...logits);
    const scores = logits.map(l => Math.exp(l - maxLogit));
    const denom = scores.reduce((a, b) => a + b);
    return scores.map(s => s / denom);
}

async function lm_inference(text) {
    try { 
      const encoded = await tokenizer.then(t => {
        return t.tokenize(text); 
      });
      if (encoded.length === 0) {
          return empty_prediction;
      }
      var input_ids = new Array(encoded.length+2);
      var attention_mask = new Array(encoded.length+2);
      var token_type_ids = new Array(encoded.length+2);

      input_ids[0] = BigInt(101);
      attention_mask[0] = BigInt(1);
      token_type_ids[0] = BigInt(0);
      var i = 0;
      for(; i < encoded.length; i++) { 
        input_ids[i+1] = BigInt(encoded[i]);
        attention_mask[i+1] = BigInt(1);
        token_type_ids[i+1] = BigInt(0);
      }
      input_ids[i+1] = BigInt(102);
      attention_mask[i+1] = BigInt(1);
      token_type_ids[i+1] = BigInt(0);
      const sequence_length = input_ids.length;
      input_ids = new ort.Tensor('int64', BigInt64Array.from(input_ids), [1,sequence_length]);
      attention_mask = new ort.Tensor('int64', BigInt64Array.from(attention_mask), [1,sequence_length]);
      token_type_ids = new ort.Tensor('int64', BigInt64Array.from(token_type_ids), [1,sequence_length]);
      const start = Date.now();
      const feeds = { input_ids: input_ids, token_type_ids: token_type_ids, attention_mask:attention_mask};
      const output =  await session.then(session => { return session.run(feeds,['output_0'])});
      const duration = Date.now() - start;
    
      console.log("Inference latency = " + duration + "ms");

      const probs = softMax(output['output_0'].data);
      const predictedLabel = argMax(probs);
      const confidence = Math.floor(100*probs[predictedLabel]);
      if (confidence < 20) {
        return empty_prediction;
      } else {
        return [emotions[predictedLabel],confidence];
      }
    } catch (e) {
        return ["Inference failed",100];
    }
}    
const inference = lm_inference;
export default inference;