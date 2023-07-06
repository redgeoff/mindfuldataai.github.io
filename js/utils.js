// Function to set a cookie value
function setCookie(name, value, days) {
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expirationDate.toUTCString()};path=/`;
}

// Function to get a cookie value
function getCookie(name) {
  const cookieName = `${name}=`;
  const cookieArray = document.cookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return null;
}

function preserveUTMParameters() {
  // Get the value of the 'utm_campaign' and 'utm_source' query string parameters
  const urlParams = new URLSearchParams(window.location.search);
  const utmCampaign = urlParams.get('utm_campaign');
  const utmSource = urlParams.get('utm_source');

  // Check if query string parameters are provided and update the cookie values if so
  if (utmCampaign) {
    setCookie('utm_campaign', utmCampaign, 30);
  }
  if (utmSource) {
    setCookie('utm_source', utmSource, 30);
  }

  // Get the stored values from the cookies
  const storedUtmCampaign = getCookie('utm_campaign');
  const storedUtmSource = getCookie('utm_source');

  // Get all hyperlinks on the page
  const links = document.getElementsByTagName('a');

  // Loop through each hyperlink and update the 'utm_campaign' and 'utm_source' parameters
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    let href = link.href;

    // Check if the hyperlink already contains query parameters
    if (href.includes('?')) {
      // Preserve the existing parameters and update the 'utm_campaign' and 'utm_source' values if necessary
      href = href.replace(/([&?])utm_campaign=[^&]+/, `$1utm_campaign=${utmCampaign || storedUtmCampaign}`);
      href = href.replace(/([&?])utm_source=[^&]+/, `$1utm_source=${utmSource || storedUtmSource}`);
    } else {
      // Append the 'utm_campaign' and 'utm_source' parameters
      href += `?utm_campaign=${utmCampaign || storedUtmCampaign}&utm_source=${utmSource || storedUtmSource}`;
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