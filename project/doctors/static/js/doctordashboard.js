console.log('doctor dashboard js loaded')
const accessToken = localStorage.getItem('access');
let appointments=[];
let aptforpres ;
async function DoctorData(){
const response = await fetch('/accounts/api/doctordata/',{
    method : "GET",
    headers : {
        "Authorization" : `Bearer ${accessToken}`
    },
    });
    const data = await response.json();
    const name = document.querySelector('#doc-name');
    name.textContent =  data.full_name;
}
DoctorData()

const signoutbutton = document.querySelector('#sign-out');
signoutbutton.addEventListener('click',()=>{
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = '/';
});

async function Appointment_fetch() {
    const AppResponse = await fetch('/appointments/api/fetch/data/docportal/appointmentobjects/',{
        method :  "GET",
        headers : {
            Authorization : `Bearer ${accessToken}`
        }
    })
    const AppData = await AppResponse.json();
    appointments = AppData;
    AppData.forEach(appointment =>{
        const dt = new Date(appointment.date_of_appointment)
        const appointment_cart = document.getElementById('appointmentcartfordoc');
        appointment_cart.innerHTML += `
        <tr class = "appointment-row" data-id = "${appointment.id}">
            <td>
                <div class="patient-cell">
                    <div class="avatar avatar-sm">P</div>
                    <div>
                      <div class="patient-name" data-id="${appointment.id}">${appointment.patient_name}</div>
                      <div class="patient-sub">MRN-88231</div>
                    </div>
                  </div>
                </td>
                <td>${dt.toLocaleTimeString('en-GB',{
                    hour : "2-digit"
                })}</td>
                <td>${appointment.appointment_type}</td>
                <td><span class="badge badge-confirmed">${appointment.status}</span></td>
              </tr>`
    });
}
Appointment_fetch();

const appointmentTable = document.getElementById('appointmentcartfordoc');
appointmentTable.addEventListener('click',function(e){
    const row = e.target.closest(".appointment-row");
    if(!row) return;
    const appointmentId = Number(row.dataset.id);
    const appoint = appointments.find(function(item){
        return item.id == appointmentId;
    })
    aptforpres = appointmentId;
    // const appointmentLocal = localStorage.setItem("appoint",appointmentId);
    console.log(appoint);
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
const medicalrecordbutton = document.querySelector('#medical-record-btn');
medicalrecordbutton.addEventListener('click',()=>{
    window.location.href = '/medicalrecords/create/medicalrecords/ ';
});

const prescriptionPage = document.getElementById("prescription-page");
const cancelPrescription = document.querySelector('#close-prescription');
const prescriptionbutton = document.querySelector('#prescription-btn');
prescriptionbutton.addEventListener('click',()=>{
    prescriptionPage.classList.add("active");
});

cancelPrescription.addEventListener('click',()=>{
    prescriptionPage.classList.remove("active");
});





async function PrescriptionObjectCreation() {
    const medicationinfo = document.getElementById('prescription-medication').value;
    const dosageinfo = document.getElementById('prescription-dosage').value;
    const frequencyinfo = document.getElementById('prescription-frequency').value;
    const durationinfo = document.getElementById('prescription-duration').value;
    const routeinfo = document.getElementById('prescription-route').value;
    const quantityinfo = document.getElementById('prescription-quantity').value;
    const instructioninfo = document.getElementById('prescription-instructions').value;
    const docnoteinfo = document.getElementById('prescription-doctor-notes').value;
    const Response = await fetch('/prescription/display/detail/prescription/',{
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            appointment : aptforpres,
            medication_name : medicationinfo,
            dosage : dosageinfo,
            frequency : frequencyinfo,
            duration : durationinfo,
            route : routeinfo,
            quantity : quantityinfo,
            instructions : instructioninfo,
            doctor_notes : docnoteinfo, 
        })
    });
    const presData = await Response.json();
    console.log(presData);
}

const prescsavebutton = document.getElementById('prescription_footer');
prescsavebutton.addEventListener('click',()=>{
    console.log('button is clicked');
    PrescriptionObjectCreation();
});