import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# By default, use a placeholder if api key is missing to prevent startup crash,
# but the methods will fail if invoked without a real key.
def get_llm():
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        raise RuntimeError('GEMINI_API_KEY is missing')
    
    # List of models to try in order of preference.
    # gemini-2.0-flash is the latest fast model.
    # gemini-pro is the most stable fallback.
    models_to_try = [
        os.getenv('GEMINI_MODEL', 'gemini-2.0-flash'),
        'gemini-pro',
        'gemini-flash-latest'
    ]
    
    last_err = None
    for model_name in models_to_try:
        try:
            print(f"DEBUG: Trying model {model_name}...")
            llm = ChatGoogleGenerativeAI(model=model_name, google_api_key=api_key)
            # We must actually invoke it to see if the name is valid in your account
            llm.invoke("ping") 
            print(f"DEBUG: Successfully connected to {model_name}")
            return llm
        except Exception as e:
            print(f"DEBUG: Model {model_name} failed: {str(e)}")
            last_err = e
            continue
            
    raise last_err if last_err else RuntimeError("No Gemini models available in your account")

def summarize_note_content(content: str) -> str:
    llm = get_llm()
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert tutor. Summarize the following study notes in clear, bulleted points."),
        ("user", "{content}")
    ])
    chain = prompt | llm | StrOutputParser()
    return chain.invoke({"content": content})

def answer_question_from_notes(notes_content: str, question: str) -> str:
    llm = get_llm()
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful study assistant. Answer the user's question explicitly based on the provided notes context. If the answer is not in the notes, say 'I cannot find the answer in the provided notes, but here is my general knowledge:' and provide a helpful answer."),
        ("user", "Notes Context: {notes_content}\n\nQuestion: {question}")
    ])
    chain = prompt | llm | StrOutputParser()
    return chain.invoke({"notes_content": notes_content, "question": question})

def generate_study_plan(subjects: list, deadline: str) -> str:
    llm = get_llm()
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert study planner. Create a highly structured and actionable daily study plan for the given subjects ending on the deadline. Format the plan clearly using Markdown."),
        ("user", "Subjects: {subjects}\nDeadline: {deadline}")
    ])
    chain = prompt | llm | StrOutputParser()
    return chain.invoke({"subjects": ", ".join(subjects), "deadline": deadline})
