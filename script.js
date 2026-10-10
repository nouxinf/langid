let langData;
async function getData() {
  const url = "langs.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    langData = result;
  } catch (error) {
    console.error(error.message);
  }
}
getData();

const inputField = document.getElementById("mainfield");

const defaultChars = ` .,;:1234567890#{}()[]-=+!?"'/<>@~|*&^%$£`;

inputField.addEventListener("change", () => {
  const typed = inputField.value.toLowerCase();

  const remainingLangs = Object.entries(langData)
    .filter(([code, lang]) => {
      const alphabet = lang.alphabet.toLowerCase();
      return [...typed].every(
        (ch) => defaultChars.includes(ch) || alphabet.includes(ch),
      );
    })
    .map(([code]) => code);

  console.log(remainingLangs);
});
