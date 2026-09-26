import nltk
nltk.download("punkt_tab")
from nltk.tokenize import word_tokenize
sentence = 'I have a sever headache!.' # this is python's nltk library used to tokenize the sentence provided , it's a gateway to nlp
tokens = word_tokenize(sentence)
print(tokens)

