const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fullName = form.querySelector(
    'input[placeholder="Enter your name"]'
  ).value;
  const email = form.querySelector(
    'input[placeholder="Enter your email"]'
  ).value;
  const password = form.querySelector('input[placeholder="12ABcd@/!?"]').value;

  try {
    const response = await fetch("http://127.0.0.1:4000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        fullName,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      alert("Ro`yxatdan o`tildi!");
      console.log(data);
    } else {
      alert(data.message || "Xatolik yuz berdi");
    }
  } catch (err) {
    console.error("Xatolik:", err);
    alert("Tarmoq xatoligi");
  }
});
const googleBtn = document.querySelector(
  'button img[src="./icons8-google 1.svg"]'
).parentElement;

googleBtn.addEventListener("click", () => {
  window.location.href = "http://127.0.0.1:4000/api/auth/google/callback";
});
