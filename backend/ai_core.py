import numpy as np 
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from datasets import load_dataset

#loading pretrained model
model = SentenceTransformer("sentence-transformers/all-miniLM-L6-v2")

#loading medical dataset for req-resp
dataset = load_dataset('lavita/MedQuAD', split='train')
dataset = dataset.select(range(500))

medical_data = [{
    'question': item['question'],
    'answer': item['answer']

} for item in dataset
]

questions = [item['question'] for item in medical_data]
print('Encoding Dataset Embeddings..')
question_embeddings = model.encode(questions, show_progress_bar= True)

#analysing query
def analyse_query(user_query: str):
    query_embedding = model.encode([user_query])
    scores = cosine_similarity(query_embedding, question_embeddings)[0]
    best_idx = int(np.argmax(scores))
    best_score= float(scores[best_idx])
    best_match = medical_data[best_idx]
    #confidence logic
    if best_score <0.50:
        return{
            'risk' : 'uncertain',
            'confidence': round(best_score, 2),
            'response' : (
                'I am not fully certain about your condition..'
                'It would be safest to consult a healthcare professional/ Doctor..'
            )   
        }
    elif best_score <0.70:
        return{
            'risk': 'moderate',
            'confidence': round(best_score,2),
            'response': (
                f"This may be related to: {best_match['answer']} "
                'If any symptoms worsen, please do consult a doctor..'
            )
        }
    else:
        return{
            'risk': 'high-confidence_match',
            'confidence':round(best_score,2),
            'response': (
                f"{best_match['answer']} "
                'Please seek professional medical advice if needed'
            )
        }