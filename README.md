# Wealth.AI
### Personal finance management small web application powered by prediction models (ML)

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/react-%2320232b.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

## 🌟 Overview
Wealth.AI is a full-stack financial health platform that uses a **Random Forest Regressor** to predict user efficiency scores. It analyzes savings, debt, and income patterns to provide actionable growth recommendations.

## 🚀 Features
- **AI Scoring**: Calculates an overall efficiency score based on real-world financial datasets.
- **Dynamic Reports**: Generates bottleneck analyses identifying your primary growth constraints.
- **Interactive Radar Charts**: Visualizes financial metrics using Spider Data.
- **Secure Auth**: Session-based authentication with encrypted password management.

## 🛠️ Installation

### Backend
1. Navigate to directory: `cd backend`
2. Create virtual environment: `python -m venv venv`
3. Install dependencies: `pip install -r requirements.txt`
4. Run server: `uvicorn main:app --reload`

### Frontend
1. Navigate to directory: `cd frontend`
2. Install packages: `npm install`
3. Start development server: `npm run dev`

## 📊 ML Model Logic
The model is trained on a synthetic financial dataset. It utilizes feature scaling to convert user percentages into dollar-denominated features to ensure high prediction accuracy across varying income levels.

## 🛡️ License
Distributed under the MIT License.

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## 📝 Release Notes

### [v0.1.0] - 2025-12-25
#### Added
- **Reports**: New report feature added -> report generation + report history + discarding reports (history).
#### Fixed
- **Dashboard**: Overhaul to the dashboard elements.
- **User Data**: User score and diagnostic statistics formula adapted.
- **Core Engine**: Prediction model updated and dataset added.
- **User Profile**: Small adjustment added for user profile management
- 
### [v0.0.2] - 2025-12-24
#### Fixed
- **Application Core**: General project structure improved.
- **Dashboard**: Tweaks done to visual elements along with new statistics added.

### [v0.0.1] - 2025-12-23
#### Added
- **Authentication**: Implemented JWT session-based authentication with the use of session validation.
- **User Data**: Added user data management.
- **User Profile**: Added user profile management.
- **Core Engine**: Initial release of the FastAPI backend and React frontend.

