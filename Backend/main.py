from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import logging

from .crews.flowmaster_crew import FlowMasterCrew
from .config import get_settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="FlowMaster API", version="1.0.0")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replit frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class IdeaRequest(BaseModel):
    idea: str
    enable_memory: Optional[bool] = True

class WorkflowResponse(BaseModel):
    project_name: str
    status: str
    workflow: dict
    execution_time: float

# Initialize FlowMaster crew
flowmaster = FlowMasterCrew()

@app.post("/api/generate-workflow", response_model=WorkflowResponse)
async def generate_workflow(request: IdeaRequest):
    """
    Main endpoint - generates complete multi-agent workflow
    """
    try:
        logger.info(f"Received idea: {request.idea}")
        
        # Run the crew
        result = await flowmaster.run_workflow(request.idea)
        
        return WorkflowResponse(
            project_name=result.get('project_name', 'FlowMaster Project'),
            status='completed',
            workflow=result,
            execution_time=result.get('execution_time', 0)
        )
        
    except Exception as e:
        logger.error(f"Error generating workflow: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "FlowMaster API"}

@app.get("/")
async def root():
    return {
        "message": "FlowMaster API",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)