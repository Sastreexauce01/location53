/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ViewStyle, Text, ActivityIndicator } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';

// Interface pour les métadonnées d'image
interface ImageMetadata {
  uri: string;
  title: string;
  description: string;
}

interface VirtualTourProps {
  imageMetadata: ImageMetadata;
  style?: ViewStyle;
  showInfo?: boolean;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

interface WebViewMessage {
  type: 'loaded' | 'error';
  message?: string;
}

const VirtualTour: React.FC<VirtualTourProps> = ({
  imageMetadata,
  style,
  showInfo = true,
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  // Convertir l'image locale en base64
  useEffect(() => {
    const convertImageToBase64 = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        // Vérifier que imageMetadata et uri existent
        if (!imageMetadata || !imageMetadata.uri) {
          console.error('ImageMetadata ou URI manquant:', imageMetadata);
          setHasError(true);
          onError?.('Métadonnées d\'image manquantes');
          return;
        }

        console.log('Traitement de l\'image:', imageMetadata.uri);

        // Vérifier si c'est une URI locale ou une URL web
        if (imageMetadata.uri.startsWith('http://') || imageMetadata.uri.startsWith('https://')) {
          // URL web - utiliser directement
          setBase64Image(imageMetadata.uri);
        } else {
          // URI locale - convertir en base64
          console.log('Conversion en base64 de:', imageMetadata.uri);
          
          const base64 = await FileSystem.readAsStringAsync(imageMetadata.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          
          // Déterminer le type MIME (supposer JPEG par défaut)
          const mimeType = imageMetadata.uri.toLowerCase().includes('.png') ? 'image/png' : 'image/jpeg';
          const dataUri = `data:${mimeType};base64,${base64}`;
          
          setBase64Image(dataUri);
          console.log('Conversion base64 réussie');
        }
      } catch (error) {
        console.error('Erreur conversion base64:', error);
        setHasError(true);
        onError?.('Erreur lors de la conversion de l\'image');
      }
    };

    if (imageMetadata?.uri) {
      convertImageToBase64();
    } else {
      console.error('Aucune URI fournie');
      setHasError(true);
      onError?.('Aucune image fournie');
    }
  }, [imageMetadata, imageMetadata.uri, onError]);

  // HTML avec Three.js pour afficher l'image 360°
  const html360 = base64Image ? `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <style>
            body { 
                margin: 0; 
                padding: 0; 
                overflow: hidden; 
                background: #000;
                touch-action: none;
            }
            #container { 
                width: 100vw; 
                height: 100vh; 
            }
            #loading {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                text-align: center;
                font-family: Arial, sans-serif;
                z-index: 1000;
            }
            #controls {
                position: absolute;
                top: 20px;
                right: 20px;
                z-index: 1000;
                background: rgba(0,0,0,0.7);
                padding: 10px;
                border-radius: 10px;
                color: white;
                font-size: 12px;
                backdrop-filter: blur(10px);
            }
        </style>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    </head>
    <body>
        <div id="container">
            <div id="loading">
                <div style="font-size: 16px; margin-bottom: 10px;">🌐 Chargement...</div>
                <div style="font-size: 12px; opacity: 0.7;">${imageMetadata.title}</div>
            </div>
            <div id="controls" style="display: none;">
                <div>👆 Glissez pour tourner</div>
                <div>🤏 Pincez pour zoomer</div>
                <div>👆👆 Double-tap: auto-rotation</div>
            </div>
        </div>
        
        <script>
            let scene, camera, renderer, sphere;
            let isUserInteracting = false;
            let onPointerDownMouseX = 0, onPointerDownMouseY = 0;
            let lon = 0, onPointerDownLon = 0;
            let lat = 0, onPointerDownLat = 0;
            let phi = 0, theta = 0;
            let lastTapTime = 0;
            let isAutoRotating = false;

            function init() {
                const container = document.getElementById('container');
                const loading = document.getElementById('loading');
                const controls = document.getElementById('controls');
                
                try {
                    // Créer la scène Three.js
                    scene = new THREE.Scene();
                    
                    // Créer la caméra
                    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
                    
                    // Créer le renderer avec optimisations
                    renderer = new THREE.WebGLRenderer({ 
                        antialias: true,
                        alpha: false,
                        powerPreference: "high-performance"
                    });
                    renderer.setSize(window.innerWidth, window.innerHeight);
                    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                    container.appendChild(renderer.domElement);
                    
                    // Créer la sphère pour l'image 360°
                    const geometry = new THREE.SphereGeometry(500, 64, 32);
                    geometry.scale(-1, 1, 1); // Inverser pour voir l'intérieur
                    
                    // Charger la texture depuis base64
                    const loader = new THREE.TextureLoader();
                    
                    loading.querySelector('div:last-child').textContent = 'Traitement de l\\'image...';
                    
                    loader.load(
                        '${base64Image}',
                        function(texture) {
                            console.log('Texture chargée avec succès');
                            
                            // Optimiser la texture
                            texture.minFilter = THREE.LinearFilter;
                            texture.magFilter = THREE.LinearFilter;
                            texture.format = THREE.RGBFormat;
                            
                            const material = new THREE.MeshBasicMaterial({ 
                                map: texture,
                                side: THREE.BackSide
                            });
                            sphere = new THREE.Mesh(geometry, material);
                            scene.add(sphere);
                            
                            // Masquer loading et afficher contrôles
                            loading.style.display = 'none';
                            controls.style.display = 'block';
                            
                            sendMessage({ type: 'loaded' });
                        },
                        function(progress) {
                            if (progress.lengthComputable) {
                                const percent = Math.round((progress.loaded / progress.total) * 100);
                                loading.querySelector('div:last-child').textContent = \`Chargement: \${percent}%\`;
                            }
                        },
                        function(error) {
                            console.error('Erreur chargement Three.js:', error);
                            loading.innerHTML = '<div style="color: #ff6b6b; font-size: 16px;">❌ Erreur de chargement</div><div style="font-size: 12px; margin-top: 10px;">Vérifiez le format de l\\'image</div>';
                            sendMessage({ type: 'error', message: 'Impossible de charger l\\'image dans Three.js' });
                        }
                    );
                    
                    // Événements tactiles
                    setupEvents(container);
                    
                    // Redimensionnement
                    window.addEventListener('resize', onWindowResize, false);
                    
                    // Démarrer l'animation
                    animate();
                    
                } catch (error) {
                    console.error('Erreur initialisation:', error);
                    loading.innerHTML = '<div style="color: #ff6b6b;">❌ Erreur d\\'initialisation</div>';
                    sendMessage({ type: 'error', message: 'Erreur d\\'initialisation Three.js' });
                }
            }
            
            function setupEvents(container) {
                // Événements de base
                container.addEventListener('pointerdown', onPointerDown, false);
                container.addEventListener('pointermove', onPointerMove, false);
                container.addEventListener('pointerup', onPointerUp, false);
                container.addEventListener('pointercancel', onPointerUp, false);
                
                // Zoom avec molette
                container.addEventListener('wheel', onMouseWheel, { passive: false });
                
                // Double-tap pour auto-rotation
                container.addEventListener('touchend', function(event) {
                    const currentTime = Date.now();
                    if (currentTime - lastTapTime < 300) {
                        toggleAutoRotation();
                        event.preventDefault();
                    }
                    lastTapTime = currentTime;
                }, false);
                
                // Pinch to zoom
                let initialDistance = 0;
                let initialFov = 75;
                
                container.addEventListener('touchstart', function(event) {
                    if (event.touches.length === 2) {
                        initialDistance = getDistance(event.touches[0], event.touches[1]);
                        initialFov = camera.fov;
                    }
                }, false);
                
                container.addEventListener('touchmove', function(event) {
                    if (event.touches.length === 2) {
                        event.preventDefault();
                        const distance = getDistance(event.touches[0], event.touches[1]);
                        const ratio = initialDistance / distance;
                        camera.fov = THREE.MathUtils.clamp(initialFov * ratio, 10, 100);
                        camera.updateProjectionMatrix();
                    }
                }, { passive: false });
            }
            
            function getDistance(touch1, touch2) {
                const dx = touch1.clientX - touch2.clientX;
                const dy = touch1.clientY - touch2.clientY;
                return Math.sqrt(dx * dx + dy * dy);
            }
            
            function onPointerDown(event) {
                isUserInteracting = true;
                isAutoRotating = false;
                
                onPointerDownMouseX = event.clientX;
                onPointerDownMouseY = event.clientY;
                onPointerDownLon = lon;
                onPointerDownLat = lat;
            }
            
            function onPointerMove(event) {
                if (isUserInteracting) {
                    lon = (onPointerDownMouseX - event.clientX) * 0.1 + onPointerDownLon;
                    lat = (event.clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;
                }
            }
            
            function onPointerUp() {
                isUserInteracting = false;
            }
            
            function onMouseWheel(event) {
                event.preventDefault();
                const fov = camera.fov + event.deltaY * 0.05;
                camera.fov = THREE.MathUtils.clamp(fov, 10, 100);
                camera.updateProjectionMatrix();
            }
            
            function toggleAutoRotation() {
                isAutoRotating = !isAutoRotating;
                
                // Afficher notification
                const notification = document.createElement('div');
                notification.style.cssText = \`
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 15px 25px;
                    border-radius: 25px;
                    font-size: 14px;
                    z-index: 2000;
                    backdrop-filter: blur(10px);
                \`;
                notification.textContent = isAutoRotating ? '🔄 Auto-rotation activée' : '⏹️ Auto-rotation désactivée';
                document.body.appendChild(notification);
                
                setTimeout(() => notification.remove(), 2000);
            }
            
            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
            
            function animate() {
                requestAnimationFrame(animate);
                update();
            }
            
            function update() {
                // Auto-rotation
                if (isAutoRotating && !isUserInteracting) {
                    lon += 0.1;
                }
                
                // Limiter la latitude
                lat = Math.max(-85, Math.min(85, lat));
                
                // Convertir en coordonnées sphériques
                phi = THREE.MathUtils.degToRad(90 - lat);
                theta = THREE.MathUtils.degToRad(lon);
                
                // Positionner la caméra
                camera.position.x = 100 * Math.sin(phi) * Math.cos(theta);
                camera.position.y = 100 * Math.cos(phi);
                camera.position.z = 100 * Math.sin(phi) * Math.sin(theta);
                
                camera.lookAt(0, 0, 0);
                
                if (renderer && scene && camera) {
                    renderer.render(scene, camera);
                }
            }
            
            function sendMessage(data) {
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify(data));
                }
            }
            
            // Initialiser
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                init();
            }
        </script>
    </body>
    </html>
  ` : '';

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data: WebViewMessage = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'loaded') {
        setIsLoading(false);
        setHasError(false);
        onLoad?.();
      } else if (data.type === 'error') {
        setIsLoading(false);
        setHasError(true);
        onError?.(data.message || 'Erreur de chargement');
      }
    } catch (error) {
      console.warn('Erreur parsing message:', error);
    }
  };

  // Ne pas afficher la WebView tant que l'image n'est pas convertie
  if (!imageMetadata || !imageMetadata.uri) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>❌ Aucune image fournie</Text>
          <Text style={styles.errorDescription}>
            Les métadonnées de l'image sont manquantes
          </Text>
        </View>
      </View>
    );
  }

  if (!base64Image && !hasError) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Préparation de l'image...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {/* WebView avec l'image 360° */}
      {base64Image && !hasError && (
        <WebView
          source={{ html: html360 }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          scalesPageToFit={false}
          scrollEnabled={false}
          bounces={false}
          onMessage={handleMessage}
          onError={(error) => {
            console.error('WebView Error:', error);
            setIsLoading(false);
            setHasError(true);
            onError?.('Erreur WebView');
          }}
          onHttpError={(error) => {
            console.error('HTTP Error:', error);
            setIsLoading(false);
            setHasError(true);
            onError?.('Erreur HTTP');
          }}
        />
      )}

      {/* Informations sur l'image */}
      {showInfo && !isLoading && !hasError && (
        <View style={styles.infoPanel}>
          <Text style={styles.title}>{imageMetadata.title}</Text>
          {imageMetadata.description && (
            <Text style={styles.description}>{imageMetadata.description}</Text>
          )}
        </View>
      )}

      {/* Indicateur de chargement */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Chargement de {imageMetadata.title}...</Text>
        </View>
      )}

      {/* Affichage d'erreur */}
      {hasError && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>❌ Erreur de chargement</Text>
          <Text style={styles.errorDescription}>
            Impossible d'afficher "{imageMetadata.title}"
          </Text>
          <Text style={styles.errorHint}>
            Vérifiez que l'image est au format JPEG ou PNG 360°
          </Text>
        </View>
      )}

      {/* Bouton de fermeture */}
      <View style={styles.closeButton}>
        <Text style={styles.closeButtonText}>✕</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
  },
  infoPanel: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderRadius: 10,
    backdropFilter: 'blur(10px)',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  errorDescription: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  errorHint: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default VirtualTour;