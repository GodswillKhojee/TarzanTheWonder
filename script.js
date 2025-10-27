// script.js — unified and fixed auth logic

document.addEventListener("DOMContentLoaded", () => {
  // Elements (some pages may not have all of these elements)
  const sendOtpBtn = document.getElementById("sendOtpBtn") || document.getElementById("sendOtp");
  const signupForm = document.getElementById("signupForm");
  const signinForm = document.getElementById("signinForm");

  // OTP logic (demo)
  if (sendOtpBtn) {
    sendOtpBtn.addEventListener("click", () => {
      // try several possible mobile input IDs
      const mobileInput =
        document.getElementById("mobile") ||
        document.getElementById("signinMobile") ||
        document.querySelector('input[type="tel"]');

      const mobile = mobileInput ? mobileInput.value.trim() : "";

      if (!/^\d{10}$/.test(mobile)) {
        alert("Enter a valid 10-digit mobile number.");
        return;
      }

      const otp = String(Math.floor(100000 + Math.random() * 900000)); // string
      localStorage.setItem("demo_otp_" + mobile, otp); // namespace OTP by mobile
      // show OTP in alert for demo; in production, send via SMS/email API
      alert(`Your OTP is: ${otp} (demo)`);
      console.log(`[DEBUG] OTP for ${mobile}: ${otp}`);
    });
  }

  // SIGNUP
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Inputs (IDs used in our signup page)
      const fullName = (document.getElementById("fullname") || document.getElementById("fullName") || {}).value?.trim() || "";
      const mobile = (document.getElementById("mobile") || {}).value?.trim() || "";
      const otp = (document.getElementById("otp") || {}).value?.trim() || "";
      const password = (document.getElementById("password") || {}).value || "";
      const confirmPassword = (document.getElementById("confirmPassword") || {}).value || "";
      const state = (document.getElementById("state") || {}).value || "";
      const city = (document.getElementById("city") || {}).value || "";
      const pin = (document.getElementById("pincode") || document.getElementById("pin") || {}).value || "";

      // Validations
      if (!/^\d{10}$/.test(mobile)) return alert("Enter a valid 10-digit mobile number.");
      const savedOtp = localStorage.getItem("demo_otp_" + mobile);
      if (!savedOtp) return alert("Please click Send OTP and enter the code sent to your mobile.");
      if (String(otp) !== String(savedOtp)) return alert("Incorrect OTP. Please try again.");

      if (!password || password.length < 6) return alert("Password must be at least 6 characters.");
      if (password !== confirmPassword) return alert("Passwords do not match.");

      if (!fullName) return alert("Please enter your full name.");
      if (!state || !city) return alert("Please select state and city.");
      if (!/^\d{6}$/.test(pin)) return alert("Enter a valid 6-digit PIN code.");

      // build user object
      const user = {
        fullName,
        mobile,
        password, // note: storing plain text in localStorage is only for demo
        state,
        city,
        pin,
        createdAt: new Date().toISOString()
      };

      // Save user keyed by mobile so multiple users can exist
      localStorage.setItem("user_" + mobile, JSON.stringify(user));

      // cleanup OTP after successful registration
      localStorage.removeItem("demo_otp_" + mobile);

      alert("Account created successfully! You can now sign in.");
      console.log("[DEBUG] Registered user:", user);

      // redirect to signin page (adjust path if needed)
      window.location.href = "signin.html";
    });
  }

  // SIGNIN
  if (signinForm) {
    signinForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const mobile = (document.getElementById("signinMobile") || document.getElementById("mobile") || {}).value?.trim() || "";
      const password = (document.getElementById("signinPassword") || document.getElementById("password") || {}).value || "";

      if (!/^\d{10}$/.test(mobile)) return alert("Enter a valid 10-digit mobile number.");
      if (!password) return alert("Enter your password.");

      // Look up user by mobile key
      const stored = localStorage.getItem("user_" + mobile);
      if (!stored) {
        // fallback: check single-user key "user" for backwards compatibility
        const fallback = localStorage.getItem("user");
        if (fallback) {
          const parsed = JSON.parse(fallback);
          if (parsed.mobile === mobile && parsed.password === password) {
            alert(`Welcome back, ${parsed.fullName}!`);
            return (window.location.href = "car.html");
          }
        }
        return alert("No account found for this mobile number.");
      }

      const user = JSON.parse(stored);
      if (user.password !== password) return alert("Incorrect password.");
      alert(`Welcome back, ${user.fullName}!`);
      // successful login - redirect
      window.location.href = "car.html";
    });
  }
});

