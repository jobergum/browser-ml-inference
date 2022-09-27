# Text Emotion Prediction in Browser

This React App demonstrates ML Inference in the Browser using

- [Cloudflare Pages](https://pages.cloudflare.com/) to deliver the React app and model via worldwide Content Delivery Network (CDN)
- [ONNX Runtime Web](https://onnxruntime.ai/) for model inference in the Browser
- [Huggingface](https://huggingface.co/bergum/xtremedistil-l6-h384-go-emotion) for NLP model hosting and training API (Transformer library) 
- [Google Colab](https://colab.research.google.com/) for model training using GPU instances 

Live demo at [https://aiserv.cloud/](https://aiserv.cloud/). 

<p align="center">
  <img src="GoEmotions.gif" />
</p>

See also my blog post [Moving ML Inference from the Cloud to the Edge](https://bergum.medium.com/moving-ml-inference-from-the-cloud-to-the-edge-d6f98dbdb2e3?source=friends_link&sk=e8183a3a8c10077110952b213ba5bef4) and [Deploy Transformer Models in the Browser with #ONNXRuntime on YouTube](https://www.youtube.com/watch?v=W_lUGPMW_Eg). 

The emotion prediction model is a fine-tuned version of the pre-trained language model 
[microsoft/xtremedistil-l6-h384-uncased](https://huggingface.co/microsoft/xtremedistil-l6-h384-uncased). 
The model has been fine-tuned on the 
[GoEmotions dataset](https://ai.googleblog.com/2021/10/goemotions-dataset-for-fine-grained.html) which is a multi-label 
text categorization problem. 


>GoEmotions, a human-annotated dataset of 58k Reddit comments extracted from popular English-language subreddits and labeled with 27 emotion categories . As the largest fully annotated English language fine-grained emotion dataset to date. In contrast to the basic six emotions, which include only one  positive emotion (joy), the taxonomy includes 12 positive, 11 negative, 4 ambiguous emotion categories and 1 “neutral”, making it widely suitable for conversation understanding tasks that require a subtle differentiation between emotion expressions.

Paper [GoEmotions: A Dataset of Fine-Grained Emotions](https://arxiv.org/pdf/2005.00547.pdf)

- The fine-tuned model is hosted on [Huggingface:bergum/xtremedistil-l6-h384-go-emotion](https://huggingface.co/bergum/xtremedistil-l6-h384-go-emotion). 
- The `go_emotions` dataset is available on [Huggingface dataset hub](https://huggingface.co/datasets/go_emotions). 

See [TrainGoEmotions.ipynb](TrainGoEmotions.ipynb ) for how to train a model on the dataset and export the fine-tuned model to ONNX. 
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/jobergum/emotion/blob/main/TrainGoEmotions.ipynb)

## ONNX-Runtime-web
The model is quantized to `int8` weights and has 22M trainable parameters. 

Inference is multi-threaded. To use
multiple inference threads, specific http headers must be presented by the CDN, see 
[Making your website "cross-origin isolated" using COOP and COEP](https://web.dev/coop-coep/). 

Three threads are used for inference. Due to this [bug](https://github.com/microsoft/onnxruntime/issues/11679) 
multi-threading and COOP headers had to be disabled as the model would silently fail to initialize on IOS devices.

For development, the [src/setupProxy.js](src/setupProxy.js) adds the required headers. 
See [react issue 10210](https://github.com/facebook/create-react-app/issues/10210)

## Code Navigation
- The App frontend logic is in [src/App.js](src/App.js)
- The model inference logic is in [src/inference.js](src/inference.js)
- The tokenizer is in [src/bert_tokenizer.js](src/bert_tokenizer.ts) which is a copy of [Google TFJS](https://raw.githubusercontent.com/tensorflow/tfjs-models/master/qna/src/bert_tokenizer.ts) (Apache 2.0)
- Cloudflare header override for cross-origin coop policy to enable multi threaded inference [public/_header](public/_headers). 

## Model and Language Biases
The pre-trained language model was trained on text with biases, 
see [On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?](https://dl.acm.org/doi/10.1145/3442188.3445922) 
for a study on the dangers of pre-trained language models and transfer learning. 

From dataset paper [GoEmotions: A Dataset of Fine-Grained Emotions](https://arxiv.org/pdf/2005.00547.pdf):
>Data Disclaimer: We are aware that the dataset
contains biases and is not representative of global
diversity. We are aware that the dataset contains
potentially problematic content. Potential biases in
the data include: Inherent biases in Reddit and user
base biases, the offensive/vulgar word lists used
for data filtering, inherent or unconscious bias in
assessment of offensive identity labels, annotators
were all native English speakers from India. All
these likely affect labeling, precision, and recall
for a trained model. The emotion pilot model used
for sentiment labeling, was trained on examples
reviewed by the research team. Anyone using this
dataset should be aware of these limitations of the
dataset.

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
Clone this repo and use [Cloudflare Pages](https://pages.cloudflare.com/). 

## TODO 
- Fix build to copy wasm files from node_modules to build to avoid having wasm files under source control.  
- PR and feedback welcome - create an issue to get in contact. 

