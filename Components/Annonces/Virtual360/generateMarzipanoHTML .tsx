export const generatePannellumHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pannellum Viewer</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"/>
    <style>
        html, body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            font-family: sans-serif;
        }
        #panorama {
            width: 100vw;
            height: 100vh;
        }
        .error-message {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: #f0f0f0;
            color: #333;
            text-align: center;
            font-family: Arial, sans-serif;
        }
    </style>
</head>
<body>
    <div id="panorama"></div>
    
    <script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
    
    <script>
        function showError(message, details) {
            document.getElementById('panorama').innerHTML = 
                '<div class="error-message">' +
                '<div>' +
                '<h2>' + message + '</h2>' +
                '<p>' + details + '</p>' +
                '</div>' +
                '</div>';
        }

        setTimeout(function() {
            try {
                if (typeof pannellum === 'undefined') {
                    showError('Bibliothèque non chargée', 'Pannellum n\\'a pas pu être chargé.');
                    return;
                }

                var baseUrl = 'https://gnh97h9v3c.ufs.sh/f/LUi1c9wqAJMG2ELdJs8BsgvCqbN1LSjRVWkKZPc7dhwFr869';
                
                pannellum.viewer('panorama', {
                    "type": "equirectangular",
                    "panorama": baseUrl,
                    "autoLoad": true,
                    "compass": true,
                    "showControls": true,
                    "showFullscreenCtrl": true,
                    "showZoomCtrl": true,
                    "mouseZoom": true,
                    "title": "Parc national du Mercantour"
                });
                
            } catch (error) {
                console.error('Erreur:', error);
                showError('Erreur de chargement', 'Erreur: ' + error.message);
            }
        }, 1000);
    </script>
</body>
</html>`;