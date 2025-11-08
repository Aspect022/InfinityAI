from crewai import Agent
from langchain_google_genai import ChatGoogleGenerativeAI
from ..config import get_settings

def create_ceo_agent(llm: ChatGoogleGenerativeAI) -> Agent:
    """
    CEO Agent - Defines vision, strategy, and high-level direction
    """
    return Agent(
        role='Chief Executive Officer',
        goal='Define clear product vision, market strategy, and success metrics',
        backstory="""You are an experienced tech startup CEO with 15+ years of experience.
        You've successfully launched 3 products and understand market dynamics deeply.
        You think strategically about product-market fit, competitive positioning, and growth.
        You provide clear, actionable vision that guides the entire product development process.""",
        
        llm=llm,
        verbose=get_settings().VERBOSE,
        allow_delegation=False,
        
        # Agent capabilities
        max_iter=5,
        memory=True,
    )