# MediKiosk 🏥

**MediKiosk** is a digital hospital management system designed to simplify and organize interactions between patients, doctors, and hospital services.

The project focuses on providing a centralized platform for managing patient information, appointments, medical records, prescriptions, and guided patient symptom collection.

## ✨ Features

### 👤 Patient Management

* Patient authentication and dashboard
* Patient-specific information and records
* Language selection
* Guided symptom/questionnaire flow

### 📅 Appointment Management

* Appointment creation and management
* Preferred appointment date and time
* Patient symptoms and symptom duration
* Urgency-based appointment processing
* Appointment status tracking

### 🩺 Medical Records

* Medical records linked to appointments
* Vital signs and clinical information
* Chief complaint and medical history
* Diagnosis and treatment plan
* Doctor notes

### 💊 Prescription Management

* Create prescriptions associated with appointments
* Medication, dosage, frequency, duration, and route
* Quantity and instructions
* Doctor notes
* Prescription status tracking

### 💬 Patient Questionnaire

MediKiosk includes a conversational questionnaire approach where predefined questions are presented one at a time.

```text
System → Question
Patient → Answer
System → Next Question
Patient → Answer
...
```

The collected responses can be used as part of the patient's appointment and symptom information.

### 🔐 Authentication

The system uses JWT-based authentication.

* Access tokens are used for authenticated API requests.
* Refresh tokens are stored using HTTP-only cookies.
* Protected API endpoints use Django REST Framework authentication and permissions.

## 🛠️ Technology Stack

### Backend

* Python
* Django
* Django REST Framework
* Simple JWT

### Frontend

* HTML
* CSS
* JavaScript

### Database

* Django-supported relational database

## 🏗️ Project Structure

The project is organized into separate Django applications based on functionality.

```text
MediKiosk/
│
├── accounts/
│   └── Authentication and user-related functionality
│
├── appointments/
│   └── Appointment management
│
├── medicalrecords/
│   └── Patient medical records
│
├── prescription/
│   └── Prescription management
│
├── templates/
│   └── Frontend HTML templates
│
├── static/
│   └── CSS and JavaScript assets
│
└── manage.py
```

## 🔄 General Workflow

```text
                    MediKiosk
                       │
          ┌────────────┴────────────┐
          │                         │
       Patient                    Doctor
          │                         │
          ▼                         ▼
   Patient Dashboard         Doctor Dashboard
          │                         │
          ▼                         ▼
   Symptom Questions          Appointments
          │                         │
          ▼                         ▼
   Appointment Request       Medical Records
                                    │
                                    ▼
                              Prescriptions
```

## 🔑 Authentication Flow

MediKiosk uses JWT authentication with a short-lived access token and a refresh token stored in an HTTP-only cookie.

```text
Login
  │
  ├── Access Token → Frontend
  │
  └── Refresh Token → HTTP-only Cookie
```

Authenticated API requests use:

```http
Authorization: Bearer <access_token>
```

When the access token needs to be refreshed, the refresh token is retrieved by the backend from the HTTP-only cookie.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd MediKiosk
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

Activate it:

**Windows**

```bash
venv\Scripts\activate
```

**Linux/macOS**

```bash
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Apply migrations

```bash
python manage.py migrate
```

### 5. Create a superuser

```bash
python manage.py createsuperuser
```

### 6. Start the development server

```bash
python manage.py runserver
```

The application will be available at:

```text
http://127.0.0.1:8000/
```

## 🔮 Future Development

Planned improvements include:

* More advanced patient symptom analysis
* Improved appointment scheduling and prioritization
* Enhanced doctor-patient communication
* More comprehensive medical history management
* Improved questionnaire and conversational interfaces
* Production-ready security and deployment configuration
* Hospital staff and administrative modules

## 📌 Project Status

MediKiosk is currently under active development. Core hospital-management functionality is being implemented incrementally, with authentication, appointments, medical records, prescriptions, dashboards, and the patient questionnaire forming the foundation of the system.

## 📄 License

This project is currently intended for educational and development purposes.
