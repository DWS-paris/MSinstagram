const getFormSubmit = (formTag, resultTag, requestInfoTag) => {
    document.querySelector(formTag).addEventListener('submit', event => {
        event.preventDefault();

        document.querySelector(resultTag).innerHTML = `<h2 id="loadingText">Searching for <b>${document.querySelector('[name="keyword"]').value} ${document.querySelector('[name="type"]').value}</b>...</h2>`
        document.querySelector(requestInfoTag).innerHTML = `
            <b>GET</b> <a href="https://instagram.dwsapp.io/${document.querySelector('[name="type"]').value}/${document.querySelector('[name="keyword"]').value}" target="_blank">https://instagram.dwsapp.io/${document.querySelector('[name="type"]').value}/${document.querySelector('[name="keyword"]').value}</a>
        `

        fetch(`/${document.querySelector('[name="type"]').value}/${document.querySelector('[name="keyword"]').value}`)
        .then( response => {
            return !response.ok
            ? document.querySelector(resultTag).innerHTML = '<h2>Server error, please try again...</h2>'
            : response.json()
        })
        .then( apiResponse => {
            if(apiResponse.params){
                document.querySelector(formTag).reset()
                apiResponse.params.type === 'tag'
                ? displayTagResult(resultTag, apiResponse)
                : displayUserResult(resultTag, apiResponse)
            }
            else{
                document.querySelector(resultTag).innerHTML = `<h2 id="loadingText">No result for <b>${document.querySelector('[name="keyword"]').value} ${document.querySelector('[name="type"]').value}</b></h2>`
            }
        })
        .catch( apiError => {
            console.log(apiError)
            document.querySelector(resultTag).innerHTML = '<h2>Server error, please try again...</h2>';
        })
    })
}

const displayTagResult = (tag, apiResponse) => {
    let responseTag = document.querySelector(tag);

    responseTag.innerHTML = `<h2>Result for hashtag <b>#${apiResponse.params.keyword}</b></h2>`

    let instagramFeed = `
        <ul id="instagramFeed" class="flexBox flexWarp spaceBetween">
    `;
    for( let item of apiResponse.data ){
        instagramFeed += `
            <li>
                <figure>
                    <img src="${item.thumbnails[4].src}" alt="${item.caption}">
                </figure>
                <a href="${item.display_url}" target="_blank">Download picture</a>
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

    let responseTagContent = `
        <ul id="instagramUserHeader" class="flexBox flexCenter">
            <li>
                <img src="${apiResponse.data.profile_pic_url}" alt="Instagram profil picture of ${apiResponse.params.keyword}">
            </li>
            <li>
                <h2>Result for the user <b>${apiResponse.params.keyword}</b></h2>
                <p>${apiResponse.data.biography}</p>
    `
    if( apiResponse.data.external_url !== null ){
        responseTagContent += `
                    <p><a href="${apiResponse.data.external_url}" target="_blank">${apiResponse.data.external_url}</a></p>
                </li>
            </ul>
        `
    }
    else{
        responseTagContent += `
            </li>
        </ul>
        `
    }

    let instagramFeed = `
        <ul id="instagramFeed" class="flexBox flexWarp spaceBetween">
    `;

    for( let item of apiResponse.data.timeline_media ){
        instagramFeed += `
            <li>
                <figure>
                    <img src="${item.thumbnails[4].src}" alt="${item.caption}">
                </figure>
                <a href="${item.display_url}" target="_blank">Download picture</a>
            </li>
        `;
    }

    instagramFeed += `
        </ul>
    `;

    responseTagContent += instagramFeed

    responseTag.innerHTML = responseTagContent;
}

document.addEventListener('DOMContentLoaded', () => {
    getFormSubmit('#instagramForm form', '#instagramResult', '#apiRequestInfo code')
})