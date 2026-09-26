const loginbutton = document.querySelector('#Loginbutton');
const activebar = document.querySelector('.sidebar');
const backbutton = document.querySelector('#backbutton');
loginbutton.addEventListener('click', () => {
    activebar.classList.add('active');
});
backbutton.addEventListener('click', () => {
    activebar.classList.remove('active');
});

const registrationbutton = document.querySelector('#register-link');
const registrationslide = document.querySelector('.sidebar-registration');
const backbuttonreg = document.querySelector('#backbutton-register')
registrationbutton.addEventListener('click', () => {
    activebar.classList.remove('active');
    registrationslide.classList.add('active');
});
backbuttonreg.addEventListener('click', () => {
    registrationslide.classList.remove('active');
});

const loginlink = document.querySelector('#login-link');
loginlink.addEventListener('click', () => {
    registrationslide.classList.remove('active');
    activebar.classList.add('active');
});

const staffpage = document.querySelector('#staff_login_redirect');
const stafflogin = document.querySelector('.sidebar-staff-login');
staffpage.addEventListener('click', () => {
    activebar.classList.remove('active');
    stafflogin.classList.add('active');
});
const backbuttonstaff = document.querySelector('#backbuttonstaff');
backbuttonstaff.addEventListener('click', () => {
    stafflogin.classList.remove('active');
});


// User Registration

const registerbutton = document.querySelector('#credential-submition-register');
registerbutton.addEventListener('click', () => {
    async function user_registration() {
        try {
            const name = document.querySelector('#fullname').value;
            const email = document.querySelector('#email').value;
            const password = document.querySelector('#password_registration').value;
            const BloodGroup = document.querySelector('#blood_group').value;
            const Gender = document.querySelector('#gender').value;
            const DateOfBirth = document.querySelector('#date_of_birth').value;

            const response = await fetch('/accounts/api/registration/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    blood_group: BloodGroup,
                    gender: Gender,
                    date_of_birth: DateOfBirth
                })
            });
            const data = await response.json();
            console.log(data);

            if (response.ok) {
                // Only store the email after confirmed successful registration
                sessionStorage.setItem("verification_email", email);
                window.location.replace('/accounts/page/codeverification/');
            } else {
                console.error("Registration failed:", data.message || data);
            }
        }
        catch (error) {
            console.log("error", error);
        }
    }
    user_registration();
});

// USER LOGIN 

const loginsubmit = document.querySelector('#credential_submition_login');
loginsubmit.addEventListener('click', () => {
    async function user_login() {
        try {
            const loginemail = document.querySelector('#email_login').value;
            const loginpass = document.querySelector('#password_login').value;

            const response = await fetch('/accounts/api/login/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: loginemail,
                    password: loginpass
                })
            });
            const data = await response.json();
            // console.log('
            localStorage.setItem('access', data.access);
            // localStorage.setItem('refresh',data.refresh);
            window.location.href = "/patients/api/dashboard/";
        } catch (error) {
            console.log("error", error)
        }
    }
    user_login();
});


//Access Token replenishment 
async function RefreshAccessToken() {
    const response = await fetch('/accounts/api/token/refresh/', {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
    });
    if (!response.ok) {
        localStorage.removeItem('access');
        // localStorage.removeItem('refresh');
        return null;
    }
    const data = await response.json();
    // console.log(data); 
    localStorage.setItem('access', data.access);
    return data.access;
}



// Redirecting to the Forgot password page , available in accounts app

const forgotpassword = document.querySelector("#forgotpass");
// console.log('this is the forgot password ')
// console.log(forgotpassword);
forgotpassword.addEventListener('click', () => {
    console.log('button has been clicked!');
    window.location.replace('/accounts/page/forgotpassword/');
});









//User Logout
async function LogOut() {
    let response = await fetch('/accounts/api/logout/', {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    localStorage.removeItem('access');
}























// STAFF LOGIN 

const staffloginbutton = document.querySelector('#credential_submition_staff_login');
staffloginbutton.addEventListener('click', () => {
    async function StaffLoginFunction() {
        try {
            const staffusername = document.querySelector('#email_login_staff').value;
            const staffpassword = document.querySelector('#password_login_staff').value;
            const response = await fetch('/accounts/api/login/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: staffusername,
                    password: staffpassword
                })
            });
            const data = await response.json();
            console.log(data);
            localStorage.setItem('access', data.access);
            // Note: refresh token is stored as an httpOnly cookie by the server, not in localStorage

            const Token = localStorage.getItem('access');
            // console.log(Token);
            // console.log('tokrn id fonr')
            const roleResponse = await fetch('/accounts/api/roledata/', {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${Token}`
                }
            });
            // console.log(typeof (roleResponse));
            const roledata = await roleResponse.json();
            // console.log(roledata);
            // console.log('roledata is ')
            if (roledata.Role === 'Doctor') {
                window.location.href = '/accounts/api/doctors/dashboard/'
            }
            else if (roledata.Role === 'Staff') {
                window.location.href = '/accounts/api/staff/dashboard/'
            }
        } catch (error) {
            console.log("error", error)
        }
    }
    StaffLoginFunction();
});
