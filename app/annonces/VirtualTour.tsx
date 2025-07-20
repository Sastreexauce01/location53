import { WebView } from 'react-native-webview';

export default function PanoramaScreen() {
  const image360Url = 'https://cdn.pannellum.org/2.5/pannellum.htm#panorama=https://pannellum.org/images/alma.jpg'; // ton panorama hébergé
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <script src="https://cdn.pannellum.org/2.5/pannellum.js"></script>
      <link rel="stylesheet" href="https://cdn.pannellum.org/2.5/pannellum.css" />
      <style>
        html, body, #panorama { margin: 0; height: 100%; width: 100%; }
      </style>
    </head>
    <body>
      <div id="panorama"></div>
      <script>
        pannellum.viewer('panorama', {
          type: 'equirectangular',
          panorama: '${image360Url}',
          autoLoad: true
        });
      </script>
    </body>
    </html>
  `;

  return <WebView originWhitelist={['*']} source={{ html: htmlContent }} />;
}
