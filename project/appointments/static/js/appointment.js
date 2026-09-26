console.log('Appointment js loaded');
const submitbutton = document.querySelector('#appointment_submission')
submitbutton.addEventListener('click',()=>{
    async function AppointmentSubmission() {
        try{
            const doctorid = document.querySelector('#doctor-name').value;
            const reasonfield = document.querySelector('#reason').value;
            const patientstatus = document.querySelector('#patient-status').value;
            const dateofapp = document.querySelector('#pref-date').value;
            const appmode = document.querySelector('#appointment_mode').value;
            const accessToken = localStorage.getItem('access');
            const response = await fetch('/appointments/api/create/appointment/',{
               method : "POST",
               headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${accessToken}`
               },
               body : JSON.stringify({
                doctor : doctorid,
                reason : reasonfield,
                status : patientstatus,
                date_of_appointment : dateofapp,
                appointment_type : appmode
               })
            });
            const data = await response.json();
            console.log(data);
        }catch(error){
            console.log("error",error)
        }
    }
    AppointmentSubmission();
});