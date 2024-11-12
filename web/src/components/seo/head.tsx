import { Helmet } from 'react-helmet';

interface HeadProps {
    title?: string;
    description?: string;
}

export const Head = ({title, description}: HeadProps) => {
    return <Helmet
        title={title ? `${title} | Communiverse` : "Communiverse"}
        defaultTitle="Communiverse"
    >
        <meta name="description" content={description}/>
    </Helmet>
}