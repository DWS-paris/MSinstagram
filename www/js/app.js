const getFormSubmit = (formTag, resultTag) => {
    document.querySelector(formTag).addEventListener('submit', event => {
        event.preventDefault();

        console.log(`/${document.querySelector('[name="type"]').value}/${document.querySelector('[name="keyword"]').value}`)
        fetch(`/${document.querySelector('[name="type"]').value}/${document.querySelector('[name="keyword"]').value}`)
        .then( response => {
            return !response.ok
            ? console.log(response)
            : response.json()
        })
        .then( apiResponse => {
            console.log(apiResponse)

            apiResponse.params.type === 'tag'
            ? displayTagResult(resultTag, apiResponse)
            : displayUserResult(resultTag, apiResponse)
        })
        .catch( apiError => {
            console.log(apiError)
        })
    })
}

const displayTagResult = (tag, apiResponse) => {
    console.log(tag, apiResponse)

    let responseTag = document.querySelector(tag);

    responseTag.innerHTML = `<h2>Recherche pour le mot clef <b>${apiResponse.params.keyword}</b></h2>`

    let instagramFeed = `
        <ul id="instagramFeed">
    `;
    for( let item of apiResponse.data ){
        instagramFeed += `
            <li>
                <figure>
                    <img src="${item.thumbnails[4].src}" alt="${item.caption}">
                    <figcaption>${item.caption} / ${item.accessibility}</figcaption>
                </figure>
                <a href="${item.display_url}" target="_blank">Télécharger l'image</a>
            </li>
        `;
    }

    instagramFeed += `
        </ul>
    `;

    responseTag.innerHTML += instagramFeed;
}

const displayUserResult = (tag, apiResponse) => {
    let responseTag = document.querySelector(tag);

    responseTag.innerHTML = `
        <ul id="instagramUserHeader">
            <li>
                <img src="${apiResponse.data.profile_pic_url}" alt="Photo de profil Instagram de ${apiResponse.params.keyword}">
            </li>
            <li>
                <h2>Recherche pour le profil <b>${apiResponse.params.keyword}</b></h2>
                <p><b>Biographie :</b> ${apiResponse.data.biography}</p>
                <p><a href="${apiResponse.data.external_url}" target="_blank">${apiResponse.data.external_url}</a></p>
            </li>
        </ul>
    `
    let instagramFeed = `
        <ul id="instagramFeed">
    `;
    for( let item of apiResponse.data.timeline_media ){
        instagramFeed += `
            <li>
                <figure>
                    <img src="${item.thumbnails[4].src}" alt="${item.caption}">
                    <figcaption>${item.caption} / ${item.accessibility}</figcaption>
                </figure>
                <a href="${item.display_url}" target="_blank">Télécharger l'image</a>
            </li>
        `;
    }

    instagramFeed += `
        </ul>
    `;

    responseTag.innerHTML += instagramFeed;
}

document.addEventListener('DOMContentLoaded', () => {
    getFormSubmit('#instagramForm form', '#istagramResult')
})