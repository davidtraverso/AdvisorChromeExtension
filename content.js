/* Qualification page scripts */
var qualPage = '/admin/qualification.php'
if (window.location.href.includes(qualPage)) {
    /* Highlight dollar amount from pricing notes */
    // Create Intersectio Observer to run bolding whenever the recs are viewed (since recs constantly update)
    var recsDiv = document.getElementById('recommended_products')
    window.addEventListener("load", (e) => {
        createObserver();
    })

    function createObserver() {
        let observer;
        let options = {
            root: null,
            rootMargin: "0px",
            threshold: [0.01]
        };
        observer = new IntersectionObserver(boldPrices, options)
        observer.observe(recsDiv)
    }

    // Run regex to add a span around price text
    function boldPrices () {
        // Select recs from lead
        var recs = document.querySelectorAll('#recommended_products .product_price')
        // Assign regex to look for dollar amount
        var regex = /[$](\d)+[k|\.|,]?(\d)*/gi
        // Loop over recs and add .match and style to each price note
        var newHTML = [...recs].map(e => {
            return e.innerHTML.replace(regex, addSpan)
            })
        function addSpan(match){
            return `<span class="match" style="font-weight:bold;color:#000000;text-shadow:2px 2px 7px rgba(253, 128, 11, 0.8)">${match}</span>`
        }
        for (var i=0; i < recs.length; i++){
            recs[i].innerHTML = newHTML[i]
        }
    }
    // PROBLEM: Replacing innerHTML of entire note removes <br> and other necessary markup. 
        // Solution: run regex on innerHTML instead of innerText. Duh!
    

    /* Render Timeframe Script Box */
    var arrow = document.querySelector('.quali_left span #arrow_up')
    var colAdjust = arrow.parentNode.parentNode
    colAdjust.colSpan = 1;
    var tRow = arrow.parentNode.parentNode.parentNode
    var newTD = document.createElement('td')
    newTD.className = 'quali_right'
    var iconHTML = `
        <img
        class="blue_balloon"
        style="height:60px;position:absolute;opacity:0.1;"
        src="https://pngimage.net/wp-content/uploads/2018/06/michael-scott-png-3.png">
    `
    var icon = document.createElement('span')
    icon.innerHTML = iconHTML
    newTD.appendChild(icon)
    tRow.appendChild(newTD)


    // Render Script Box
    var quoteWrapper = document.createElement('blockquote')
    quoteWrapper.id = 'timeframe'
    quoteWrapper.style = `
            margin-left: 7%;
            font-weight: bold;
            font-size: .8rem;
            position: absolute;
            width: 400px;
            margin-block-start: 0;
            background: rgb(253, 128, 11, 0.28);
            display: none;
            padding: 0px 1% 0px 0px;
            `

    var quoteArea = document.createElement('p')
    quoteArea.id = 'timeText';
    quoteArea.style.marginLeft = '5%'

    // Access chrome storage to pull quote:
    function getStoredQuote () {
        chrome.storage.sync.get(['quote'], async (res) => {
            if (!res['quote']){
                chrome.storage.sync.set({
                    'quote': 'Type your text here.'
                }, () => {
                    quoteArea.innerText = 'Type your text here!';
                });
            } else {
            let quote = await res.quote
            quote ? null : quote = `"What is y'all's target timeframe to decide on the right software product?"` ;
            quoteArea.innerText = quote
            };
        })
    }    
    getStoredQuote();
    
    // var quoteText = getStoredQuote()
    // console.log(`savedQuote: ${quoteText}`)
    // quoteArea.innerText = getStoredQuote();
    quoteWrapper.appendChild(quoteArea);
    newTD.appendChild(quoteWrapper);

    // opacity toggle
    function opacityToggle (e) {
        e.target.style.opacity < .5 ? e.target.style.opacity = 1.0 : e.target.style.opacity = 0.1;
    }

    // Toggle opacity on mouseover
    icon.addEventListener('mouseover', opacityToggle)
    icon.addEventListener('mouseout', opacityToggle)
    // icon2.addEventListener('mouseover', opacityToggle)
    // icon2.addEventListener('mouseout', opacityToggle)

    // Toggle visibility on click
    icon.addEventListener('click', function () {
        quoteWrapper.style.display == 'none' ? quoteWrapper.style.display = 'block' : quoteWrapper.style.display = 'none';
        console.log('clicked!')
    })

    // Listen for double click on blockquote and transform
    quoteWrapper.addEventListener('dblclick', editQuote)

    // Function to transform blockquote to editable
    function editQuote () {
        // Render textarea and restyle blockquote
        var initQuote = document.getElementById('timeText').innerText;
        var block = document.getElementById('timeframe');
        block.style.background = "rgba(253, 128, 11, 0)"
        block.innerHTML = `
            <textarea
            id="editText"
            autofocus="true"
            style="
                background: rgba(253, 128, 11, 0.28);
                font-weight: inherit;
                font-size: inherit;
                font-family: Lucida Grande;
                margin-left: 5%;
                margin-top: 1em;
                resize: none;
                border: none;
                overflow: visible;"
            wrap="soft"
            cols=${block.offsetWidth/8}
            rows="3"}>${initQuote}</textarea>
        `    
        console.log('added SaveQuote listener')
        quoteWrapper.addEventListener('focusout', saveQuote)
    }

    // Function to save edited quote and rerender as paragraph
    function saveQuote() {
        // convert textarea to paragraph
        let newQuote = document.getElementById('editText').value;
        let block = document.getElementById('timeframe');
        block.style.background = 'rgba(253, 128, 11, 0.28)'
        block.innerHTML = `<p id="timeText" style="margin-left:5%;">${newQuote}</p>`
        // save quote in chrome.storage.sync
        console.log('chrome.sync.storage')
        console.log(`{quote: ${newQuote}}`)
        chrome.storage.sync.set({quote: newQuote}, () => {
            console.log('Saved new quote.');
        })
    }
}