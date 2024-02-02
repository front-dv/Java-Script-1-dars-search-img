const generatorForms = document.querySelector(".generator-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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";
let isImageGenerators = false;

const updataImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector("download-btn")

        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`
        imgElement.src = aiGeneratedImg;

        imgElement.onload = () => {
            imgCard.classList.remove("loading")
            downloadBtn.setAttribute("href", aiGeneratedImg)
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`)
        }
    })
}

const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });

        if(!response.ok) throw new Error ("Failed to generate images! Please try again.")

        const { data } = await response.json();
        updataImageCard([... data])
    }catch(error){
        alert(error.message)
    }finally {
        isImageGenerators = false
    }
};

const handleFormSubmission = (e) =>{
    e.preventDefault();
    if(isImageGenerators) return;
    isImageGenerators = true

    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;

    const imgCardMarkup = Array.from({length: userImgQuantity}, () => 
         `<div class="img-card loading">
         <img src="images/loader.svg" alt="">
         <a href="#" class="download-btn">
             <img src="images/download.svg" alt="download icon">
         </a>
     </div>`
    ).join("")

    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImgQuantity);
}


generatorForms.addEventListener("submit", handleFormSubmission)