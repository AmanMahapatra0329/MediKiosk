// const accessToken=localStorage.getItem('access');
// test();

// Protecting the page from unauthorized user
let accessToken = localStorage.getItem('access');
if(!accessToken){
    alert('Please login in order to access the page.    ')
    window.location.replace('/');
}
let appointments = [];

//Filling in User detail 
async function Dashboard_request() {
    let response = await fetch('/accounts/api/data/patientdashboard/',{
        method : "GET",
        headers : {
            Authorization : `Bearer ${accessToken}`
        }
    });
    if(response.status == 401){
        accessToken = await RefreshAccessToken();
        if(!accessToken){
            alert('Session has expired , please login again.');
            localStorage.removeItem('access');
            // localStorage.removeItem('refresh');
            window.location.replace('/');
            return
        }
    }
    response = await fetch('/accounts/api/data/patientdashboard/',{
        method : "GET",
        headers : {
            Authorization : `Bearer ${accessToken}`
        }
    });
    console.log('refresh token working successfully');
    const data = await response.json();
    document.querySelector('#dashboard_name').textContent = data.name;
}
Dashboard_request();

async function Appointment_fetch() {
    const AppResponse = await fetch('/appointments/api/fetch/data/appointmentobjects/',{
        method : 'GET',
        headers : {
            Authorization : `Bearer ${accessToken}`
        },
    });
    if(AppResponse.status == 401){
        accessToken = await RefreshAccessToken();
        if(!accessToken){
            alert('Session has expired , please login again.');
            localStorage.removeItem('access');
            // localStorage.removeItem('refresh');
            window.location.replace('/');
            return
        }
    }
    const AppData = await AppResponse.json()
    appointments = AppData;
    AppData.forEach(appointment => {
        const appointment_cart = document.getElementById("appointmentcart");
        const dt = new Date(appointment.date_of_appointment);
        appointment_cart.innerHTML += `
        <li class="appointment-item" data-id="${appointment.id}">
                <div class="appt-date">
                  <span class="appt-day">${dt.toLocaleDateString('en-GB',{
                    day : "numeric"
                  })}</span>
                  <span class="appt-month">${dt.toLocaleDateString('en-GB',{
                    month : "long"
                  })}</span>
                </div>
                <div class="appt-info">
                  <h3>Dr. ${appointment.doctor_name}</h3>
                  <p>${appointment.status} · ${appointment.appointment_type}</p>
                </div>
                <span class="appt-time">${dt.toLocaleDateString('en-GB',{
                    hour : "2-digit"
                })}</span>
              </li>`;
    });
}
let appforrecord;

Appointment_fetch();


const appointment = document.getElementById('appointmentcart');
appointment.addEventListener('click',function(e){
    const row = e.target.closest('.appointment-item');
    if(!row) return;
    const appointmentId = Number(row.dataset.id);
    const appoint = appointments.find(function(item){
        return item.id == appointmentId;
    });
    appforrecord = appointmentId;
    
    document.getElementById("modal-patient").innerText = appoint.patient_name;
    document.getElementById("modal-type").innerText = appoint.appointment_type;
    document.getElementById("modal-date").innerText = appoint.date_of_appointment;
    document.getElementById("modal-status").innerText = appoint.status;
    document.getElementById("modal-reason").innerText = appoint.reason_for_visit;

    document.getElementById("appointment-modal").style.display = "flex";
});
const close_appointment_display = document.querySelector('#close-modal');
close_appointment_display.addEventListener('click',()=>{
    document.getElementById("appointment-modal").style.display = "none";
});




async function MedicalRecord_fetch() {
    const Response = await fetch(`/medicalrecords/api/get/object/medicalrecord/${appforrecord}/`,{
        method : "GET",
        headers : {
            Authorization : `Bearer ${accessToken}`,
            "Content-Type" : "application/json"
        },
    })
    if(Response.status == 401){
        accessToken = await RefreshAccessToken();
        if(!accessToken){
            alert('Session has expired , please login again.');
            localStorage.removeItem('access');
            // localStorage.removeItem('refresh');
            window.location.replace('/');
            return
        }
    }
    // console.log('status',Response.status)
    const data = await Response.json()
    console.log(data)

    document.getElementById("recordBP").textContent = data.bp;
    document.getElementById("recordPulse").textContent = data.pulse;
    document.getElementById("recordTemp").textContent = data.temp;
    document.getElementById("recordOxygen").textContent = data.oxygen_saturation;

    document.getElementById("recordChiefComplaint").textContent =
        data.chief_complaint;

    document.getElementById("recordHistory").textContent =
        data.history_of_current_illness;

    document.getElementById("recordMedicalHistory").textContent =
        data.medical_history;

    document.getElementById("recordDiagnosis").textContent =
        data.diagnosis;

    document.getElementById("recordTreatment").textContent =
        data.treatment_plan;

    document.getElementById("recordDoctorNotes").textContent =
        data.doctor_notes;
}

const modal = document.getElementById("medicalRecordModal");
const medicalrecordview = document.getElementById("medicalrecordbutton");
medicalrecordview.addEventListener('click',()=>{
modal.classList.add("active");
document.getElementById("appointment-modal").style.display = "none";
MedicalRecord_fetch();

});
const medicalrecordclosebutton = document.getElementById('closeMedicalRecord');
medicalrecordclosebutton.addEventListener('click',()=>{
    modal.classList.remove("active");
});


// async function PrescriptionsList() {
//     const Response = await fetch('/prescription/api/list/prescriptions/',{
        
//     })
// }