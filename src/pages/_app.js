import '../css/main.css';
import '../css/app.css';
import Chatbot from '../components/Chatbot';

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <Component {...pageProps} />
            <Chatbot />
        </>
    );
}
