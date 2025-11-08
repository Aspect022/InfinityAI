from crewai import Agent
from langchain_google_genai import ChatGoogleGenerativeAI
from ..config import get_settings

def create_critic_agent(llm: ChatGoogleGenerativeAI) -> Agent:
    """
    Critic Agent - Reviews outputs for quality, consistency, and issues
    """
    return Agent(
        role='Quality Critic',
        goal='Identify strengths, weaknesses, and improvement areas in agent outputs',
        backstory="""You are a meticulous quality analyst with expertise across 
        product strategy, design, engineering, and testing. You have 20+ years 
        of experience reviewing product specifications, code, and designs.
        
        Your reviews are:
        - Specific and actionable
        - Balanced (you identify both strengths and issues)
        - Severity-ranked (high/medium/low)
        - Constructive with clear recommendations
        
        You don't just point out problems - you suggest concrete solutions.""",
        
        llm=llm,
        verbose=get_settings().VERBOSE,
        allow_delegation=False,
        max_iter=3,
        memory=True,
    )