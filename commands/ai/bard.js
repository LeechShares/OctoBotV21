const axios = require('axios');
const fs = require('fs');

module.exports = async function ({ dstryr, event, parameters }) {
  try {
    if (parameters.length === 0) {
      dstryr.sendMessage('ano i sesearch ko lugaw?', event.threadID);
      return;
    }

    const apiUrl = 'https://web-api-samirxyz.koyeb.app/api/bard?question=' + encodeURIComponent(parameters.join(' '));

    const response = await axios.get(apiUrl);

    const apiMessage = response.data.message;
    const apiImageUrls = response.data.imageUrls;

    // Send the text response
    dstryr.sendMessage(apiMessage, event.threadID);

    // If there are image URLs, download and send them as attachments
    if (apiImageUrls && apiImageUrls.length > 0) {
      apiImageUrls.forEach(async (imageUrl, index) => {
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(imageResponse.data, 'binary');
        const imageFileName = `image${index + 1}.png`;

        // Save the image locally
        fs.writeFileSync(imageFileName, imageBuffer);

        // Send the image with a custom message
        const msg = {
          body: "heres your image langga",
          attachment: fs.createReadStream(imageFileName)
        };

        dstryr.sendMessage(msg, event.threadID);

        // Remove the locally saved image file
      //  fs.unlinkSync(imageFileName);
      });
    }
  } catch (error) {
    console.error(error);
    dstryr.sendMessage('Errorð', event.threadID);
  }
};
