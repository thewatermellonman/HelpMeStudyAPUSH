const unitcards = document.querySelectorAll(".unit-card");

const homeview = document.querySelector("#homeview");
const unitview = document.querySelector("#unitview")

const unittitle = document.querySelector("#unittitle");
const backbutton = document.querySelector("#backbutton")

unitcards.forEach(card => {
    card.addEventListener("click", () => {
        const unitnumber = card.dataset.unit;

        console.log("Clicked Unit:", unitnumber);

        homeview.hidden = true;
        unitview.hidden = false;

        unittitle.textContent = `Unit ${unitnumber}`;
    });

});

backbutton.addEventListener("click", () => {
    unitview.hidden = true;
    homeview.hidden = false;
});