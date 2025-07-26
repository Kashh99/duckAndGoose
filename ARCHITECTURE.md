## 2. `ARCHITECTURE.md`

```markdown
# Architecture Overview

Shadow NAV Sentinel is a lightweight, agentic AI system that continuously monitors and interprets NAV (Net Asset Value) documents, identifying discrepancies between "official" NAVs and reconstructed NAVs based on internal logic.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Node.js Backend│    │  Google Gemini  │
│                 │    │                 │    │      AI API     │
│ • File Upload   │◄──►│ • PDF Parsing   │◄──►│ • NAV Analysis  │
│ • Results Display│    │ • Data Validation│    │ • Reconstruction│
│ • Anomaly Alerts│    │ • API Routes    │    │ • Comparison    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Interface│    │  File Storage   │    │  Logging &      │
│                 │    │                 │    │  Observability  │
│ • Drag & Drop   │    │ • PDF Documents │    │ • Winston Logger│
│ • Real-time     │    │ • Temporary     │    │ • LLM Traces    │
│   Feedback      │    │   Storage       │    │ • Error Tracking│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Components

### 1. Web Frontend (React + TypeScript + Tailwind)
- **FileUpload Component**: Drag-and-drop PDF upload with real-time feedback
- **NAVAnalysis Component**: Displays analysis results, comparisons, and anomalies
- **App Component**: Main orchestrator managing the analysis workflow
- **API Service**: Handles all backend communication with error handling

### 2. Backend (Node.js + Express)
- **Upload Routes**: Handles PDF file uploads and initial parsing
- **Analysis Routes**: Manages NAV reconstruction, comparison, and explanation
- **PDF Service**: Extracts NAV data using pdfplumber with regex patterns
- **Gemini Service**: Orchestrates all LLM interactions for analysis
- **Logger Service**: Winston-based logging for traceability and debugging

### 3. Agent Logic (Gemini AI)
- **System Prompt**: Forensic financial analyst persona with specific expertise
- **NAV Analysis**: Comprehensive analysis of extracted NAV data
- **NAV Reconstruction**: Rebuilds NAV calculations from component data
- **Anomaly Detection**: Compares official vs reconstructed NAVs
- **Explanation Generation**: Provides educational explanations of NAV structure

### 4. Data Flow
1. **Upload**: PDF → Backend → PDF Parsing → Data Extraction
2. **Analysis**: Extracted Data → Gemini AI → Reconstruction + Comparison
3. **Results**: Analysis Results → Frontend → User Display + Alerts

## Key Design Principles

### Lightweight Agentic Design
- Each task is modular and independently solvable
- Clean interfaces between components
- No long-running complex workflows

### Always-On LLM Agent
- Gemini LLM handles all text-based reasoning
- Structured prompts for consistent analysis
- JSON responses for structured data when needed

### Stateless Requests, Persistent Insights
- Each upload/analysis is handled independently
- Comprehensive logging for audit trails
- No persistent user data storage (session-only)

### Security & Observability
- Rate limiting and CORS protection
- Structured logging of all LLM interactions
- Error handling and validation at each step
- File size limits and type validation

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Axios
- **Backend**: Node.js, Express, pdfplumber, Winston
- **AI**: Google Gemini Pro API
- **File Handling**: Multer, UUID generation
- **Security**: Helmet, CORS, Rate limiting

## Scalability Considerations

- Stateless design allows horizontal scaling
- File processing is isolated and temporary
- LLM interactions are logged for debugging
- Modular architecture supports feature additions

