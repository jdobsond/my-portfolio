// pages/_app.tsx
import { useEffect } from 'react'
import { AppProps } from 'next/app'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        const script = document.createElement('script')
        script.innerHTML = `
      VANTA.WAVES({
        el: '#my-background',
        color: 0x90c0f,
        waveHeight: 20,
        shininess: 17,
        waveSpeed: 0.8,
        zoom: 0.5
      })`
        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    return (
        <div id="my-background" className="flex flex-col min-h-screen">
            <Component {...pageProps} />
        </div>
    )
}

export default MyApp