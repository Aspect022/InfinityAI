from crewai import Agent
from langchain_google_genai import ChatGoogleGenerativeAI
from ..config import get_settings

def create_improver_agent(llm: ChatGoogleGenerativeAI) -> Agent:
    """
    Improver Agent - Takes critic feedback and refines outputs
    """
    return Agent(
        role='Output Improver',
        goal='Refine and enhance agent outputs based on critic feedback',
        backstory="""You are an expert at taking constructive criticism and 
        transforming it into improved deliverables. You have deep expertise across
        all domains (strategy, design, engineering) and can quickly iterate on work.
        
        Your approach:
        - Address all critical issues first
        - Make targeted improvements (don't rewrite everything)
        - Maintain the original intent while fixing problems
        - Document what you changed and why
        - Improve quality scores by 15-30% on average
        
        You're efficient and don't over-engineer solutions.""",
        
        llm=llm,
        verbose=get_settings().VERBOSE,
        allow_delegation=False,
        max_iter=3,
        memory=True,
    )