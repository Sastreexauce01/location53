import { useAudioPlayer } from 'expo-audio';
const audioSource = require('../sound/Sound_Notification.wav');

export const PlaySound = () => {
  const player = useAudioPlayer(audioSource);
   player.play();
 
};