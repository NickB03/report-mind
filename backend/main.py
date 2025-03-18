
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Header, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import os
import logging
import uuid
from datetime import datetime
import asyncio
import traceback

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="AnalystAI PDF Processor")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Specify your frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class ExtractionOptions(BaseModel):
    extractText: bool = True
    detectCharts: bool = True
    detectTables: bool = True
    generateInsights: bool = True
    vectorize: bool = True

class ExtractionStatus(BaseModel):
    id: str
    reportId: str
    status: str
    text: List[str] = []
    tables: List[Dict[str, Any]] = []
    charts: List[Dict[str, Any]] = []
    insights: List[Dict[str, Any]] = []
    summary: Optional[str] = None
    industry: Optional[str] = None
    vectorized: Optional[bool] = None
    chunks: Optional[int] = None
    error: Optional[str] = None
    created_at: datetime = None
    updated_at: datetime = None

# In-memory storage for demo
extraction_tasks = {}

# Authentication middleware
async def verify_api_key(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="API key is missing")
    
    # Format: "Bearer YOUR_API_KEY"
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization header format")
    
    api_key = parts[1]
    # In production, validate against stored API keys
    # For demo, accept any key
    return api_key

# Routes
@app.post("/api/extract-pdf")
async def extract_pdf(
    fileId: str = Form(...),
    options: str = Form(...),
    api_key: str = Depends(verify_api_key)
):
    try:
        # Parse options
        extraction_options = ExtractionOptions(**json.loads(options))
        
        # Generate task ID
        task_id = str(uuid.uuid4())
        
        # Initialize task status
        extraction_tasks[task_id] = {
            "id": task_id,
            "reportId": fileId,
            "status": "processing",
            "text": [],
            "tables": [],
            "charts": [],
            "insights": [],
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
        }
        
        # Start async processing
        asyncio.create_task(process_pdf(task_id, fileId, extraction_options))
        
        return {"id": task_id, "status": "processing"}
    
    except Exception as e:
        logger.error(f"Error starting PDF extraction: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/extraction-status/{task_id}")
async def get_extraction_status(
    task_id: str,
    api_key: str = Depends(verify_api_key)
):
    if task_id not in extraction_tasks:
        raise HTTPException(status_code=404, detail="Extraction task not found")
    
    return extraction_tasks[task_id]

@app.get("/api/download/{task_id}")
async def download_extraction(
    task_id: str,
    format: str = "json",
    api_key: str = Depends(verify_api_key)
):
    if task_id not in extraction_tasks:
        raise HTTPException(status_code=404, detail="Extraction task not found")
    
    task = extraction_tasks[task_id]
    if task["status"] != "completed":
        raise HTTPException(status_code=400, detail="Extraction not yet completed")
    
    # In a real implementation, generate and return the requested file
    # For demo, return a simple JSON response
    return JSONResponse(content=task)

# Background PDF processing function
async def process_pdf(task_id: str, file_id: str, options: ExtractionOptions):
    try:
        # Simulate processing delay
        await asyncio.sleep(5)
        
        # Update with mock data
        extraction_tasks[task_id].update({
            "status": "completed",
            "text": ["Sample extracted text from page 1.", "Sample extracted text from page 2."],
            "tables": [
                {
                    "id": "table-1",
                    "title": "Market Share Analysis",
                    "data": [
                        ["Vendor", "Market Share (%)", "Growth YoY (%)"],
                        ["Vendor A", "32.5", "4.2"],
                        ["Vendor B", "28.1", "3.7"],
                    ],
                    "page": 2
                }
            ],
            "charts": [
                {
                    "id": "chart-1",
                    "title": "Revenue Forecast",
                    "type": "bar",
                    "imageUrl": "/chart-1.png",
                    "page": 3
                }
            ],
            "insights": [
                {
                    "id": "insight-1",
                    "text": "The market is expected to grow at a CAGR of 14.5% over the next five years.",
                    "confidence": 0.92,
                    "category": "Market Trends"
                }
            ],
            "summary": "This is a sample report summary.",
            "industry": "Technology",
            "vectorized": True,
            "chunks": 24,
            "updated_at": datetime.now()
        })
        
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}")
        logger.error(traceback.format_exc())
        extraction_tasks[task_id].update({
            "status": "failed",
            "error": str(e),
            "updated_at": datetime.now()
        })

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
