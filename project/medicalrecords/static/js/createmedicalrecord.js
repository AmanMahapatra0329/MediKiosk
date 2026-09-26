console.log('createmedicalrecordjs loaded!');

const appointment_ID = localStorage.getItem('appoint');
console.log("appointment ", appointment_ID)
const medicalrecordsubmission = document.getElementById("submitbutton");
medicalrecordsubmission.addEventListener('click', async function CreateMedicalRecord() {
    const bp = document.querySelector('#bp').value;
    const pulse = document.querySelector('#pulse').value;
    const tempreature = document.querySelector('#temp').value;
    const oxygen_saturation = document.querySelector('#spo2').value;
    const chief_complaint = document.querySelector('#chief-complaint').value;
    const history_of_illness = document.querySelector('#hpi').value;
    const medical_history = document.querySelector('#medical-history').value;
    const diagnosis = document.querySelector('#diagnosis').value;
    const treatment_plan = document.querySelector('#treatment-plan').value;
    const doctor_notes = document.querySelector('#doctor-notes').value;

    const response = await fetch('/medicalrecords/api/create/object/medicalrecord/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            appointment: appointment_ID,
            chief_complaint: chief_complaint,
            history_of_current_illness: history_of_illness,
            medical_history: medical_history,
            bp: bp,
            pulse: pulse,
            temp: tempreature,
            oxygen_saturation: oxygen_saturation,
            diagnosis: diagnosis,
            treatment_plan: treatment_plan,
            doctor_notes: doctor_notes
        })
    });

    const data = await response.json();
    console.log(data);
});