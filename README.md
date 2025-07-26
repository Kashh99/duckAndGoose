# Shadow NAV Sentinel

**NAV Document Analysis & Anomaly Detection**

Shadow NAV Sentinel is an agentic AI system that continuously monitors and interprets NAV (Net Asset Value) documents, identifying discrepancies between "official" NAVs and reconstructed NAVs based on internal logic, providing transparency and anomaly detection for investors and regulators.

## 🚀 Features

- **📄 PDF Processing**: Automatic extraction of NAV data from PDF documents
- **🤖 AI Analysis**: Gemini AI-powered NAV reconstruction and comparison
- **🔍 Anomaly Detection**: Identifies discrepancies with severity assessment
- **📊 Visual Results**: Clear comparison and risk assessment display
- **🔒 Security**: Secure file handling with comprehensive logging
- **📱 Responsive UI**: Modern React interface with drag-and-drop upload

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Node.js Backend│    │  Google Gemini  │
│                 │    │                 │    │      AI API     │
│ • File Upload   │◄──►│ • PDF Parsing   │◄──►│ • NAV Analysis  │
│ • Results Display│    │ • Data Validation│    │ • Reconstruction│
│ • Anomaly Alerts│    │ • API Routes    │    │ • Comparison    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd shadow-nav-sentinel
```

### 2. Environment Setup

Copy the environment template and configure your settings:

```bash
cp env.example .env
```

Edit `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Backend Setup

```bash
cd src/backend
npm install
```

### 4. Frontend Setup

```bash
cd src/frontend
npm install
```

## 🚀 Running the Application

### Development Mode

1. **Start the Backend** (Terminal 1):
```bash
cd src/backend
npm run dev
```

2. **Start the Frontend** (Terminal 2):
```bash
cd src/frontend
npm start
```

3. **Access the Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

### Production Build

```bash
# Build frontend
cd src/frontend
npm run build

# Start backend
cd src/backend
npm start
```

## 📖 Usage

### 1. Upload NAV Document

1. Open the application in your browser
2. Drag and drop a NAV PDF document or click to select
3. Wait for file validation and upload processing

### 2. Review Analysis Results

The system will automatically:
- Extract NAV data from the PDF
- Reconstruct NAV calculations using AI
- Compare official vs reconstructed values
- Detect anomalies and assess risk severity
- Generate detailed explanations

### 3. Interpret Results

- **Risk Severity**: Color-coded indicators (low/medium/high/critical)
- **NAV Comparison**: Side-by-side official vs reconstructed values
- **Anomalies**: Detailed list of detected discrepancies
- **Recommendations**: Actionable insights for investigation

## 🔧 API Endpoints

### Upload Endpoints
- `POST /api/upload` - Upload and parse NAV PDF
- `GET /api/upload/status/:documentId` - Check processing status
- `DELETE /api/upload/:documentId` - Remove document

### Analysis Endpoints
- `POST /api/analysis/full` - Complete NAV analysis
- `POST /api/analysis/reconstruct` - Reconstruct NAV calculation
- `POST /api/analysis/compare` - Compare NAV values
- `POST /api/analysis/explain` - Generate NAV explanation

### Health Checks
- `GET /health` - Backend health status
- `GET /api/analysis/health` - Analysis service health

## 🧪 Testing

### Backend Tests
```bash
cd src/backend
npm test
```

### Frontend Tests
```bash
cd src/frontend
npm test
```

### Manual Testing
1. Upload a sample NAV PDF document
2. Verify data extraction accuracy
3. Check AI analysis results
4. Test error handling with invalid files

## 📁 Project Structure

```
shadow-nav-sentinel/
├── src/
│   ├── backend/
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # Business logic services
│   │   └── utils/           # Utility functions
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/  # React components
│   │   │   ├── services/    # API service layer
│   │   │   └── types/       # TypeScript definitions
│   │   └── public/          # Static assets
│   ├── agents/              # AI agent logic
│   ├── examples/            # Sample documents
│   └── tests/               # Test files
├── data/
│   └── uploads/             # Temporary file storage
├── logs/                    # Application logs
├── docs/                    # Documentation
└── README.md
```

## 🔒 Security Features

- **File Validation**: PDF-only uploads with size limits
- **Rate Limiting**: Request throttling to prevent abuse
- **CORS Protection**: Cross-origin request handling
- **Security Headers**: Helmet.js protection
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Secure error responses

## 📊 Logging & Observability

- **System Logs**: Winston-based structured logging
- **LLM Traces**: Complete Gemini AI interaction logs
- **Error Tracking**: Detailed error context and stack traces
- **Performance Monitoring**: Request timing and resource usage

## 🚨 Known Limitations

### PDF Processing
- OCR dependency for scanned documents
- Format variations may require pattern updates
- Mathematical precision considerations
- English-language optimization

### AI Analysis
- LLM response validation required
- Context window limitations
- API rate limits
- Response parsing edge cases

### System
- Stateless design (no persistent storage)
- Single-instance deployment
- Basic authentication not implemented

## 🔮 Future Enhancements

- **Database Integration**: Persistent analysis history
- **User Authentication**: Multi-user support
- **Advanced OCR**: Tesseract integration
- **Batch Processing**: Multiple document analysis
- **Real-time Updates**: WebSocket support
- **API Optimization**: Caching and batching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for advanced language model capabilities
- **React & Node.js** communities for excellent tooling
- **Financial industry experts** for domain knowledge and feedback

## 📞 Support

For questions, issues, or contributions:
- Create an issue in the repository
- Review the documentation in `/docs`
- Check the logs for debugging information

---

**Shadow NAV Sentinel** - Enhancing financial transparency through AI-powered NAV analysis and anomaly detection.


