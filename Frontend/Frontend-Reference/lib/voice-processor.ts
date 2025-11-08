export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  // Use Web Speech API for speech recognition
  return new Promise((resolve, reject) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      reject(new Error("Speech Recognition not supported"))
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    let transcript = ""

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
    }

    recognition.onerror = (event: any) => {
      reject(new Error(`Speech recognition error: ${event.error}`))
    }

    recognition.onend = () => {
      resolve(transcript)
    }

    // Create audio context and process
    const audioContext = new AudioContext()
    audioContext.decodeAudioData(
      audioBlob.arrayBuffer() as any,
      () => {
        recognition.start()
      },
      (error) => {
        reject(error)
      },
    )
  })
}
