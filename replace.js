let hourlyWage = 0;

document.getElementById('wageForm').addEventListener('submit', function(event) {
    event.preventDefault();
    hourlyWage = parseFloat(document.getElementById('hourlyWage').value);
});

async function activate() {

    // access current tab (reference: https://youtu.be/GGi7Brsf7js)
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [hourlyWage],
        func: (hourlyWage) => {
            
            // go through all elements
            let elements = document.querySelectorAll('*');
            elements.forEach(element => {

                // check for text elements
                if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
                    let text = element.textContent;

                    // check for pricing patterns
                    let regex = /\$\d+(\.\d{1,2})?/g;
                    let matches = text.match(regex);

                    // go through prices
                    if (matches) {

                        // calculate hours and replace price
                        matches.forEach(match => {
                            let price = parseFloat(match.replace('$', ''));
                            let hours = price / hourlyWage;
                            text = text.replace(match, hours.toFixed(2) + " hours");
                        });
                        element.textContent = text;
                    }
                }
            });

        }
    });
}

document.getElementById('activateButton').addEventListener('click', activate);