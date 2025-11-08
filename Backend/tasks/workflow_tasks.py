from crewai import Task
from typing import List

def create_ceo_task(ceo_agent, user_idea: str) -> Task:
    return Task(
        description=f"""
        Analyze this product idea and create a strategic vision:
        
        IDEA: {user_idea}
        
        Your output must include:
        1. Product Vision Statement (2-3 sentences)
        2. Market Opportunity Analysis
        3. Target User Segments (3-4 segments)
        4. Competitive Positioning
        5. Core Value Proposition
        6. Success Metrics (5-7 key metrics)
        7. Risk Assessment
        
        Be specific and actionable. Ground your vision in market reality.
        """,
        agent=ceo_agent,
        expected_output="Comprehensive strategic vision document"
    )

def create_critic_task(critic_agent, agent_name: str, previous_task: Task) -> Task:
    return Task(
        description=f"""
        Review the output from {agent_name} and provide detailed critique.
        
        Your critique must include:
        
        ✅ STRENGTHS (2-3 specific strong points)
        
        ⚠️ ISSUES FOUND:
        - [HIGH severity]: Critical problems that must be fixed
        - [MEDIUM severity]: Important improvements needed
        - [LOW severity]: Nice-to-have enhancements
        
        💡 RECOMMENDATIONS (3-5 specific, actionable suggestions)
        
        📊 STATUS: [Approved with minor notes | Needs improvement | Rejected]
        
        🎯 QUALITY SCORE: X/100 (based on completeness, clarity, actionability)
        
        Be specific - reference exact sections/points that need work.
        """,
        agent=critic_agent,
        expected_output="Structured critique with severity-ranked issues",
        context=[previous_task]
    )

def create_improver_task(improver_agent, agent_name: str, 
                        original_task: Task, critic_task: Task) -> Task:
    return Task(
        description=f"""
        Improve the {agent_name} output based on critic feedback.
        
        Your refined output must:
        1. Address ALL high-severity issues
        2. Fix most medium-severity issues
        3. Maintain the original structure and intent
        4. Document changes made
        
        Provide:
        
        🔧 IMPROVEMENTS MADE:
        • Fixed: [issue] → [solution]
        • Enhanced: [area] → [improvement]
        • Added: [new element based on recommendation]
        
        📊 CHANGES SUMMARY:
        • Sections modified: X
        • Quality improvement: +Y%
        
        ✅ UPDATED OUTPUT:
        [Complete improved version]
        """,
        agent=improver_agent,
        expected_output="Enhanced output with documented improvements",
        context=[original_task, critic_task]
    )