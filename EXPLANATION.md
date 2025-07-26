# Technical Explanation

## 1. Agent Workflow

The Shadow NAV Sentinel processes NAV documents through the following workflow:

### Step 1: Document Upload & Parsing
1. **File Upload**: User drags-and-drops or selects a NAV PDF document
2. **File Validation**: Backend validates file type (PDF only) and size (10MB limit)
3. **PDF Parsing**: Uses pdfplumber to extract text content from all pages
4. **Data Extraction**: Regex patterns identify key NAV components:
   - Fund name, date, total assets, liabilities, units outstanding
   - Asset and liability breakdowns
   - Official NAV per unit

### Step 2: Data Validation & Processing
1. **Validation**: Checks for required fields and mathematical consistency
2. **Confidence Scoring**: Assigns confidence level based on data quality
3. **Data Structuring**: Organizes extracted data into standardized format

### Step 3: AI Analysis (Gemini AI)
1. **NAV Reconstruction**: AI rebuilds NAV calculation from component data
2. **Comparison Analysis**: Compares official vs reconstructed NAV values
3. **Anomaly Detection**: Identifies discrepancies above 0.01% tolerance
4. **Explanation Generation**: Provides educational explanation of NAV structure

### Step 4: Results Presentation
1. **Risk Assessment**: Categorizes findings by severity (low/medium/high/critical)
2. **Visual Display**: Frontend presents results with clear comparisons
3. **Actionable Insights**: Provides recommendations for investigation

## 2. Key Modules

### Backend Services
- **PDF Service** (`src/backend/services/pdfService.js`): 
  - Extracts NAV data using pdfplumber and regex patterns
  - Validates extracted data for completeness and consistency
  - Handles various PDF formats and structures

- **Gemini Service** (`src/backend/services/geminiService.js`):
  - Orchestrates all LLM interactions with structured prompts
  - Handles NAV reconstruction, comparison, and explanation
  - Manages JSON parsing and error handling for AI responses

- **Logger Service** (`src/backend/utils/logger.js`):
  - Winston-based logging for system events and LLM interactions
  - Separate loggers for general system logs and LLM traces
  - Structured logging for audit trails and debugging

### Frontend Components
- **FileUpload Component** (`src/frontend/src/components/FileUpload.tsx`):
  - Drag-and-drop interface with real-time feedback
  - File validation and upload progress tracking
  - Error handling and user guidance

- **NAVAnalysis Component** (`src/frontend/src/components/NAVAnalysis.tsx`):
  - Displays analysis results with clear visual hierarchy
  - Risk severity indicators and anomaly highlighting
  - Interactive elements for data exploration

- **API Service** (`src/frontend/src/services/api.ts`):
  - Centralized backend communication with error handling
  - Request/response interceptors for logging
  - Type-safe API calls with TypeScript

## 3. Tool Integration

### Google Gemini AI Integration
- **Model**: Gemini Pro for all text analysis and reasoning
- **System Prompt**: Forensic financial analyst persona with specific expertise
- **Structured Outputs**: JSON responses for reconstruction and comparison data
- **Error Handling**: Fallback mechanisms for parsing failures

### PDF Processing Tools
- **pdfplumber**: Primary PDF text extraction library
- **Regex Patterns**: Custom patterns for NAV data identification
- **Data Validation**: Mathematical consistency checks and confidence scoring

### Security & Monitoring Tools
- **Helmet**: Security headers and protection
- **CORS**: Cross-origin request handling
- **Rate Limiting**: Request throttling to prevent abuse
- **Winston**: Comprehensive logging and observability

## 4. Observability & Testing

### Logging Strategy
- **System Logs**: All backend operations logged with timestamps
- **LLM Traces**: Complete logging of all Gemini AI interactions
- **Error Tracking**: Detailed error logging with context
- **Performance Monitoring**: Request timing and resource usage

### Testing Approach
- **Unit Tests**: Individual service and component testing
- **Integration Tests**: API endpoint and data flow testing
- **Error Scenarios**: Testing with malformed PDFs and edge cases
- **Performance Testing**: Large file handling and concurrent requests

### Debugging Capabilities
- **Structured Logs**: JSON-formatted logs for easy parsing
- **LLM Interaction Traces**: Complete prompt/response logging
- **Error Context**: Detailed error information with stack traces
- **Data Validation**: Step-by-step validation logging

## 5. Known Limitations

### PDF Processing Limitations
- **OCR Dependency**: Poorly scanned PDFs may have extraction issues
- **Format Variations**: Different fund structures may require pattern updates
- **Mathematical Precision**: Floating-point precision may affect calculations
- **Language Support**: Currently optimized for English-language documents

### AI Analysis Limitations
- **LLM Hallucinations**: Responses must be validated against extracted data
- **Context Window**: Large documents may exceed token limits
- **API Rate Limits**: Gemini API has request rate limitations
- **Response Parsing**: JSON responses may fail to parse in edge cases

### System Limitations
- **Stateless Design**: No persistent user data or session management
- **File Storage**: Temporary file storage only (no database)
- **Scalability**: Single-instance deployment (no clustering)
- **Security**: Basic authentication not implemented

### Performance Considerations
- **Large Files**: PDFs over 10MB may cause timeout issues
- **Concurrent Requests**: Rate limiting may affect high-volume usage
- **AI Response Time**: Gemini API calls may take 5-15 seconds
- **Memory Usage**: Large PDFs may consume significant memory during processing

### Future Enhancements
- **Database Integration**: Persistent storage for analysis history
- **User Authentication**: Multi-user support with role-based access
- **Advanced OCR**: Tesseract integration for scanned documents
- **Batch Processing**: Support for multiple document analysis
- **API Rate Optimization**: Caching and request batching
- **Real-time Updates**: WebSocket support for live analysis progress

