 console.log('base js loaded');

const appointmentpage = document.querySelector('#redirect-appointmentpage');
appointmentpage.addEventListener('click',()=>{
    window.location.href='/appointments/patient/dashboard/appointment/'
});

const overviewpage = document.querySelector('#redirect-overview');
overviewpage.addEventListener('click',()=>{
    window.location.href='/patients/api/dashboard/'
});

const medicalrecords = document.querySelector('#redirect-medicalrecords');
medicalrecords.addEventListener('click',()=>{
    window.location.href='/medicalrecords/dashboard/medicalrecords/'
});

const prescription = document.querySelector('#redirect-prescription');
prescription.addEventListener('click',()=>{
    window.location.href='/patients/dashboard/prescriptions/'
});

const billing = document.querySelector('#redirect-billing');
billing.addEventListener('click',()=>{
    window.location.href='/patients/dashboard/billing/'
});

const settings = document.querySelector('#redirect-settings');
settings.addEventListener('click',()=>{
    window.location.href='/patients/dashboard/settings/'
});





//  LOG-OUT BUTTON 
const logoutbutton = document.querySelector('#logout-btn');
if(logoutbutton){
    logoutbutton.addEventListener('click',async()=>{
        await LogOut();
        window.location.replace('/'); 
        alert("You've been logged out. ");
    })
}