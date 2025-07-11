const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fullName = form.querySelector(
    'name-input'
  ).value;
  const email = form.querySelector(
    '.email-input'
  ).value;
  const password = form.querySelector('.pass-input').value;

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
  '.google-btn'
).parentElement;

googleBtn.addEventListener("click", () => {
  window.location.href = "http://127.0.0.1:4000/api/auth/google/callback";
});
