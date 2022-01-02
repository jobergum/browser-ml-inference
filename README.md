# Text Emotion Prediction in Browser

This React App demonstrates NLP Inference in the Browser using

- [Cloudfare Pages](https://pages.cloudflare.com/) to deliver this app and model with CDN
- [ONNX Runtime Web](https://onnxruntime.ai/) for Model Inference
- [Huggingface](https://huggingface.co/bergum/xtremedistil-emotion) for model hosting and training api
- [Google Colab](https://colab.research.google.com/) for model training 

Live demo at [https://aiserv.cloud/](https://aiserv.cloud/). See also my [blog post](https://bergum.medium.com/moving-ml-inference-from-the-cloud-to-the-edge-d6f98dbdb2e3?source=friends_link&sk=e8183a3a8c10077110952b213ba5bef4).

The model is a fine-tuned version of [microsoft/xtremedistil-l6-h256-uncased](https://huggingface.co/microsoft/xtremedistil-l6-h256-uncased) on the [emotion dataset](https://huggingface.co/datasets/emotion).

Emotion is a dataset of English Twitter messages with six basic emotions: anger, fear, joy, love, sadness, and surprise.
The dataset has 16,000 labeled examples which the model was trained on.

The model achieves the following results on the Emotion evaluation set:
- Accuracy: 92.65% (float32) version (49MB)
- Accuracy: 81.95% (Quantized int8) version (13MB)

The model is hosted on [Huggingface:bergum/xtremedistil-emotion](https://huggingface.co/bergum/xtremedistil-emotion). 

See [TrainEmotions.ipynb Notebook](TrainEmotions.ipynb) for Training routine and accuracy evaluation using PyTorch
and ONNX-Runtime wwith both float32 and int8 weights. 
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/jobergum/emotion/blob/main/TrainEmotions.ipynb)

Since Cloudfare page limit static asset files to maxium 25MB we use the int8 version with lower accuracy. 

See [ONNX Runtime Web Examples](https://microsoft.github.io/onnxruntime-web-demo/#/) for more examples
of model inference. See also [ONNX Runtime Web—running your machine learning model in browser](https://cloudblogs.microsoft.com/opensource/2021/09/02/onnx-runtime-web-running-your-machine-learning-model-in-browser/). 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Code Navigation

- The App frontend logic is in [src/App.js](src/App.js)
- The model inference logic is in [src/inference.js](src/inference.js)
- The tokenizer is in [src/bert_tokenizer.js](src/bert_tokenizer.ts) which is a copy of [Google TFJS](https://raw.githubusercontent.com/tensorflow/tfjs-models/master/qna/src/bert_tokenizer.ts) (Apache 2.0)

## Language Model Bias
The pre-trained language model was trained on text with biases, 
see [On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?](https://dl.acm.org/doi/10.1145/3442188.3445922) for a study on the dangers of pre-trained language models and transfer learning. The fine-tuned model
was tuned on a rather small dataset of 16,000 labeled examples and the bias in the pre-trained model is inherited by 
the fine tuned model.  

## Running this app 
Install Node.js/npm, see [Installing Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

In the project directory, you can run: 

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### Deploying app
Clone this repo and use Cloudfare Pages. 

## TODO 
- Fix build to copy wasm files from node_modules to build to avoid having wasm files under source control.  
- PR and feedback welcome - create an issue to get in contact. 

