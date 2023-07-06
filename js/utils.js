function preserveUTMParameters() {
  // Get the value of the 'utm_campaign' and 'utm_source' query string parameters
  const urlParams = new URLSearchParams(window.location.search);
  const utmCampaign = urlParams.get('utm_campaign');
  const utmSource = urlParams.get('utm_source');

  // Get all hyperlinks on the page
  const links = document.getElementsByTagName('a');

  // Loop through each hyperlink and update the 'utm_campaign' and 'utm_source' parameters
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    let href = link.href;

    // Check if the hyperlink already contains query parameters
    if (href.includes('?')) {
      href += `&utm_campaign=${utmCampaign}&utm_source=${utmSource}`;
    } else {
      href += `?utm_campaign=${utmCampaign}&utm_source=${utmSource}`;
    }

    // Set the updated href value for the hyperlink
    link.href = href;
  }
}

function afterLoad() {
  preserveUTMParameters();
}

// Execute the code after the DOM has finished loading
document.addEventListener('DOMContentLoaded', afterLoad);