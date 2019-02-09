#!/usr/bin/env python
# coding: utf-8

# In[72]:


# things we need for NLP
import nltk
from nltk.stem.lancaster import LancasterStemmer
stemmer = LancasterStemmer()

# things we need for Tensorflow
import numpy as np
import tflearn
import tensorflow as tf
import random
import json
from flask import Flask, render_template, request, jsonify, render_template_string


# In[73]:


# restore all of our data structures
import pickle
tf.reset_default_graph()
data = pickle.load( open( "training_data", "rb" ) )
words = data['words']
classes = data['classes']
train_x = data['train_x']
train_y = data['train_y']

# import our chat-bot intents file
import json
with open('intents.json') as json_data:
    intents = json.load(json_data)


# In[74]:


# Build neural network
net = tflearn.input_data(shape=[None, len(train_x[0])])
net = tflearn.fully_connected(net, 8)
net = tflearn.fully_connected(net, 8)
net = tflearn.fully_connected(net, len(train_y[0]), activation='softmax')
net = tflearn.regression(net)

# Define model and setup tensorboard
model = tflearn.DNN(net, tensorboard_dir='tflearn_logs')


# In[75]:


def clean_up_sentence(sentence):
    # tokenize the pattern
    sentence_words = nltk.word_tokenize(sentence)
    # stem each word
    sentence_words = [stemmer.stem(word.lower()) for word in sentence_words]
    return sentence_words

# return bag of words array: 0 or 1 for each word in the bag that exists in the sentence
def bow(sentence, words, show_details=False):
    # tokenize the pattern
    sentence_words = clean_up_sentence(sentence)
    # bag of words
    bag = [0]*len(words)  
    for s in sentence_words:
        for i,w in enumerate(words):
            if w == s: 
                bag[i] = 1
                if show_details:
                    print ("found in bag: %s" % w)

    return(np.array(bag))


# In[76]:


p = bow("is your shop open today?", words)
print (p)
print (classes)


# In[77]:


# load our saved model

model.load('./model.tflearn')


# In[78]:


# create a data structure to hold user context
context = {}

ERROR_THRESHOLD = 0.25
def classify(sentence):
    # generate probabilities from the model
    results = model.predict([bow(sentence, words)])[0]
    # filter out predictions below a threshold
    results = [[i,r] for i,r in enumerate(results) if r>ERROR_THRESHOLD]
    # sort by strength of probability
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append((classes[r[0]], r[1]))
    # return tuple of intent and probability
    return return_list

def response(sentence, userID='123', show_details=False):
    results = classify(sentence)
    print(results)
    # if we have a classification then find the matching intent tag
    
    if (userID in context and context[userID] is not None):
        for i in intents['intents']:
            if ('context_filter' in i and i["context_filter"] == context[userID]):
                if ('context_set' in i):
                    context[userID] = i['context_set']
                else:
                    context[userID] = None
                return random.choice(i["responses"]);
    
    if results:
        # loop as long as there are matches to process
        while results:
            for i in intents['intents']:
                # find a tag matching the first result
                if i['tag'] == results[0][0]:
                    # set context for this intent if necessary
                    contextValue = None
                    if 'context_set' in i:
                        if show_details: print ('context:', i['context_set'])
                        contextValue = i['context_set']
                        

                    # check if this intent is contextual and applies to this user's conversation
                    if not 'context_filter' in i or \
                        (userID in context and 'context_filter' in i and i['context_filter'] == context[userID]):
                        if show_details: print ('tag:', i['tag'])
                        # a random response from the intent
                        if (contextValue is not None):
                            context[userID] = i['context_set']
                        return random.choice(i['responses'])
                    
                    if (contextValue is not None):
                        context[userID] = i['context_set']

            results.pop(0)


# In[81]:


classify('tere')


# In[83]:


response('tere')


# In[15]:


response('do you take cash?')


# In[16]:


response('what kind of mopeds do you rent?')


# In[17]:


response('Goodbye, see you later')


# In[13]:


context


# In[18]:


response('we want to rent a moped')


# In[19]:


# show context
context


# In[20]:


response('today')


# In[21]:


classify('today')


# In[22]:


# clear context
response("Hi there!", show_details=True)


# In[23]:


response('today')
classify('today')


# In[24]:


response("thanks, your great")

app = Flask(__name__)
def make_app():
    app = Flask(__name__)

    @app.route('/')
    def index():
      return render_template('./index.html')

    @app.route('/chat', methods=['POST'])
    def chat():
        print(context)
        request.accept_mimetypes['application/json']
        message = request.get_json()['message']

        result = response(message)

        return json.dumps({'response': result})
    
    return app

if __name__ == '__main__':
  app = make_app()
  app.run(port=8080)