from crewai import Crew, Process
from langchain_google_genai import ChatGoogleGenerativeAI
from ..agents import (
    create_ceo_agent,
    create_pm_agent,
    create_designer_agent,
    create_frontend_agent,
    create_backend_agent,
    create_qa_agent,
    create_critic_agent,
    create_improver_agent
)
from ..tasks.workflow_tasks import (
    create_ceo_task,
    create_critic_task,
    create_improver_task
)
from ..config import get_settings

class FlowMasterCrew:
    def __init__(self):
        self.settings = get_settings()
        self.llm = ChatGoogleGenerativeAI(
            model=self.settings.GEMINI_MODEL,
            google_api_key=self.settings.GOOGLE_API_KEY
        )
        
        # Initialize all agents
        self.ceo = create_ceo_agent(self.llm)
        self.pm = create_pm_agent(self.llm)
        self.designer = create_designer_agent(self.llm)
        self.frontend = create_frontend_agent(self.llm)
        self.backend_eng = create_backend_agent(self.llm)
        self.qa = create_qa_agent(self.llm)
        self.critic = create_critic_agent(self.llm)
        self.improver = create_improver_agent(self.llm)
    
    def create_workflow_with_review(self, user_idea: str):
        """
        Creates complete workflow with critic review + improver cycle for each agent
        """
        tasks = []
        
        # CEO → Critic → Improver
        ceo_task = create_ceo_task(self.ceo, user_idea)
        tasks.append(ceo_task)
        
        ceo_critic_task = create_critic_task(self.critic, "CEO", ceo_task)
        tasks.append(ceo_critic_task)
        
        ceo_improved_task = create_improver_task(
            self.improver, "CEO", ceo_task, ceo_critic_task
        )
        tasks.append(ceo_improved_task)
        
        # PM → Critic → Improver
        pm_task = create_pm_task(self.pm, ceo_improved_task)
        tasks.append(pm_task)
        
        pm_critic_task = create_critic_task(self.critic, "PM", pm_task)
        tasks.append(pm_critic_task)
        
        pm_improved_task = create_improver_task(
            self.improver, "PM", pm_task, pm_critic_task
        )
        tasks.append(pm_improved_task)
        
        # ... repeat for all 7 main agents
        
        # Create crew
        crew = Crew(
            agents=[
                self.ceo, self.pm, self.designer,
                self.frontend, self.backend_eng, self.qa,
                self.critic, self.improver
            ],
            tasks=tasks,
            process=Process.sequential,
            verbose=2,
            memory=self.settings.ENABLE_MEMORY,
        )
        
        return crew
    
    async def run_workflow(self, user_idea: str):
        """Execute the complete workflow"""
        crew = self.create_workflow_with_review(user_idea)
        result = await crew.kickoff_async(inputs={'idea': user_idea})
        return result